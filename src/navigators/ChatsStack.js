import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { Component } from 'react';
import { NavigationContainer } from "@react-navigation/native";

import ChatListScreen from "../screens/ChatList";
import ChatViewScreen from "../screens/ChatViewScreen"




const ChatsNav = createNativeStackNavigator();

export default class ChatsStack extends Component{

  render(){
    return (
     
        <ChatsNav.Navigator
          screenOptions={{
            headerShown: false,
            initialRouteName: 'ChatList'
          }}
        >
          
        <ChatsNav.Screen name='ChatList' component={ChatListScreen} />
        <ChatsNav.Screen name='SingleChat' component={ChatViewScreen}/>

       
      </ChatsNav.Navigator>

      
      
    );
  }



}
  
  

