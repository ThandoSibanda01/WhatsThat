import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../components/Logo';
import { useNavigation } from '@react-navigation/native';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const navigation = useNavigation();

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3333/api/1.0.0/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const rJson = await response.json();

      if (response.status >= 200 && response.status < 300) {
        await AsyncStorage.setItem('whatsthat_user_id', rJson.id.toString());
        await AsyncStorage.setItem('whatsthat_session_token', rJson.token);
        navigation.navigate('main');
      } else {
        throw new Error('Login failed with status: ' + response.status);
      }
    } catch (error) {
      console.error(error);
      setError('Login failed: ' + error.message);
    }
  };

  const onPressButton = async () => {
  
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitted(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3333/api/1.0.0/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
        }),
      });

      if (response.status === 201) {
       
        await login(email, password);
      } else if(response === 400) {
        throw new Error("Bad Request, Please try again later");
      }
    } catch (error) {
      console.error(error);
      setError('Registration failed: ' + error.message);
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Logo/>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder='First Name'
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder='Last Name'
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder='Password'
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder='Confirm Password'
          secureTextEntry={true}
          value={confirm}
          onChangeText={setConfirm}
        />
        

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={onPressButton}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton} onPress={() => this.props.navigation.navigate('login')}>
            <Text style={styles.registerButtonText}>Already have an Account?</Text>
        </TouchableOpacity>

       

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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

export default Register;
