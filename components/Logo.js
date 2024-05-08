import {render} from 'react-dom';
import {View, Text, Image, StyleSheet} from 'react-native';


const Logo = () => {
  return (

    <View style={styles.Container}>

      <Image
        source={require('../../src/assets/images/logo.png')}
        style={styles.logo}
      />

      <Text style={styles.heading} >WhatsThat</Text>

    </View>


  );
};

const styles = StyleSheet.create({
  Container: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 30,
  },
  logo: {
    height: 200,
    width: 200,
  },
  heading: {
    fontSize: 48,
  },


},

);

export default Logo;


