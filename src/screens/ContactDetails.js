import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PageHeader from '../components/PageHeader';

class ContactDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: "",
            surname: "",
            email: "",
            imageUri: null,
            userID: props.route.params.userID,
            chatID: props.route.params.chatID,
            error: ''
        };
    }

    async componentDidMount() {
        
        try {
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


    removeUser = async () => {
        this.setState({ isLoading: true, error: null });
        const token = await AsyncStorage.getItem('whatsthat_session_token');
        try {
            const response = await fetch(`http://localhost:3333/api/1.0.0/user/${this.state.userID}/contact`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': token,
                },
            });

            if (response.ok) {
               console.log(`Removed: ${this.state.userID}`)
    
            } else {
                throw new Error(`Failed to remove user:${response}`);
            }
        } catch (error) {
            console.log(`Removed: ${this.state.userID}`)
            this.setState({ error: error.message });
        } finally {
            this.setState({ isLoading: false });
        }
    };

    blockUser = async () => {
        this.setState({ isLoading: true, error: null });
        const token = await AsyncStorage.getItem('whatsthat_session_token');
        try {
            const response = await fetch(`http://localhost:3333/api/1.0.0/user/${this.state.userID}/block`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': token,
                },
            });

            if (response.ok) {
                Alert.alert("Success", "User removed from chat successfully");
                this.props.navigation.navigate('ChatList');
            } else {
                throw new Error(`Failed to remove user from chat:${response}`);
            }
        } catch (error) {
            Alert.alert("Error", error.message);
            this.setState({ error: error.message });
        } finally {
            this.setState({ isLoading: false });
        }
    };

    handleBlock = async () => {
        try {
            const sessionToken = await AsyncStorage.getItem('whatsthat_session_token');
            if (!sessionToken) {
                throw new Error('Session token not found');
            }
    
            const userID = this.state.userID;
            if (!userID) {
                throw new Error('User ID not found');
            }
    
            console.log(`Blocking user with ID: ${userID}`);
    
            const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userID}/block`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': sessionToken,
                },
            });
    
            if (response.status === 200) {
                console.log('User blocked successfully');
                // Handle successful block action
            } else {
                const errorMessage = await response.text();
                throw new Error(`Failed to block user with status: ${response.status}, message: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error during block:', error);
            this.setState({ error: 'Error during block: ' + error.message });
        }
    };



    
    render() {
        const { firstname, surname, email, imageUri } = this.state;

        return (
            <SafeAreaView style={styles.container}>
                <PageHeader title="Profile"  />
                
                <View style={styles.profileSection}>
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.profilePic}
                    />

                    <Text style={styles.nameText}>{firstname} {surname}</Text>
                    <Text style={styles.emailText}>{email}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={this.removeUser} style={styles.button}>
                        <Text style={styles.buttonText}>Delete Contact</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.handleBlock} style={styles.button}>
                        <Text style={styles.buttonText}>Block</Text>
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

export default ContactDetails;