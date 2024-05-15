import React, { Component } from 'react';
import { SafeAreaView, TextInput, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import PageHeader from '../components/PageHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EditUserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirm: '',
      isLoading: false,
      sessionToken: '',
      error: '',
      success: '',
    };
  }

  async componentDidMount() {
    const sessionToken = await AsyncStorage.getItem('whatsthat_session_token');
    const userID = await AsyncStorage.getItem('whatsthat_user_id');
    this.setState({ sessionToken, userID }, this.fetchUserProfile);
  }

  fetchUserProfile = async () => {
    const { sessionToken, userID } = this.state;

    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': sessionToken,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        const userProfile = await response.json();
        this.setState({
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
          email: userProfile.email,
        });
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      this.setState({ error: 'Error: ' + error.message });
    }
  };

  updateUserProfile = async () => {
    const { firstName, lastName, email, password, confirm, sessionToken, userID } = this.state;

    if (password !== confirm) {
      this.setState({ error: "Passwords don't match." });
      return;
    }

    this.setState({ isLoading: true, error: '', success: '' });

    try {
      const userDetails = { first_name: firstName, last_name: lastName, email };

      if (password) {
        userDetails.password = password;
      }

      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': sessionToken,
        },
        body: JSON.stringify(userDetails),
      });

      if (response.status >= 200 && response.status < 300) {
        this.setState({ success: 'Profile updated successfully!', error: '' });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      this.setState({ error: 'Error: ' + error.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { firstName, lastName, email, password, confirm, isLoading, error, success } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <PageHeader
          title="Edit User Profile"
          icon="save"
          onPress={this.updateUserProfile}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={(text) => this.setState({ firstName: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={(text) => this.setState({ lastName: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => this.setState({ email: text })}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => this.setState({ password: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={true}
            value={confirm}
            onChangeText={(text) => this.setState({ confirm: text })}
          />
        </View>

        {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={this.updateUserProfile}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
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
    backgroundColor: 'green',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: 'purple',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    paddingLeft: 10,
  },
  successText: {
    color: 'green',
    marginTop: 10,
    paddingLeft: 10,
  },
});

export default EditUserProfile;

