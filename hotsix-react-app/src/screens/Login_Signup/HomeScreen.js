import { useNavigation } from '@react-navigation/native'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const HomeScreen = () => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <View tyle={styles.logoContainer}>
          <Image source={require('assets/images/main_logo_img.png')} style={styles.logoImage} />
        </View>
      </TouchableOpacity>
      <View style={styles.Textcontainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.Text}>로그인</Text>
        </TouchableOpacity>
        <Text style={styles.Text2}>or</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Agreement')}>
          <Text style={styles.Text}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3679A4', // 청록색 테마 컬러
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 400,
    height: 300,
  },
  Text: {
    color: '#3679A4',
    textAlign: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: '#fff',
    backgroundColor: '#fff',
    marginTop: 10,
    fontSize: 18,
  },
  Text2: {
    marginTop: 10,
    color: '#fff',
    textAlign: 'center',
  },
  Textcontainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 40,
    width: '75%',
  },
})

export default HomeScreen
