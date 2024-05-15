import React, { Component } from 'react';
import {
    View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PageHeader from '../components/PageHeader';
import ContactListItemSmall from '../components/ContactListItemSmall';

class ChatDetailsScreen extends Component {
    state = {
        chatDetails: null,
        isLoading: true,
        error: null,
        chatId: ''
    };

    componentDidMount() {
        const { chatId } = this.props.route.params;
        console.log('Chat Details Chat ID:', chatId);
        this.setState({ chatId });
        this.fetchChatDetails(chatId);
    }

    fetchChatDetails = async (chatId) => {
        const token = await AsyncStorage.getItem('whatsthat_session_token');
        try {
            const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': token,
                },
            });

            if (response.ok) {
                const data = await response.json();
                this.setState({
                    chatDetails: data,
                    isLoading: false
                });
            } else {
                throw new Error('Failed to fetch chat details');
            }
        } catch (error) {
            this.setState({ error: error.message, isLoading: false });
        }
    };

    handleMemberPress = async (userNumber) => {
        const myID = await AsyncStorage.getItem('whatsthat_user_id');
        if (userNumber == myID) {
            this.props.navigation.navigate('Profile');
        } else {
            this.props.navigation.navigate('MemberDetails', { chatID: this.state.chatId, userID: userNumber });
        }
    };

    renderMember = ({ item }) => (

        <TouchableOpacity onPress={() => this.handleMemberPress(item.user_id)}>

            <ContactListItemSmall
                userid={item.user_id}
                firstname={item.first_name}
                lastname={item.last_name}
            />
            
        </TouchableOpacity>
    );

    render() {
        const { chatDetails, isLoading, error } = this.state;

        if (isLoading) return <View style={styles.container}><Text>Loading...</Text></View>;
        if (error) return <View style={styles.container}><Text>Error: {error}</Text></View>;
        if (!chatDetails) return <View style={styles.container}><Text>No data available.</Text></View>;

        return (
            <ScrollView style={styles.container}>
                
                <PageHeader
                    title={chatDetails.name}
                    icon="pencil"
                    onPress={() => this.props.navigation.navigate('EditChatDetails', { chatID: this.state.chatId })}
                />
                
                <FlatList
                    data={chatDetails.members}
                    renderItem={this.renderMember}
                    keyExtractor={item => item.user_id.toString()}
                    ListHeaderComponent={() => (
                        <Text style={styles.subHeader}>Members</Text>
                    )}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    subHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
});

export default ChatDetailsScreen;
