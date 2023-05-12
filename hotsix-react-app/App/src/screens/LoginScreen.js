import * as React from "react";
import { Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Border, FontFamily, FontSize, Color } from "../css/GlobalStyles";
import { useState, } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const SERVER_URL = 'http://localhost:3001'; 

const LoginScreen = ( {navigation} ) => {
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
    <View style={styles.view}>
      <View style={[styles.child, styles.itemLayout]} />
      <View style={[styles.item, styles.itemLayout]} />
      {/* <Pressable
        style={[styles.inner, styles.itemLayout]}
        onPress={() => navigation.navigate("Screen7")}
      /> */}
      <TextInput 
        style={styles.input2}
        placeholder="이메일을 입력해주세요."
        onChangeText={setEmail}
        value={email}
      />
      <TextInput 
        style={styles.input1}
        placeholder="비밀번호를 입력해주세요."
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Image
        style={styles.image1Icon}
        resizeMode="cover"
        source={require("hotsix-react-app/assets/WORKAHALLIC.png")}
      />
      <Image
        style={[styles.image2Icon, styles.image2IconPosition]}
        resizeMode="cover"
        source={require("hotsix-react-app/assets/시간표를 활용한 대학생 일정 관리 앱.png")}
      />
      <Pressable
        style={[styles.pressable, styles.pressablePosition]}
        // onPress={() => navigation.navigate("Screen")}
      >
        <Text style={styles.textTypo}>아이디 찾기</Text>
      </Pressable>
      <Pressable
        style={[styles.pressable1, styles.pressablePosition]}
        // onPress={() => navigation.navigate("")}
      >
        <Text style={styles.textTypo}>비밀번호 찾기</Text>
      </Pressable>
      <TouchableOpacity style={styles.pressable2} onPress={handleLoginButtonPress}>
        <Text style={[styles.text4, styles.textTypo1]}>로그인 하기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pressable4} onPress={() => navigation.navigate('Main')}>
        <Text style={[styles.text4, styles.textTypo1]}>메인</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pressable3} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.textTypo}>회원가입 하러 가기</Text>
      </TouchableOpacity>
      <Image
        style={styles.icon}
        resizeMode="cover"
        source={require("hotsix-react-app/assets/MainLogo.png")}
      />
      <View style={[styles.rectangleView, styles.image2IconPosition]} />
      <Image
        style={[styles.iconArrowBackOutlineIcon, styles.iconLayout]}
        resizeMode="cover"
        source={require("hotsix-react-app/assets/arrow.png")}
      />
      <Image
        style={[styles.iconHomeIcon, styles.iconLayout]}
        resizeMode="cover"
        source={require("hotsix-react-app/assets/home.png")}
      />
      <Text style={[styles.home, styles.homeTypo]}>HOME</Text>
      <Text style={[styles.back, styles.homeTypo]}>BACK</Text>
      <Text style={[styles.text6, styles.textTypo]}>|</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  input1: {
    width: '67.5%',
    borderColor: '#dddddd',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom : 240,
    marginLeft: 60,
    position: "absolute",
    bottom: 0
  },
  input2: {
    width: '67.5%',
    borderColor: '#dddddd',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 315,
    marginLeft: 60,
    position: "absolute",
    top: 0
  },
  itemLayout: {
    height: 46,
    width: 243,
    borderRadius: Border.br_8xs,
    left: 60,
    // top: 300,
    position: "absolute",
  },
  image2IconPosition: {
    left: 0,
    position: "absolute",
  },
  pressablePosition: {
    top: 560,
    position: "absolute",
  },
  iconLayout: {
    maxHeight: "100%",
    maxWidth: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  homeTypo: {
    textAlign: "center",
    fontFamily: FontFamily.interSemibold,
    fontWeight: "600",
    top: 773,
    color: Color.black,
    fontSize: FontSize.size_xs,
    position: "absolute",
  },
  textTypo: {
    color: Color.black,
    textAlign: "left",
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_xs,
  },
  child: {
    top: 314,
    backgroundColor: Color.white,
  },
  item: {
    top: 381,
    backgroundColor: Color.white,
  },
  inner: {
    top: 488,
    backgroundColor: Color.black,
  },
  text: {
    top: 371,
    width: 130,
    color: Color.gray,
    left: 78,
    textAlign: "left",
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_xs,
    position: "absolute",
  },
  text1: {
    top: 437,
    width: 143,
    color: Color.gray,
    left: 78,
    textAlign: "left",
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_xs,
    position: "absolute",
  },
  image1Icon: {
    top: 203,
    left: 13,
    width: 334,
    height: 65,
    position: "absolute",
  },
  image2Icon: {
    top: 256,
    width: 332,
    height: 24,
  },
  pressable: {
    left: 98,
  },
  pressable1: {
    left: 198,
  },
  text4: {
    color: Color.white,
    width: 64,
    textAlign: "left",
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_xs,
  },
  pressable2: {
    left: 150,
    top: 447,
    position: "absolute",
  },
  pressable3: {
    left: 134,
    top: 507,
    position: "absolute",
  },
  pressable4: {
    left: 167,
    top: 477,
    position: "absolute",
  },
  icon: {
    top: 47,
    left: 101,
    width: 158,
    height: 147,
    position: "absolute",
  },
  rectangleView: {
    top: 594,
    width: 360,
    height: 91,
    backgroundColor: Color.white,
  },
  iconArrowBackOutlineIcon: {
    height: "7.13%",
    width: "15.68%",
    top: "90.38%",
    right: "22.37%",
    bottom: "2.5%",
    left: "61.94%",
  },
  iconHomeIcon: {
    height: "4.83%",
    width: "14.17%",
    top: "91.25%",
    right: "62.78%",
    bottom: "3.92%",
    left: "23.06%",
  },
  home: {
    left: 90,
  },
  back: {
    left: 236,
  },
  text6: {
    left: 175,
    top: 558,
    position: "absolute",
  },
  view: {
    backgroundColor: Color.steelblue,
    flex: 1,
    width: "100%",
    height: 800,
    overflow: "hidden",
  },
});

export default LoginScreen;
