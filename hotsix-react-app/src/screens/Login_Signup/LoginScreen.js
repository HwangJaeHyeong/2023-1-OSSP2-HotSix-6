import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Alert } from "react-native";
import axios from "axios";
import { handleVerification } from "./VerificationScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_URL = "http://192.168.0.240:8000/";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginButtonPress = async () => {
    // 로그인 처리 로직...
  };

  return (
    <ImageBackground source={require("hotsix-react-app/assets/backgroundimg1.png")} style={styles.container}>
      <View style={styles.contentContainer}>
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
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLoginButtonPress}
        >
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.resetPasswordText}>비밀번호 찾기</Text>
        </TouchableOpacity>

   
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    marginTop: 120,
    paddingHorizontal:10,
    paddingVertical:20,
    borderRadius:15,
    backgroundColor: "#ffffff",
    elevation: 5,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
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
  loginButton: {
    width: "80%",
    backgroundColor: "#3679A4",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  resetPasswordText: {
    marginTop: 16,
    fontSize: 14,
    color: "#3679A4",
  },
});

export default LoginScreen;
