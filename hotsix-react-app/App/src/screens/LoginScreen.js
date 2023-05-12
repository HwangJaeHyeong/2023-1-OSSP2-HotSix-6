import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 로그인 처리 수행
    // 로그인 성공 시 MainScreen으로 이동
  };

  const handlePasswordReset = () => {
    //비밀번호 찾기 페이지로 이동 -->이메일을 보낼지 어떨지는 차후 논의
  };

  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
      <TextInput
        style={styles.input}
        placeholder="아이디"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePasswordReset}>
        <Text style={styles.resetPasswordText}>비밀번호 찾기</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Main')}>
        <Text>메인화면으로 이동</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
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