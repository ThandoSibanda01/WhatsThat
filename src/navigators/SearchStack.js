import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { Component } from 'react';
import { NavigationContainer } from "@react-navigation/native";

import SearchScreen from "../screens/SearchScreen";
import UserProfile from "../screens/UserProfile";
import ContactDetails from "../screens/ContactDetails";


const ContactNav = createNativeStackNavigator();


export default class SearchStack extends Component{

  render(){
    return (
     
        <ContactNav.Navigator
            screenOptions={{
                headerShown: false,
                initialRouteName: 'SearchScreen'
                }}
        >

            
          <ContactNav.Screen name="SearchScreen" component={SearchScreen}/>
          <ContactNav.Screen name="UserProfile" component={UserProfile}/>
          <ContactNav.Screen name="ContactDetails" component={ContactDetails}/>
          
        </ContactNav.Navigator>

      
      
    );
  }


}