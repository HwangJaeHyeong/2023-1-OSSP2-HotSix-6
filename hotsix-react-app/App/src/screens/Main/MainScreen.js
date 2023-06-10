import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MainScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('hotsix-react-app/assets/backgroundimg1.png')}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>메인화면</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() =>
            navigation.navigate('Group', { groupName: null, groupCode: null })
          }
        >
          <View style={styles.buttonContent}>
            <View>
              <Text style={styles.loginButtonText}>&gt; 내 그룹 보기</Text>
              <Text style={styles.smallText}>
                그룹 생성, 그룹 시간표, 프로젝트 관리
              </Text>
            </View>
            <MaterialCommunityIcons
              name='account-group'
              size={83}
              color='#ffffff'
              style={styles.icon}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Register')}
        >
          <View style={styles.buttonContent}>
            <View>
              <Text style={styles.loginButtonText}>&gt; 내 시간표 보기</Text>
              <Text style={styles.smallText}>내 시간표 등록</Text>
            </View>
            <MaterialCommunityIcons
              name='timetable'
              size={83}
              color='#ffffff'
              style={styles.icon}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('MyPage')}
        >
          <View style={styles.buttonContent}>
            <View>
              <Text style={styles.loginButtonText}>&gt; 마이페이지</Text>
              <Text style={styles.smallText}>내 정보 수정, 로그아웃</Text>
            </View>
            <MaterialCommunityIcons
              name='account'
              size={83}
              color='#ffffff'
              style={styles.icon}
            />
          </View>
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
    width: '100%',
    marginTop: 250,
    borderRadius: 30,
    paddingTop: 40,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 25,
    marginBottom: 24,
  },
  loginButton: {
    width: '80%',
    backgroundColor: '#3679A4',
    marginBottom: 16,
    borderRadius: 10,
    height: 70,
    overflow: 'hidden',
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  smallText: {
    marginTop: 3,
    color: '#ffffff',
    fontSize: 12,
  },
  icon: {
    alignSelf: 'flex-end',
  },
});

export default MainScreen;
