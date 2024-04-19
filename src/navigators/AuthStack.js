import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { Component } from 'react';
import { NavigationContainer } from "@react-navigation/native";

import LoginScreen from "../screens/LoginScreen";
import Register from "../screens/RegisterScreen";
import MainApp from "./MainAppNav";

const AuthStack = createNativeStackNavigator();

export default class AuthorizationStack extends Component {

  render(){
    return (
      <NavigationContainer>
        <AuthStack.Navigator
          screenOptions={{
            headerShown: false,
            initialRouteName: 'login'
          }}
        >
          <AuthStack.Screen name='login' component={LoginScreen} />
          <AuthStack.Screen name='signup' component={Register} />
          <AuthStack.Screen name='main' component={MainApp} />
        </AuthStack.Navigator>
      </NavigationContainer>
    )

  }
  
};

