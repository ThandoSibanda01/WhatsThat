import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { Component } from 'react';
import { NavigationContainer } from "@react-navigation/native";







const SingleChatNav = createNativeStackNavigator();


export default class SingleChatStack extends Component{

  render(){
    return (

      

        <SingleChatNav.Navigator
          screenOptions={{
            headerShown: false,
          }}
        
        >

        

         <SingleChatNav.Screen name='ChatViewScreen' component={ChatViewScreen} />
         <SingleChatNav.Screen name='CreateChatScreen' component={CreateChatScreen} />

       
        </SingleChatNav.Navigator>

      
      
    ); 
  }

  
}