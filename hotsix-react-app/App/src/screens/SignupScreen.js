import React, { useState, } from 'react';
import axios from 'axios';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

const SERVER_URL = 'http://localhost:3001'; // 백엔드 서버 주소로 변경해야함

const SignupScreen = ( {navigation} ) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); 
  const [isPasswordAvailable, setIsPasswordAvailable] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false); 
  const [isNameAvailable, setIsNameAvailable] = useState(false);

  // 패스워드 형식 확인. 11~20자 & 영문, 숫자, 특수문자 1자 이상씩 포함해야함.
  const handleCheckPassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[@$!%*#?&])[a-zA-Z\d@$!%*#?&]{11,20}$/;
    setPassword(password); 
    setIsPasswordAvailable(passwordRegex.test(password));
  }

  // 이메일 형식 확인
  const handleEmailValid = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    setEmail(email);
    setIsEmailAvailable(emailRegex.test(email));
  }

  // 이름 형식 확인. 1~10자 & 모든 형식 가능.
  const handleNameValid = (name) => {
    const nameRegex = /^[\wㄱ-ㅎㅏ-ㅣ가-힣!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{1,10}$/;
    setName(name);
    setIsNameAvailable(nameRegex.test(name));
  }

  // 이메일 인증 요청
  const handleVerification = () => {
    navigation.navigate('Verification', {email:email}); // 위치 수정해야함
    axios
      .post(`${SERVER_URL}/send-email/`, { email })
      .then((response) => {
        Alert.alert('인증 메일 발송', '이메일로 인증 메일이 발송되었습니다.');
        //navigation.navigate('Verification', {'email': 'hayeon_song@naver.com'}); 
      })
      .catch((error) => {
        Alert.alert('오류', '이메일 전송에 실패하였습니다.');
      });
  };

  const handleSignup = async () => {
    // 회원가입 처리를 위한 백엔드 API 호출
    if (!isPasswordAvailable) {Alert.alert('올바른 비밀번호를 입력해주세요'); return;};
    if (!isEmailAvailable) {Alert.alert('올바른 이메일을 입력해주세요'); return;};
    if (!isNameAvailable) {Alert.alert('올바른 별명을 입력해주세요'); return;};
    
    try {
      const currentDate = new Date();
      const response = await axios.post(`${SERVER_URL}/users`, {
        name: name,
        password: password,
        email: email,
        join_date: currentDate,
      });
      if (response.ok) {
        Alert.alert('회원가입이 완료되었습니다.');
        navigation.navigate('Login');
      } else {
        console.log(response.status);
        Alert.alert('회원가입 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>이메일</Text>
        <View style={styles.usernameContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={handleEmailValid}
            placeholder="이메일을 입력하세요"
          />
          <TouchableOpacity style={styles.checkButton} onPress={(handleVerification)}>
            <Text style={styles.checkButtonText}>인증 메일 전송</Text>
          </TouchableOpacity>
          </View>
            {!email && (<Text style={{color:'red'}}>이메일을 입력해주세요.</Text>)}
            {email && !isEmailAvailable && (<Text style={{color:'red'}}>사용 불가능한 이메일입니다.</Text>)}
            {email && isEmailAvailable && (<Text style={{color:'green'}}>사용 가능한 이메일입니다.</Text>)}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>비밀번호(영문,숫자,특수문자를 포함해주세요)</Text>
        <View style={styles.usernameContainer}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={handleCheckPassword}
            secureTextEntry={true}
            placeholder="비밀번호를 입력하세요(11~20자)"
          />
          </View>
            {!password && (<Text style={{color:'red'}}>비밀번호를 입력해주세요.</Text>)}
            {password && !isPasswordAvailable && (<Text style={{color:'red'}}>사용 불가능한 비밀번호입니다.</Text>)}
            {password && isPasswordAvailable && (<Text style={{color:'green'}}>사용 가능한 비밀번호입니다.</Text>)}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>이름(영문,숫자,한글만 입력해주세요)</Text>
        <View style={styles.usernameContainer}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={handleNameValid}
            placeholder="이름을 입력하세요(1~10자)"
          />
          </View>
            {!name && (<Text style={{color:'red'}}>닉네임을 입력해주세요.</Text>)}
            {name && !isNameAvailable && (<Text style={{color:'red'}}>사용 불가능한 닉네임입니다.</Text>)}
            {name && isNameAvailable && (<Text style={{color:'green'}}>사용 가능한 닉네임입니다.</Text>)}
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

export default SignupScreen;

