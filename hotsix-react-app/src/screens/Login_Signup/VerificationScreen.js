import { A_SERVER_URL } from '@constants/baseUrl'
import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

function EmailVerificationScreen({}) {
  const route = useRoute()
  const { email } = route.params //SignupScreen에서 받아온 값
  const [title, setTitle] = useState('이메일 인증')
  const [isVerified, setIsVerified] = useState(false)
  const navigation = useNavigation()

  // 이메일 인증 완료 버튼 눌렀을 때 인증 상태 백에서 받아옴
  //api요청: is_active 체크
  const verifyEmail = async () => {
    const response = await axios.post(`${A_SERVER_URL}/user/check-active/`, {
      email: email,
    })
    console.log(response.data)
    try {
      if (response.status == 200) {
        setIsVerified(true) //setIsVerified 상태 업데이트
      } else if (response.status == 400) {
        Alert.alert('이메일 인증에 실패했습니다.')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleVerification = async () => {
    try {
      const response = await axios.post(`${A_SERVER_URL}/user/send-email/`, {
        email: email,
      })

      if (response.status === 202) {
        Alert.alert('인증 메일 발송', '이메일로 인증 메일이 발송되었습니다.')
      }
    } catch (error) {
      console.error(error)
      Alert.alert('오류', '이메일 전송에 실패하였습니다.')
    }
  }

  useEffect(() => {
    // isVerified == true이면 "이메일 인증 성공" 출력 & 1초 후 login으로 창 전환
    if (isVerified == true) {
      setTitle('이메일 인증 성공')
      setTimeout(() => {
        navigation.navigate('Login')
      }, 1000)
    }
  }, [isVerified])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {!isVerified ? ( //인증 요청 상태
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={require('assets/images/x.png')} />
        </View>
      ) : (
        //인증 완료 상태
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={require('assets/images/o.png')} />
        </View>
      )}
      <View>
        <Text style={styles.label}>
          {email}로 인증 메일이 전송되었습니다. 받으신 이메일을 열어 링크를 클릭하면 인증이 완료됩니다.
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={verifyEmail}>
            인증 완료
          </Text>
        </TouchableOpacity>
        <Text style={styles.label}>이메일을 받지 못하셨나요?</Text>
        <View style={styles.view}>
          <TouchableOpacity>
            <Text style={styles.text} onPress={handleVerification}>
              이메일 재전송
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  view: {
    flexDirection: 'column',
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
    textAlign: 'center',
  },
  text: {
    color: '#3679A4',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3679A4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },

  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
})

export default EmailVerificationScreen
