import React, { useState, } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

// json-server --watch db.json --port 3000 --cors --host 본인 아이피

const SERVER_URL = 'http://localhost:3001'; // 백엔드 서버 주소로 변경해야함

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 로그인 바꾸기
  const handleLoginChange = (email) => {
    setUsername(removeWhitespace(email));
  }
  
  // 비밀번호 바꾸기
  const handlePasswordChange = (password) => {
    setPassword(removeWhitespace(password));    
  };

  // 로그인 수행 버튼
  const handleLoginButtonPress = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/users`, {
      email: email,
      password: password,
    });

    if (response.status === 200) {
      Alert.alert('로그인 성공!');
      navigation.navigate('Main');
    } else {
      Alert.alert('로그인 실패. 아이디와 패스워드를 확인해주세요.');
    }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
        <TextInput
          style={styles.input}
          placeholder="이메일"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLoginButtonPress}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePasswordChange}>
          <Text style={styles.resetPasswordText}>비밀번호 찾기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Text>메인화면으로 이동</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Agreement')}>
          <Text>회원가입 이동</Text>
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

export default LoginScreen;