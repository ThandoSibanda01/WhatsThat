// ContactListItem.js

import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

class ContactListItem extends Component {
  state = {
    profileImageUrl: null
  };

  componentDidMount() {
    this.getProfilePicture();
  }

  getProfilePicture = () => {
    const { userID, sessionToken } = this.props;
    fetch(`http://localhost:3333/api/1.0.0/user/${userID}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken
      },
    })
    .then((res) => res.blob())
    .then((resBlob) => {
      const img = URL.createObjectURL(resBlob);
      this.setState({ profileImageUrl: img });
    })
    .catch(() => {
      this.setState({ profileImageUrl: '../../src/assets/images/defaultDP.jpeg' });
    });
  }
  

  render() {
    const { firstname, surname } = this.props;
    const { profileImageUrl } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={profileImageUrl ? { uri: profileImageUrl } : require('../../src/assets/images/defaultDP.jpeg')}
            style={styles.image}
          />
        </View>

        <View style={styles.nameContainer}>
          <Text style={styles.text}>{firstname} {surname}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nameContainer: {
    margin:50,

  },
  text: {
    fontSize: 20,
    textcolor: "black",
  },
});

export default ContactListItem;