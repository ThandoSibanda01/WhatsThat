import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { Component } from 'react';
import { NavigationContainer } from "@react-navigation/native";

import ChatListScreen from "../screens/ChatList";
import ChatViewScreen from "../screens/ChatViewScreen"
import CreateChatScreen from "../screens/CreateChatScreen"
import ChatDetailsScreen from "../screens/ChatDetailScreen";
import MemberDetails from "../screens/MemberDetails";
import EditChatDetails from "../screens/EditChatDetails";




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
        <ChatsNav.Screen name='CreateChat' component={CreateChatScreen}/>
        <ChatsNav.Screen name='ChatDetails' component={ChatDetailsScreen}/>
        <ChatsNav.Screen name='MemberDetails' component={MemberDetails}/>
        <ChatsNav.Screen name = 'EditChatDetails' component ={EditChatDetails}/>


       
      </ChatsNav.Navigator>

      
      
    );
  }



}
  
  

