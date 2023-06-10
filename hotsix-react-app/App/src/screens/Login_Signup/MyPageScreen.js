import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SERVER_URL = 'http://192.168.0.12:3001'; // 백엔드 서버 주소로 변경해야함

const MyPageScreen = ({ navigation }) => {
  const handleLogout = async () => {
    // try {
    //   await AsyncStorage.removeItem('authToken');
    //   await axios.post(`${SERVER_URL}/user/logout`);
    //   Alert.alert('로그아웃 성공', '로그아웃되었습니다.');
    //   navigation.navigate('Login');
    // } catch (error) {
    //   console.log(error);
    //   Alert.alert('로그아웃 실패', '로그아웃하는 데 실패했습니다.');
    // }
    navigation.navigate('Home');
  };

  return (
    <ImageBackground
      source={require('hotsix-react-app/assets/backgroundimg3.png')}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name='account' style={styles.icon} />
        </View>
        <Text style={styles.title}>마이페이지</Text>

        <TouchableOpacity onPress={handleLogout} style={styles.Button}>
          <Text style={styles.buttonText}>로그 아웃</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    marginTop: 120,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    elevation: 5,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  Button: {
    width: '80%',
    backgroundColor: '#3679A4',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#dddddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 60,
  },
});

export default MyPageScreen;
