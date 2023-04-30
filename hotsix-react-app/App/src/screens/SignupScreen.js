import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSignup = () => {
    // 회원가입 처리를 위한 백엔드 API 호출
    Alert.alert('회원가입이 완료되었습니다.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>아이디</Text>
        <View style={styles.usernameContainer}>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="아이디를 입력하세요"
          />
          <TouchableOpacity style={styles.checkButton}>
            <Text style={styles.checkButtonText}>중복확인</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>비밀번호</Text>
        <View style={styles.usernameContainer}>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholder="비밀번호를 입력하세요"
        />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>이메일</Text>
        <View style={styles.usernameContainer}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="이메일을 입력하세요"
        />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>별명</Text>
        <View style={styles.usernameContainer}>
        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
          placeholder="별명을 입력하세요"
        />
        </View>
      </View>

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  usernameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  checkButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2196f3',
    borderRadius: 4,
  },
  checkButtonText: {
    color: '#ffffff',
  },
  signupButton: {
    marginTop: 16,
    backgroundColor: '#2196f3',
    borderRadius: 4,
    paddingVertical: 12,
  },
  signupButtonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 18,
  },
});

export default SignupPage;