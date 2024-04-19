import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PageHeader from '../components/PageHeader';

import AsyncStorage from '@react-native-async-storage/async-storage';

class ChatViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatName: '',
      chats: [],
      error: null,
      chatID: null,
      userId: null,
      newMessage: '',
      isLoading: false,
      messages: [],
    }
  }


  async componentDidMount() {
    try {
      const usersToken = await AsyncStorage.getItem('whatsthat_session_token');
      const userId = await AsyncStorage.getItem('whatsthat_user_id');
      const chatID = this.props.route.params.chatID; 
      console.log('Chat ID:', chatID); 
      this.setState({ usersToken, userId, chatID, }, () => {
        this.getMessages();
      });
    } catch (error) {
      console.error('Error retrieving token from AsyncStorage:', error);
    }


  }


  sendMessage = async () => {
    const { usersToken, newMessage } = this.state;
    const { chatID } = this.props.route.params;
    
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatID}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': usersToken,
        },
        body: JSON.stringify({ message: newMessage }),
      });

      if (response.status === 200) {
        this.setState({ newMessage: '' }, () => {
          this.getMessages();
        });
      } else {
        
        throw new Error(`HTTP status code: ${response.status}`);
      }
    } catch (error) {
      this.setState({ error: error.message });
    }


  };

  getMessages = async (limit = 20, offset = 0) => {
    const { usersToken } = this.state;
    const { chatID } = this.props.route.params; 
  
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatID}?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': usersToken,
        },
      });
  
      if (response.status === 200) {
        const rJson = await response.json();
        this.setState({ 
          messages: rJson.messages,
          chatName: rJson.name });

      } else if (response.status === 401) {
        throw 'Unauthroised request. Please try and sign in ';
      } else if (response.status === 403) {
        throw 'No Access Granted. You do not have the permissions ';
      } else if (response.status === 500) {
        throw 'Server error. Please try again later';
      }
    } catch (error) {
      this.setState({ error });
    }
  };

  updateMessage = async (chatId, messageId, newMessage) => {
    const { usersToken } = this.state;
  
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': usersToken,
        },
        body: JSON.stringify({ message: newMessage }),
      });
  
      if (response.status !== 200) {
        // Handle server errors
        throw new Error(`HTTP status code: ${response.status}`);
      }
    } catch (error) {
      this.setState({ error: error.message });
    }
  
    this.getMessages();
  };

  deleteMessage = async (chatId, messageId) => {
    const { usersToken } = this.state;
  
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': usersToken,
        },
      });
  
      if (response.status !== 200) {
        // Handle server errors
        throw new Error(`HTTP status code: ${response.status}`);
      }
    } catch (error) {
      this.setState({ error: error.message });
    }
  
    this.getMessages();
  };

  handleDetailPress = () => {
    const { chat_id } = this.props.route.params;
    console.log('View Chat Details Pressed');
    this.props.navigation.navigate('ChatDetailScreen', { chat_id });

  };

  

  render() {
    const { newMessage, messages, isLoading, userId, chatName } = this.state;
  
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title={chatName} icon="info" onPress={this.handleDetailPress} />
        <FlatList
          inverted
          data={messages}
          keyExtractor={(item) => item.message_id.toString()}
          renderItem={({ item }) => (
            <View style={item.author.user_id.toString() === userId.toString() ? styles.myContainer : styles.otherContainer}>
            <Text style={styles.nameText}>
              {item.author.first_name} {item.author.last_name}
            </Text>
            <View style={item.author.user_id.toString() === userId.toString() ? styles.myMessage : styles.otherMessage}>
              <Text style={styles.messageText}>{item.message}</Text>
            </View>
          </View>
          )}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Message"
            value={newMessage}
            onChangeText={(text) => this.setState({ newMessage: text })}
          />
          <TouchableOpacity style={styles.sendButton} onPress={this.sendMessage}>
            <Icon name="paper-plane" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    height: 60,
  },
  heading: {},
  myContainer: {
    alignItems: 'flex-end',
    marginVertical: 5,
  },
  myMessage: {
    backgroundColor: 'purple',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    marginRight: 5,
  },
  otherMessage: {
    backgroundColor: 'darkgrey',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  messageText: {
    color: 'white',
  },
  nameText: {
    marginHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
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


export default ChatViewScreen;
