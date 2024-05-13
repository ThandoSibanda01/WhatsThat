import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PageHeader from '../components/PageHeader';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: "",
            surname: "",
            email: "",
            imageUri: null,
            userID: '',
            error: ''
        };
    }

    async componentDidMount() {
        try {
            await this.fetchUserID();
            if (this.state.userID) {
                await this.getUserDisplayPicture();
                await this.getUserDetails();
            } else {
                console.log("No user ID available after fetchUserID.");
            }
        } catch (error) {
            console.error("Error in componentDidMount:", error);
        }
    }

    fetchUserID = async () => {
        try {
            const userID = await AsyncStorage.getItem('whatsthat_user_id');
            if (userID !== null) {
                this.setState({ userID }); 
            } else {
                console.log("No user ID found");
            }
        } catch (error) {
            console.error('Error retrieving user ID:', error);
        }
    };

    getUserDetails = async () => {
        try {
            const sessionToken = await AsyncStorage.getItem('whatsthat_session_token');
            const response = await fetch(`http://localhost:3333/api/1.0.0/user/${this.state.userID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': sessionToken,
                },
            });
    
            if (response.status === 200) {
                const rJson = await response.json();
                this.setState({
                    firstname: rJson.first_name,
                    surname: rJson.last_name,
                    email: rJson.email
                });
            } else {
                throw new Error('Failed to fetch user details with status: ' + response.status);
            }
        } catch (error) {
            this.setState({ error: 'Error: ' + error.message });
        }
    };

    getUserDisplayPicture = async () => {
        try {
            const sessionToken = await AsyncStorage.getItem('whatsthat_session_token');
            const response = await fetch(`http://localhost:3333/api/1.0.0/user/${this.state.userID}/photo`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': sessionToken,
                },
            });
            if (response.ok) {
                const imageBlob = await response.blob();
                const imageUri = URL.createObjectURL(imageBlob);
                this.setState({ imageUri });
            } else {
                throw new Error('Failed to fetch image with status: ' + response.status);
            }
        } catch (error) {
            console.log('Error fetching user display picture:', error);
            this.setState({ error: 'Error fetching picture: ' + error.message });
        }
    };

    handleLogout = async () => {
        try {
            const sessionToken = await AsyncStorage.getItem('whatsthat_session_token');
            const response = await fetch(`http://localhost:3333/api/1.0.0/logout`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': sessionToken,
                },
            });
    
            if (response.status === 200) {
                await AsyncStorage.removeItem('whatsthat_user_id');
                await AsyncStorage.removeItem('whatsthat_session_token');
                navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'AuthStack' }],  // 'AuthStack' should be the initial route name of your Auth Stack
                    })
                  );
            } else {
                throw new Error('Failed logout with status: ' + response.status);
            }
        } catch (error) {
            this.setState({ error: 'Error during logout: ' + error.message });
        }
    };

    render() {
        const { firstname, surname, email, imageUri } = this.state;

        return (
            <SafeAreaView style={styles.container}>
                <PageHeader title="Profile" icon='pencil' />
                
                <View style={styles.profileSection}>
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.profilePic}
                    />

                    <Text style={styles.nameText}>{firstname} {surname}</Text>
                    <Text style={styles.emailText}>{email}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={this.handleBlock} style={styles.button}>
                        <Text style={styles.buttonText}>Blocked Users</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.handleLogout} style={styles.button}>
                        <Text style={styles.buttonText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    profileSection: {
        alignItems: 'center',
        marginTop: 20,
    },
    profilePic: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    nameText: {
        fontSize: 20,
        marginTop: 10,
    },
    emailText: {
        fontSize: 16,
        color: 'gray',
        marginTop: 5,
    },
    buttonContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'purple',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: 200,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Profile;