import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import axios from 'axios';


function EmailVerificationScreen({ }) {
  const route = useRoute();
  const { email } = route.params; //SignupScreen에서 받아온 값
  const [title, setTitle] = useState('이메일 인증');
  const [isVerified, setIsVerified] = useState(false);
  const navigation = useNavigation();
  const SERVER_URL = 'http://localhost:3001'; //백엔드 서버 주소로 변경해야함

  const handleVerification = () => { //이메일 재전송
    axios
      .post(`${SERVER_URL}/send-email/`, {email})
      .then((response) => {
        Alert.alert('인증 메일 발송', '이메일로 인증 메일이 발송되었습니다.');
      })
      .catch((error) => {Yy
        Alert.alert('오류', '이메일 전송에 실패하였습니다.');
      });
  };

  const verifyEmail = async () => { // 백에서 인증 요청 받아옴
    try{
      const response = await axios.get(`${SERVER_URL}/verify-email`);
      setIsVerified(response.data.is_verified); //is_verified(반환된 값) 가져와 setIsVerified 상태 업데이트
    } catch (error) {
      console.error(error);
    };
  };

  
  useEffect(() => { // isVerified == true이면 "이메일 인증 성공" 출력 & 1초 후 Signup으로 창 전환
    if (isVerified == true) {
      setTitle('이메일 인증 성공')
      setTimeout(() => {
        navigation.navigate('Signup');
      }, 1000);
    }
  }, [isVerified]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {!isVerified ? ( //인증 요청 상태
          <View style={styles.imageContainer}>
          <Image style={styles.image} source={require("hotsix-react-app/assets/x.png")}/>
          </View>  
      ) 

      : ( //인증 완료 상태
      <View style={styles.imageContainer}>
      <Image style={styles.image} source={require("hotsix-react-app/assets/o.png")}/>
      </View>
      )}
      <View>
        <Text style={styles.label}>{email}로 인증 메일이 전송되었습니다. 받으신 이메일을 열어 링크를 클릭하면 인증이 완료됩니다.</Text>
        <TouchableOpacity style={styles.button} >
            <Text style={styles.buttonText} onPress={verifyEmail}>인증 완료</Text>
        </TouchableOpacity>
        <Text style={styles.label}>이메일을 받지 못하셨나요?</Text>
        <View style={styles.view}>
        <TouchableOpacity >
            <Text style={styles.text} onPress = {() => navigation.navigate('Signup')} >이메일 수정</Text> 
        </TouchableOpacity>
        <TouchableOpacity > 
          <Text style={styles.text} onPress={handleVerification} >이메일 재전송</Text> 
        </TouchableOpacity>
        </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  view:{
    flexDirection : 'column'
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  label: {
    fontSize: 15,
    marginTop: 15,
    marginBottom: 15,
    textAlign: 'center'
},
  text: {
    color:'#007AFF',
    textAlign: 'center'
},
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center'
  },
 
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain'
  },
});

export default EmailVerificationScreen;