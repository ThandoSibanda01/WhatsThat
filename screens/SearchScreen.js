import React, { Component } from 'react';
import { SafeAreaView, TextInput, FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';
import ContactListItem from '../components/ContactListItemSmall';
import PageHeader from '../components/PageHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContactListItemSmall from '../components/ContactListItemSmall';

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
        this.setState({ users: null });


        const response = await fetch(`http://localhost:3333/api/1.0.0/search?q=Ash&search_in=all&limit=20&offset=0`, {
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
    const { search, users, sessionToken } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <PageHeader
          title="Search"
          icon="search"
          onPress={this.getUsers}
          
        />

      <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={this.search}
            onChangeText={(input) => {
              this.setState({ search: input });
            }}
          />
      </View>

      


      <FlatList
          keyExtractor={(item) => item.user_id.toString()}
          data={users}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              
                <ContactListItemSmall
                  userid={item.user_id}
                  firstname={item.given_name}
                  surname={item.family_name}
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

  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    paddingLeft: 10,
  },

  listItem: {
    marginTop: 3,
    flex: 1,
   
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default SearchScreen;
