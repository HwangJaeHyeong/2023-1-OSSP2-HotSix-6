import React, { useState } from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";

const SERVER_URL = "http://192.168.0.240:8000/"; // 백엔드 서버 주소로 변경해야함

const SignupScreen = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isPasswordAvailable, setIsPasswordAvailable] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [isNameAvailable, setIsNameAvailable] = useState(false);
  const [isDuplicateAvailable, setDuplicateAvailable] = useState(false);
  const [EmailChange, setEmailChange] = useState(false);

  // 패스워드 형식 확인. 11~20자 & 영문, 숫자, 특수문자 1자 이상씩 포함해야함.
  const handleCheckPassword = (password) => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[@$!%*#?&])[a-zA-Z\d@$!%*#?&]{11,20}$/;
    setPassword(password);
    setIsPasswordAvailable(passwordRegex.test(password));
  };

  // 이메일 형식 확인
  const handleEmailValid = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    setEmail(email);
    setIsEmailAvailable(emailRegex.test(email));
  };

  // 이름 형식 확인. 1~10자 & 모든 형식 가능.
  const handleNameValid = (name) => {
    const nameRegex =
      /^[\wㄱ-ㅎㅏ-ㅣ가-힣!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{1,10}$/;
    setName(name);
    setIsNameAvailable(nameRegex.test(name));
  };

  const handleCheckDuplicate = async () => {
    if (!handleEmailValid || !email) {
      Alert.alert("올바른 이메일 형식을 입력하세요!");
      return;
    }

    try {
      const response = await axios.post(`${SERVER_URL}/user/duplicate/`, {
        email: email,
      });
      if (response.status === 200) {
        setIsEmailAvailable(response);
        setDuplicateAvailable(response);
        setEmailChange(email);
        Alert.alert("사용 가능한 이메일입니다!");
      }
    } catch (error) {
      Alert.alert("중복된 이메일입니다. 다시 입력해주세요.");
    }
  };

  const handleSignup = async () => {
    // 회원가입 처리를 위한 백엔드 API 호출
    if (!isPasswordAvailable) {
      Alert.alert("올바른 비밀번호를 입력해주세요");
      return;
    }
    if (!isEmailAvailable) {
      Alert.alert("올바른 이메일을 입력해주세요");
      return;
    }
    if (!isDuplicateAvailable || EmailChange != email) {
      Alert.alert("이메일 중복확인을 해주세요");
      return;
    }
    if (!isNameAvailable) {
      Alert.alert("올바른 별명을 입력해주세요");
      return;
    }

    try {
      const currentDate = new Date().toISOString().substring(0,10);
      const response = await axios.post(`${SERVER_URL}/user/register/`, {
        email: email,
        password: password,
        name: name,
        join_date: "2023-05-23",
        is_active: 0,
      });
      if (response.status === 201) {
        Alert.alert("회원가입이 완료되었습니다.");
        navigation.navigate("Verification", { email: email }); // 회원가입 완료 -> 이메일 인증 페이지로 넘어감
      } else {
        console.log(response.status);
        Alert.alert("회원가입 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <ImageBackground source={require("hotsix-react-app/assets/backgroundimg2.png")} style={styles.container}>
       <View style={styles.contentContainer}>
      <Text style={styles.title}>회원가입</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>이메일</Text>
        <View style={styles.usernameContainer}>
          <TextInput
            style={[styles.input, { height: 40 }]}
            value={email}
            onChangeText={handleEmailValid}
            placeholder="이메일을 입력하세요"
          />
          <TouchableOpacity
            style={[styles.checkButton, { paddingHorizontal: 8, height: 40 }]}
            onPress={handleCheckDuplicate}
          >
            <Text style={styles.checkButtonText}>중복 확인</Text>
          </TouchableOpacity>
        </View>
        {!email && <Text style={{ color: "red" }}>이메일을 입력해주세요.</Text>}
        {email && !isEmailAvailable && (
          <Text style={{ color: "red" }}>사용 불가능한 이메일입니다.</Text>
        )}
        {email && isEmailAvailable && (
          <Text style={{ color: "green" }}>사용 가능한 이메일입니다.</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          비밀번호(영문,숫자,특수문자를 포함해주세요)
        </Text>
        <View style={styles.usernameContainer}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={handleCheckPassword}
            secureTextEntry={true}
            placeholder="비밀번호를 입력하세요(11~20자)"
          />
        </View>
        {!password && (
          <Text style={{ color: "red" }}>비밀번호를 입력해주세요.</Text>
        )}
        {password && !isPasswordAvailable && (
          <Text style={{ color: "red" }}>사용 불가능한 비밀번호입니다.</Text>
        )}
        {password && isPasswordAvailable && (
          <Text style={{ color: "green" }}>사용 가능한 비밀번호입니다.</Text>
        )}
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
        {!name && <Text style={{ color: "red" }}>닉네임을 입력해주세요.</Text>}
        {name && !isNameAvailable && (
          <Text style={{ color: "red" }}>사용 불가능한 닉네임입니다.</Text>
        )}
        {name && isNameAvailable && (
          <Text style={{ color: "green" }}>사용 가능한 닉네임입니다.</Text>
        )}
      </View>
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>회원가입</Text>
      </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width:'95%',
    paddingHorizontal:20,
    paddingVertical:20,
    borderRadius:15,
    backgroundColor: "#ffffff",
    elevation: 5,
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    width: "80%",
    borderColor: "#dddddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    backgroundColor: "#f2f2f2",
  },
  checkButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#3679A4",
    borderRadius: 4,
  },
  checkButtonText: {
    color: "#ffffff",
  },
  signupButton: {
    marginTop: 16,
    backgroundColor: "#3679A4",
    borderRadius: 4,
    paddingVertical: 12,
  },
  signupButtonText: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 18,
  },
});

export default SignupScreen;
