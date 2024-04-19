import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView} from 'react-native';
import Logo from '../components/Logo';


const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameError, setNameError] = useState('');

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');


  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [userId, setUserId] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);


  const navigation = useNavigation();


  const onPressButton = () => {
    const NameRegEx = new RegExp(/^[A-Za-z]{3,}$/);
    const validator = require('email-validator');
    const PasswordRegEx = new RegExp(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/);

    let isValid = true;


    if (!NameRegEx.test(firstName) || !NameRegEx.test(lastName) ) {
      setNameError('Please Enter first and last names.');
      isValid = false;
    }

    if (!validator.validate(email)) {
      setEmailError('Please Enter a Valid Email Address');
      isValid = false;
    }

    if (!PasswordRegEx.test(password)) {
      setPasswordError('Please Enter a Valid Password');
      isValid = false;
    }

    if (password != confirm ) {
      setConfirmError('Those passwords didn’t match. Try again.');
      isValid = false;
    }


    if (isValid && !submitted) {
      setSubmitted(true);
      

      return fetch('http://localhost:3333/api/1.0.0/user',
          {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'first_name': firstName,
              'last_name': lastName,
              'email': email,
              'password': password,
            }),
          })
          .then((response) => {
            if (response.status === 201) {
              this.props.navigation.navigate('login')
              return response.json();
            
            } else if (response.status === 400) {
              throw 'Bad Request';
            } else if (response.status === 500) {
              throw 'Server Error, Please try again later';
            }
          })
          .then((rJson) => {
            
            setSubmitted(false);
          })
          .catch((error) => {
            setError(error);
            setSubmitted(false);
          });
    }
  };


  return (
    <SafeAreaView style={styles.container}>

      <Logo/>

      <View style={styles.form}>

        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        <TextInput
          style={styles.input}
          autoComplete='given-name'
          keyboardType='default'
          placeholder='First Name '
          value={firstName}
          onChangeText={(input) => {
            setFirstName(input);
            setNameError('');
          }}
        />

        <TextInput
          style={styles.input}
          autoComplete='family-name'
          keyboardType='default'
          placeholder='Last Name'
          value={lastName}
          onChangeText={(input) => {
            setLastName(input);
            setNameError('');
          }}
        />


        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <TextInput
          style={styles.input}
          autoComplete='email'
          keyboardType='email-address'
          placeholder='Email'
          value={email}
          onChangeText={(input) => {
            setEmail(input);
            setEmailError('');
          }}
        />


        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        <TextInput
          style={styles.input}
          autoComplete='new-password'
          keyboardType='default'
          placeholder='Password'
          secureTextEntry={true}
          value={password}
          onChangeText={(input) => {
            setPassword(input);
            setPasswordError('');
          }}
        />


        {confirmError ? <Text style={styles.errorText}>{confirmError}</Text> : null}
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          autoComplete='new-password'
          placeholder='Confirm'
          value={confirm}
          onChangeText={(input) => {
            setConfirm(input);
            setConfirmError('');
          }}
        />


        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={onPressButton}>
          <Text style={styles.buttonText}>Register</Text>
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
  image: {
    height: 200,
    width: 200,
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
