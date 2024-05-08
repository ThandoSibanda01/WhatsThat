import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { Component } from 'react';
import { NavigationContainer } from "@react-navigation/native";

import SearchScreen from "../screens/SearchScreen";
import ContactView from "../screens/ContactView";

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
          <ContactNav.Screen name="Profile" component={ContactView}/>
          
        </ContactNav.Navigator>

      
      
    );
  }


}