import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ContactListItemSmall extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUri: null,
            error: null,
        };
    }

    async componentDidMount() {
        this.fetchUserDisplayPicture();
    }

    fetchUserDisplayPicture = async () => {
        try {
            const { userid } = this.props;  // Retrieve userid passed via props
            const token = await AsyncStorage.getItem('whatsthat_session_token');
            const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userid}/photo`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': token,
                },
            });

            if (response.ok) {
                const imageBlob = await response.blob();
                const imageUri = URL.createObjectURL(imageBlob);
                this.setState({ imageUri });
            } else {
                throw new Error(`Failed to fetch image with status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching user display picture:', error);
            this.setState({ error: 'Error fetching picture: ' + error.message });
        }
    };

    render() {
        const { firstname, surname } = this.props;
        const { imageUri, error } = this.state;

        return (
            <View style={styles.container}>
                <Image
                    source={imageUri ? { uri: imageUri } : null}
                    style={[styles.image, !imageUri && { backgroundColor: 'lightgray' }]} // Show background color if no image
                    onError={() => this.setState({ error: 'Failed to load image', imageUri: null })}
                />
                <Text style={styles.text}>{firstname} {surname}</Text>
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        padding: 10,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    image: {
        width: 40,
        height: 40, 
        borderRadius: 20, 
        marginRight: 10,
    },
    text: {
        fontSize: 16,
        color: 'black',
    },
    errorText: {
        fontSize: 14,
        color: 'red',
        marginLeft: 10,
    },
});

export default ContactListItemSmall;
