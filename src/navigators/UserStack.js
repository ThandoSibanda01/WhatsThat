import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { Component } from 'react';
import { NavigationContainer } from "@react-navigation/native";


import Profile from "../screens/Profile";
import BlockedList from '../screens/BlockedList';
import BlockedUser from "../screens/BlockedUser";
import EditUserProfile from "../screens/EditProfile";

const UserNav = createNativeStackNavigator();

export default class UserStack extends Component {
    render() {
        return (
            
            <UserNav.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <UserNav.Screen name="Profile" component={Profile} />
                <UserNav.Screen name="BlockedList" component={BlockedList} />
                <UserNav.Screen name="BlockedUser" component={BlockedUser}/>
                <UserNav.Screen name="EditUserProfile" component={EditUserProfile}/>

                
               
                

            </UserNav.Navigator>
        );
    }
}
