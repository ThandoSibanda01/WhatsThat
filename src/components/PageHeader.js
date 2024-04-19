import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';



const PageHeader = ({title, icon, onPress}) => {
  return (
    <View style={styles.container}>
      
      <Text style={styles.heading}>{title}</Text>

      <View style={styles.rightContainer}>
        <Icon name ={icon} size={20} color='white' />

      </View>

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    padding: 10,
    backgroundColor: 'purple',
   
    
  },

  heading: {
    fontSize: 22,
    color: 'white',
    
    

  },
  rightContainer: {
    margin: 5,
  },

});


export default PageHeader;
