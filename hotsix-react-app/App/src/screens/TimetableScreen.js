import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

const TimetableScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Main')}>
        <Text>메인화면으로 이동</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Insert')}>
        <Text>시간표 삽입</Text>
      </TouchableOpacity>
    </View>
  );

  
};

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
  resetPasswordText: {
    marginTop: 16,
    fontSize: 14,
    color: '#1c7ed6',
  },
});


export default TimetableScreen;