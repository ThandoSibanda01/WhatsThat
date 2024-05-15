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

class BlockedUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: "",
            surname: "",
            email: "",
            img: null,
            userID: props.route.params.userID,
        };
    }

    async componentDidMount() {
        try {
            if (this.state.userID) {
                await this.getUserDisplayPicture();
                await this.getUserDetails();
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
            }
        } catch (error) {
            console.error('Error retrieving user ID:', error);
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
            } else if (response.status === 401) {
                throw new Error('Unauthorized Request');
            } else if (response.status === 500) {
                throw new Error('Server Error');
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
            
            if (response.status === 200) {
                const imageBlob = await response.blob();
                const imageUri = URL.createObjectURL(imageBlob);
                this.setState({ img: imageUri });
            }
        } catch (error) {
            console.log(error);
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
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': sessionToken,
                },
            });
    
            if (response.status === 200) {
                console.log('User unblocked successfully');
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
        const { firstname, surname, email, img } = this.state;

        return (
            <SafeAreaView style={styles.container}>
                <PageHeader title="Blocked Profile" icon='minus' onPress={this.handleBlock} />
                
                <View style={styles.profileSection}>
                    {img ? (
                        <Image source={{ uri: img }} style={styles.profilePic} />
                    ) : (
                        <View style={styles.profilePic} />
                    )}
                    <Text style={styles.nameText}>{firstname} {surname}</Text>
                    <Text style={styles.emailText}>{email}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={this.handleBlock} style={styles.button}>
                        <Text style={styles.buttonText}>Unblock</Text>
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

export default BlockedUser;
