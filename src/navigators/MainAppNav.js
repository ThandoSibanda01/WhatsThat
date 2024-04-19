
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/FontAwesome';

import ContactStack from "./ContactStack";
import ChatsStack from './ChatsStack';
import SearchStack from './SearchStack';



const MainAppNav = createBottomTabNavigator();



export default class MainApp extends Component{
  render(){
    return (
      
        <MainAppNav.Navigator
        screenOptions={{
          headerShown: false,
          initialRouteName: 'Chats'
        }}
        >
         
          <MainAppNav.Screen 
            name='Contacts'
            component={ContactStack}
            options={{
              
              tabBarIcon: ({}) => (
                <Icon name="address-book-o" color={"purple"} size={20} />
              ),
            }}
            

          />
          <MainAppNav.Screen 
            name='Chats'
            component={ChatsStack}
            options={{
              
              tabBarIcon: ({}) => (
                <Icon name="comments" color={"purple"} size={20} />
              ),
            }} />


          <MainAppNav.Screen 
            name='Search' 
            component={SearchStack}
            options={{
              
              tabBarIcon: ({}) => (
                <Icon name="search" color={"purple"} size={20} />
              ),
            }} 


          />

        
        </MainAppNav.Navigator>
    
     
    );
  }
}