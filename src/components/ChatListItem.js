import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ChatListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      authorName: '',
      chat_id: '',
      navigationTool: '',
    };
  }

  componentDidMount() {
    this.checkUser(this.props.author_id);
  }

  

  getTimeDiff = (timestamp) => {


    if (!timestamp) {
      return "New chat"
    }
    const currentTime = new Date().getTime();
    const Diff = currentTime - timestamp;

    const seconds = Math.floor(Diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else {
      return `${seconds} seconds ago`;
    }
  };

  getID = async () => {
    try {
      const token = await AsyncStorage.getItem('whatsthat_user_id');
      return token;
    } catch (error) {
      throw 'Session Token Not found';
    }
  };

  checkUser = async (author_id) => {
    try {
      const id = await this.getID();
      if (id === author_id) {
        this.setState({ authorName: 'You' });
      } else {
        this.setState({ authorName: `${this.props.first_name} ${this.props.last_name}` });
      }
    } catch (error) {
      this.setState({ authorName: 'Unknown' });
    }
  };


  

  render() {
  const { chat_name, message, timestamp, navigationTool, chat_id } = this.props;
  const { authorName } = this.state;

    return (
      <TouchableOpacity style={styles.container} onPress={() => navigationTool(chat_id)}>
        <View style={styles.chatContainer}>
          <Text style={styles.title}>{chat_name}</Text>
          <Text style={styles.summary}>
          { (authorName !== 'Unknown' && authorName.trim() !== '') ? `${authorName}: ${message}` : message }
          </Text>
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{this.getTimeDiff(timestamp)}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    margin: 5,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },

  chatContainer: {
    flex: 1,
    marginRight: 10,
  },

  title: {
    color: 'purple',
    fontSize: 18,
  },

  summary: {
    color: '#333',
    fontSize: 12,
  },

  timeContainer: {
    alignItems: 'flex-end',
  },

  timeText: {
    color: '#666',
    fontSize: 12,
  },
});

export default ChatListItem;
