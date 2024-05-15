import React, { Component } from 'react';
import { SafeAreaView, TextInput, FlatList, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
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
      contacts: [],
      error: '',
    };
  }

  async componentDidMount() {
    const sessionToken = await AsyncStorage.getItem('whatsthat_session_token');
    this.setState({ sessionToken }, this.fetchContacts);
  }

  fetchContacts = async () => {
    const { sessionToken } = this.state;
    if (sessionToken) {
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

  getUsers = async () => {
    if (!this.state.isLoading && this.state.search) {
      try {
        this.setState({ isLoading: true, users: [] });
        const { sessionToken, search } = this.state;
        const response = await fetch(`http://localhost:3333/api/1.0.0/search?q=${search}&search_in=all&limit=20&offset=0`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionToken,
          },
        });

        if (response.status === 200) {
          const rJson = await response.json();
          this.setState({ users: rJson });
        } else if (response.status === 401) {
          throw new Error('Unauthorized Request');
        } else if (response.status === 500) {
          throw new Error('Server Error');
        }
      } catch (error) {
        this.setState({ error: 'Error: ' + error.message });
      } finally {
        this.setState({ isLoading: false });
      }
    }
  };

  isUserInContacts = (userID) => {
    const { contacts } = this.state;
    return contacts.some(contact => contact.user_id === userID);
  };

  handleUserPress = (userID) => {
    if (this.isUserInContacts(userID)) {
      this.props.navigation.navigate('ContactDetails', { userID });
    } else {
      this.props.navigation.navigate('UserProfile', { userID });
    }
  };

  render() {
    const { search, users, error } = this.state;

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
            value={search}
            onChangeText={(input) => this.setState({ search: input })}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <FlatList
          keyExtractor={(item) => item.user_id.toString()}
          data={users}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.handleUserPress(item.user_id)}>
              <ContactListItemSmall
                userid={item.user_id}
                firstname={item.given_name}
                surname={item.family_name}
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
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default SearchScreen;
