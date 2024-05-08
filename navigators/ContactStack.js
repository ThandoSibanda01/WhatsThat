import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { Component } from 'react';
import { NavigationContainer } from "@react-navigation/native";

import ContactList from "../screens/ContactList";
import ContactView from "../screens/ContactView";

const ContactNav = createNativeStackNavigator();


export default class ContactStack extends Component{

  render(){
    return (
     
        <ContactNav.Navigator
          screenOptions={{
            headerShown: false,
            initialRouteName: 'ContactList'
          }}
        >
          
          <ContactNav.Screen name="ContactList" component={ContactList}/>
          <ContactNav.Screen name="ContactDetails" component={ContactView}/>
        </ContactNav.Navigator>

      
      
    );
  }


}