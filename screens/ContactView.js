import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView,} from 'react-native';

class ContactView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: props.route.params.first_name,
      last_name: props.route.params.last_name,
      email: props.route.params.email,
      userID : props.route.params.user_id,
    };
  }

  blockUser = async () => {
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${this.userID}/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
  
      if (response.status >= 200 && response.status < 300) {
        console.log('User blocked successfully');
      } else if (response.status === 400) {
        throw 'You cannot block yourself';
      } else if (response.status === 401) {
        throw 'Unauthorized Request';
      } else if (response.status === 404) {
        throw 'User not found';
      } else if (response.status === 500) {
        throw 'Server Error';
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  addContact = async () => {
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${this.userID}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
  
      if (response.status >= 200 && response.status < 300) {
        console.log('Contact added successfully');
      } else if (response.status === 400) {
        throw 'You cannot add yourself as a contact';
      } else if (response.status === 401) {
        throw 'Unauthorized Request';
      } else if (response.status === 404) {
        throw 'User not found';
      } else if (response.status === 500) {
        throw 'Server Error';
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  ender() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.userContainer}>
          <Image
            source={require('../../src/assets/images/defaultDP.jpeg')}
            style={styles.image}
          />
          <Text style={styles.name}>{this.state.first_name} {this.state.last_name}</Text>
        </View>

        <View style={styles.emailBox}>
          <Text style={styles.Text}>Email:</Text>
          <Text style={styles.emailText}>{this.state.email}</Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={this.addContact()}>
          <Text style={styles.Text}>Add Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.blockBtn} onPress={this.blockUser()}>
          <Text style={styles.Text}>Block Contact</Text>
        </TouchableOpacity>

      </SafeAreaView>
    );
  }


}





const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  userContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 50,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 10,
  },
  name: {
    fontSize: 32,
  },
  emailBox: {
    backgroundColor: '#ffffff',
    width: '90%',
    height: 70,
    borderRadius: 3,
    justifyContent: 'center',
  },
  emailText: {
    fontSize: 18,
    marginLeft: 15,
  },
  Text: {
    fontSize: 14,
    marginLeft: 15,
  },

    addBtn: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
    borderRadius: 5,
  },

  blockBtn: {
    height: 40,
    borderColor: 'red',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
    borderRadius: 5,
  },
});

export default ContactView;
