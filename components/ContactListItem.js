import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

class ContactListItemSmall extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: null,
            firstname: "",
            surname: "",
        };
    }

    render() {
        const { firstname, surname, navigationTool } = this.props;

        return (
            <TouchableOpacity style={styles.container} onPress={() => navigationTool(this.state.userid)}>
                <Text style={styles.text}>{firstname} {surname}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        
    },
    text: {
        fontSize: 16,
        color: 'black',
    },
});

export default ContactListItemSmall;
