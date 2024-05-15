import React, { Component } from 'react';
import { SafeAreaView, TextInput, FlatList, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import PageHeader from '../components/PageHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContactListItemSmall from '../components/ContactListItemSmall';

class EditChatDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatID: this.props.route.params.chatID,
      newName: '',
      contacts: [],
      chatDetails: {},
      isLoading: false,
      sessionToken: '',
      error: '',
    };
  }

  async componentDidMount() {
    const sessionToken = await AsyncStorage.getItem('whatsthat_session_token');
    this.setState({ sessionToken }, () => {
      this.fetchChatDetails();
      this.fetchContacts();
    });
  }

  fetchChatDetails = async () => {
    const { chatID, sessionToken } = this.state;

    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': sessionToken,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        const chatDetails = await response.json();
        this.setState({ chatDetails, newName: chatDetails.name });
      } else {
        throw new Error('Failed to fetch chat details');
      }
    } catch (error) {
      this.setState({ error: 'Error: ' + error.message });
    }
  };

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

  updateChatDetails = async () => {
    const { chatID, newName, sessionToken } = this.state;

    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': sessionToken,
        },
        body: JSON.stringify({ name: newName }),
      });

      if (response.status >= 200 && response.status < 300) {
        await this.fetchChatDetails();
      } else if (response.status === 400) {
        throw new Error('Bad request. Please check the chat name.');
      } else {
        throw new Error('Failed to update chat details');
      }
    } catch (error) {
      this.setState({ error: 'Error: ' + error.message });
    }
  };

  isUserInChat = (userID) => {
    const { chatDetails } = this.state;
    return chatDetails.members.some(member => member.user_id === userID);
  };

  addUserToChat = async (userID) => {
    const { chatID, sessionToken } = this.state;

    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatID}/user/${userID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': sessionToken,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        console.log(`User ${userID} added to chat ${chatID}`);
        // Refresh chat details to reflect the new member
        this.fetchChatDetails();
      } else if (response.status === 400) {
        throw new Error('Bad request. Please check the user ID.');
      } else if (response.status === 401) {
        throw new Error('Unauthorized. Please log in.');
      } else if (response.status === 403) {
        throw new Error('Forbidden. You do not have permission to add users to this chat.');
      } else if (response.status === 404) {
        throw new Error('Not found. Please check the chat ID.');
      } else {
        throw new Error('Failed to add user to chat');
      }
    } catch (error) {
      this.setState({ error: 'Error: ' + error.message });
    }
  };

  handleUserPress = (userID) => {
    console.log(userID);
    this.addUserToChat(userID);
  };

  render() {
    const { chatDetails, newName, contacts, error } = this.state;

    // Filter out contacts who are already in the chat
    const filteredContacts = contacts.filter(contact => !this.isUserInChat(contact.user_id));

    return (
      <SafeAreaView style={styles.container}>
        <PageHeader
          title="Edit Chat Details"
          icon="pencil"
          onPress={this.updateChatDetails}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Chat Name"
            value={newName}
            onChangeText={(text) => this.setState({ newName: text })}
          />
        </View>

        <Text style={styles.sectionHeader}>Add to Chat</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <FlatList
          keyExtractor={(item) => item.user_id.toString()}
          data={filteredContacts}
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
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
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
  sectionHeader: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  contactItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    paddingLeft: 10,
  },
});

export default EditChatDetails;
