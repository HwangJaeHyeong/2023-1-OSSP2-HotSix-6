import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

const RankingScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>마음에 드는 시간대 선택하기</Text>
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Main')}>
        <Text style={styles.loginButtonText}>선택 완료</Text>
      </TouchableOpacity>
    </View>
  );

  
};

export default RankingScreen;

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