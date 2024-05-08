import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PageHeader from '../components/PageHeader';

import AsyncStorage from '@react-native-async-storage/async-storage';

class CreateChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatName: '',
      usersToken: null,
      error: null
    };
  }

  async componentDidMount() {
    try {
      const usersToken = await AsyncStorage.getItem('whatsthat_session_token');
      this.setState({ usersToken });
    } catch (error) {
      console.error('Error retrieving token from AsyncStorage:', error);
    }
  }

  createChat = async () => {
    const { usersToken, chatName } = this.state;
  
    // Validation check for the chatName length.
    if (chatName.trim().length < 2) {
      this.setState({ error: 'The chat name must be at least 2 characters long.' });
      return;
    }
  
    // Clear previous error messages.
    this.setState({ error: null });
  
    try {
      // Send POST request to create a new chat
      const response = await fetch('http://localhost:3333/api/1.0.0/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': usersToken,
        },
        body: JSON.stringify({ name: chatName }),
      });
  
      // Check response and set user-friendly messages accordingly
      if (response.status === 201) {
        // Chat created successfully
        this.setState({ chatName: '' });
        this.props.navigation.goBack(); // Assume goBack to chat list
      } else if (response.status === 400) {
        this.setState({ error: 'Invalid data submitted. Please check the chat name and try again.' });
      } else if (response.status === 401) {
        this.setState({ error: 'Unauthorized. Please log in again.' });
      } else if (response.status === 500) {
        this.setState({ error: 'Server error. Please try again later.' });
      } else {
        const errorText = await response.text();
        this.setState({ error: `Unexpected error: ${errorText}` });
      }
    } catch (error) {
      // Handle fetch errors, like network issues
      this.setState({ error: 'Failed to create the chat. Please check your network and try again.' });
    }
  };

  render() {
    const { chatName } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="Create New Chat" icon="plus" onPress={this.createChat} />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter chat name"
            value={chatName}
            onChangeText={(text) => this.setState({ chatName: text })}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  ontainer: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    padding: 10,
    backgroundColor: 'purple',
   
    
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
  sendButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'purple',
    borderRadius: 20,
  },
});

export default CreateChatScreen;
