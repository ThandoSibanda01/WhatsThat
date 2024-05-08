import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ContactListItemSmall extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: null,
            firstname: "",
            surname: "",
            imageUri: null, 
        };
    }

    async componentDidMount() {
        const { userid } = this.state;
        const token = await AsyncStorage.getItem('whatsthat_session_token');
        const response = await fetch(`http://localhost:3333/api/1.0.0/user/9/photo`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': token,
            },
        });
        const imageBlob = await response.blob();
        const imageUri = URL.createObjectURL(imageBlob);
        this.setState({ imageUri });
    }

    render() {
        const { firstname, surname, navigationTool } = this.props;
        const { imageUri } = this.state;
        

        return (
            <TouchableOpacity 
                style={styles.container} 
                onPress={() => navigationTool(this.state.userid)}
            >
                
                <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                />
    
                <Text style={styles.text}>{firstname} {surname}</Text>
            </TouchableOpacity>
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
        justifyContent: 'flex-start',
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
});

export default ContactListItemSmall;