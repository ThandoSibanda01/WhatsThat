import React, { Component } from 'react';
import { FlatList, View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native-web';
import ContactListItem from '../components/contactListItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PageHeader from '../components/PageHeader';

class ContactList extends Component {
  state = {
    contacts: [],
    error: '',
    sessionToken: null,
    isLoading: false
  };

  async componentDidMount() {
    try {
      const usersToken = await AsyncStorage.getItem('whatsthat_session_token');
      this.setState({ sessionToken: usersToken }, () => {
        this.fetchContacts();
      });
    } catch (error) {
      console.error('Error retrieving token from AsyncStorage:', error);
    }
  }

  handleHeaderIconPress = () => {

    console.log('View Chat Details Pressed');
  };

  fetchContacts = async () => {
    const { isLoading, sessionToken } = this.state;
    if (!isLoading && sessionToken) {
      this.setState({ isLoading: true });
      try {
        const response = await fetch('http://localhost:3333/api/1.0.0/contacts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionToken,
          },
        });

        if (response.status >= 200 && response.status < 300) {
          const rJson = await response.json();
          this.setState({ contacts: rJson });
        } else if (response.status === 401) {
          throw 'Unauthorised Request';
        } else if (response.status === 500) {
          throw 'Server Error';
        }
      } catch (error) {
        this.setState({ error: 'Error: ' + error });
      } finally {
        this.setState({ isLoading: false });
      }
    }
  };

 

  render() {
    const { navigation } = this.props;
    const { contacts, isLoading, sessionToken } = this.state;
  
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader
          title="Contacts"
          icon="plus-square-o"
          onPress={this.handleHeaderIconPress}
        />
        <FlatList
          keyExtractor={(item) => item.user_id.toString()}
          data={contacts}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <ContactListItem 
                userID={item.user_id} 
                sessionToken={this.state.sessionToken}
                firstname={item.first_name} 
                surname={item.last_name} 
              />

            </TouchableOpacity>
            
          )}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
 

  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default ContactList;

