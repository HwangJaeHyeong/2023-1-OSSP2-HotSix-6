import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

const schedules = [
  [0,0,0,1,0,1,0], // 8시
  [0,0,0,1,0,1,0], // 8시 30분
  [0,0,0,1,0,1,0], // 9시
  [0,0,0,1,0,1,0], // 9시 30분
  [0,1,0,1,0,1,0], // 10시
  [0,1,0,0,0,1,0], // 10시 30분
  [1,1,0,0,0,1,0], // 11시
  [1,1,0,0,0,1,0], // 11시 30분
  [1,1,0,0,0,0,0], // 12시
  [1,1,0,0,0,0,0], // 12시 30분
  [0,1,0,0,0,0,0], // 13시
  [0,0,0,0,0,0,0], // 13시 30분
  [0,0,0,1,0,0,0], // 14시
  [0,0,0,1,0,0,0], // 14시 30분
  [0,0,0,1,0,0,0], // 15시
  [0,0,0,1,0,0,0], // 15시 30분
  [0,0,0,1,0,0,0], // 16시
  [0,0,0,1,0,0,0], // 16시 30분
  [1,0,0,1,0,0,0], // 17시
  [1,0,0,0,0,0,0], // 17시 30분
  [1,0,0,0,0,0,0], // 18시
  [0,0,0,0,0,0,1], // 18시 30분
  [0,0,0,0,0,0,1], // 19시
  [0,0,0,0,0,0,1], // 19시 30분
  [0,0,0,0,0,0,1], // 20시
  [0,0,0,0,0,0,0], // 20시 30분
  [0,0,0,0,0,0,0], // 21시
  [0,0,0,0,0,0,0], // 21시 30분
  [0,0,0,0,1,0,0], // 22시
  [0,0,0,0,1,0,0], // 22시 30분
  [0,0,0,0,1,0,0], // 23시
  [0,0,0,0,1,0,0], // 23시 30분
  [0,0,0,0,1,0,0], // 24시
];

const TimetableScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Register')}>
      <Text style={styles.loginButtonText}>시간표 등록하기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Change', {schedules : schedules})}>
        <Text style={styles.loginButtonText}>시간표 수정하기</Text>
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


export default TimetableScreen;