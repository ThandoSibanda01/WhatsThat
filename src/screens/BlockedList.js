import React, { Component } from 'react';
import { FlatList, View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PageHeader from '../components/PageHeader';
import ContactListItemSmall from '../components/ContactListItemSmall';
import MainAppNav from '../navigators/MainAppNav';

class BlockedList extends Component {
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
        this.fetchBlockedList();
      });
    } catch (error) {
      console.error('Error retrieving token from AsyncStorage:', error);
    }
  }

  handleHeaderIconPress = () => {
    this.props.navigation.navigate('Search');

    
  };

  fetchBlockedList = async () => {
    const { isLoading, sessionToken } = this.state;
    if (!isLoading && sessionToken) {
      this.setState({ isLoading: true });
      try {
        const response = await fetch('http://localhost:3333/api/1.0.0/blocked', {
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

  handleUserPress = (userNumber) => {
    this.props.navigation.navigate('BlockedUser', {userID: userNumber} )

  };

 

  render() {
    const { navigation } = this.props;
    const { contacts, isLoading, sessionToken } = this.state;
  
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader
          title="Blocked"
          
        />
        <FlatList
          keyExtractor={(item) => item.user_id.toString()}
          data={contacts}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.handleUserPress(item.user_id)}>
              <ContactListItemSmall 
                userid={item.user_id} 
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
    backgroundColor: '#f5f5f5',
    
  },
 

  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default BlockedList;

