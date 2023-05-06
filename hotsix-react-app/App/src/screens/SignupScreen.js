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

const SignupPage = ( {navigation} ) => {
  const [username, setUsername] = useState('');
  const [duplicateusername, setDuplicateusername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [isUsernameDuplicate, setIsUsernameDuplicate] = useState(false);
  const [isPasswordAvailable, setIsPasswordAvailable] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false); 
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);

  // 아이디 형식 확인. 4~10자 & 모든 형식 입력 가능
  const handleCheckUsername = (username) => {
    const UsernameRegex = /^[\wㄱ-ㅎㅏ-ㅣ가-힣!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{4,10}$/;
    setUsername(username);
    setIsUsernameAvailable(UsernameRegex.test(username));
  }

  // 아이디 중복 확인
  const duplicateCheckUsername = async () => {
    // 형식 안맞으면 바로 return
    if(!isUsernameAvailable) {Alert.alert("형식에 맞는 아이디를 입력하세요!"); return;}
    try {
      // 서버 측 api 호출
      const response = await axios.get(`http://192.168.0.63:3000/users`);
      const data = await response.data;
      const exists = data.some(user => user.username === username);

      if(!exists) {
        Alert.alert("사용 가능한 아이디입니다!");
        // 중복 확인된 username 저장. -> 회원가입할때 사용하는 username이랑 맞는지 확인
        setDuplicateusername(username);
      } else {
        Alert.alert("중복된 아이디입니다. 다시 입력해주세요!");
      } 
      setIsUsernameAvailable(!exists);
      setIsUsernameDuplicate(!exists);
    } catch (error) {
      console.error(error);
    }
  }

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

  // 별명 형식 확인. 1~15자 & 모든 형식 가능.
  const handleNickname = (nickname) => {
    const nicknameRegex = /^[\wㄱ-ㅎㅏ-ㅣ가-힣!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{1,15}$/;
    setNickname(nickname);
    setIsNicknameAvailable(nicknameRegex.test(nickname));
  }

  const handleSignup = async () => {
    // 회원가입 처리를 위한 백엔드 API 호출
    if (!isUsernameAvailable) {Alert.alert('올바른 아이디를 입력해주세요'); return;};
    if (!isUsernameDuplicate || duplicateusername != username) {Alert.alert('아이디 중복확인을 해주세요'); return;};
    if (!isPasswordAvailable) {Alert.alert('올바른 비밀번호를 입력해주세요');return;};
    if (!isEmailAvailable) {Alert.alert('올바른 이메일을 입력해주세요');return;};
    if (!isNicknameAvailable) {Alert.alert('올바른 별명을 입력해주세요');return;};
    try {
      const response = await fetch('http://192.168.0.63:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          email,
          nickname,
        }),
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
        <Text style={styles.label}>아이디</Text>
        <View style={styles.usernameContainer}>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={handleCheckUsername}
            placeholder="아이디를 입력하세요(4~10자)"
          />
          <TouchableOpacity style={styles.checkButton} onPress={duplicateCheckUsername}>
            <Text style={styles.checkButtonText}>중복확인</Text>
          </TouchableOpacity>
          </View>
            {!username && (<Text style={{color:'red'}}>아이디를 입력해주세요.</Text>)}
            {username && !isUsernameAvailable && (<Text style={{color:'red'}}>사용 불가능한 아이디입니다.</Text>)}
            {username && isUsernameAvailable && (<Text style={{color:'green'}}>사용 가능한 아이디입니다.</Text>)}
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
        <Text style={styles.label}>이메일</Text>
        <View style={styles.usernameContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={handleEmailValid}
            placeholder="이메일을 입력하세요"
          />
          </View>
            {!email && (<Text style={{color:'red'}}>이메일을 입력해주세요.</Text>)}
            {email && !isEmailAvailable && (<Text style={{color:'red'}}>사용 불가능한 이메일입니다.</Text>)}
            {email && isEmailAvailable && (<Text style={{color:'green'}}>사용 가능한 이메일입니다.</Text>)}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>별명(영문,숫자,한글만 입력해주세요)</Text>
        <View style={styles.usernameContainer}>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={handleNickname}
            placeholder="별명을 입력하세요(1~15자)"
          />
          </View>
            {!nickname && (<Text style={{color:'red'}}>닉네임을 입력해주세요.</Text>)}
            {nickname && !isNicknameAvailable && (<Text style={{color:'red'}}>사용 불가능한 닉네임입니다.</Text>)}
            {nickname && isNicknameAvailable && (<Text style={{color:'green'}}>사용 가능한 닉네임입니다.</Text>)}
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

