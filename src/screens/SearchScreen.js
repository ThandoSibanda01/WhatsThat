import React, { Component } from 'react';
import { SafeAreaView, TextInput, FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';
import ContactListItem from '../components/contactListItem';
import PageHeader from '../components/PageHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      isLoading: false,
      users: [],
      error: '',
    };
  }





  getUsers = async (name) => {
    if (!this.state.isLoading) {
      try {
        this.setState({ isLoading: true });

        const response = await fetch(`http://localhost:3333/api/1.0.0/search?q=${name}&search_in=all&limit=20&offset=0`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
          },
        });

        if (response.status === 200) {
          const rJson = await response.json();
          this.setState({ users: rJson });
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
    const { sessionToken, users } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <PageHeader
          title="Search"
          
        />
      <TextInput 
        style={styles.input} 
        placeholder="Search" 
        onChangeText={async (input) => {
          this.setState({ search: input });
          await this.getUsers(input);
        }}
      ></TextInput>


      <FlatList
          keyExtractor={(item) => item.user_id.toString()}
          data={users}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              
                <ContactListItem
                  userID={item.user_id}
                  sessionToken={sessionToken}
                  firstname={item.first_name}
                  surname={item.last_name}
                />
              
              
            </View>
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
  listItem: {
    marginTop: 3,
    backgroundColor: '#f8f8f8',
    flex: 1,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default SearchScreen;
