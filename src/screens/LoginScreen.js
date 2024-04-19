import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../components/Logo';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
      isLoading: false,
    };
  }

  onPressButton = () => {
    const { email, password, isLoading } = this.state;

    if (isLoading) {
      return;
    }

    const validator = require('email-validator');
    const PasswordRegEx = new RegExp(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/);

    let isValid = true;

    if (!validator.validate(email)) {
      this.setState({ error: 'Incorrect Email' });
      isValid = false;
      return;
    }
    if (!PasswordRegEx.test(password)) {
      this.setState({ error: 'Incorrect Password' });
      isValid = false;
      return;
    }

    this.setState({ isLoading: true });

    fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          throw new Error('Server response not OK');
        }
      })
      .then(async (rJson) => {
        try {
          await AsyncStorage.setItem('whatsthat_user_id', rJson.id);
          await AsyncStorage.setItem('whatsthat_session_token', rJson.token);
          console.log('Login Successful');
          this.props.navigation.navigate('main');
        } catch {
          throw new Error('Error: Failed to get Session Token');
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => this.setState({ isLoading: false }));
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value != null) {
      this.props.navigation.navigate('main');
    }
  };

  componentDidMount() {
    this.checkLoggedIn();
  }

  render() {
    const { email, password, error, isLoading } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Logo />
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            autoComplete='email'
            keyboardType='email-address'
            placeholder='Email'
            value={email}
            onChangeText={(text) => this.setState({ email: text })}
          />
          <TextInput
            style={styles.input}
            autoComplete='current-password'
            secureTextEntry={true}
            placeholder='Password'
            value={password}
            onChangeText={(text) => this.setState({ password: text })}
          />
          
          <TouchableOpacity style={styles.button} onPress={this.onPressButton} disabled={isLoading}>
            <Text style={styles.buttonText}>{isLoading ? 'Logging in...' : 'Log in'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerButton} onPress={() => this.props.navigation.navigate('signup')}>
            <Text style={styles.registerButtonText}>Need an account?</Text>
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  form: {
    marginTop: 50,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'purple',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});
