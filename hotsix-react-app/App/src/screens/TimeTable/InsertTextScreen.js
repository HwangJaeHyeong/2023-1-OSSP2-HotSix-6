import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';


const InsertTextScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>시간표삽입</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Ranking')}>
            <Text style={styles.loginButtonText}>삽입 완료</Text>
        </TouchableOpacity>
    </View>
  );
};

export default InsertTextScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
    },
    title: {
      fontSize: 24,
      marginBottom: 24,
    },
    input: {
      width: '80%',
      borderColor: '#dddddd',
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginBottom: 16,
    },
    loginButton: {
      width: '80%',
      marginTop: 5,
      backgroundColor: '#1c7ed6',
      borderRadius: 4,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginButtonText: {
      color: '#ffffff',
      fontSize: 16,
    },
});