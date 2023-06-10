import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useState } from 'react';
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SAMPLE_GROUP_CODE_DATA_LIST } from '../../constant/groupCode';

const SERVER_URL = 'http://192.168.0.240:8000'; //백엔드 서버 주소로 변경해야함

const JoinGroupScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userId } = route.params;
  const [Group_Code, setGroup_Code] = useState('');
  const [isGroup_CodeAvailable, setIsGroup_CodeAvailable] = useState(true);

  const hanldegroupcode = (Group_Code) => {
    const groupcodeRegex = /^\d{1,15}$/;
    setGroup_Code(Group_Code);
    setIsGroup_CodeAvailable(groupcodeRegex.test(Group_Code));
  };

  const handleJoinGroup = async () => {
    //if(!isGroup_CodeAvailable) {Alert.alert("형식에 맞지 않는 코드 입니다."); return;};

    try {
      // const response = await axios.post(`${SERVER_URL}/group/join-group/`, {
      //   email: 'osh94230315@gmail.com',
      //   group_code: Group_Code,
      // });
      //const groupcode = response.data;
      // if(!groupcode) {
      //   Alert.alert("존재하지 않는 코드입니다. 다시 입력해주세요."); return;
      //}
      // db에 해당 코드가 존재하는 경우 사용자를 해당 그룹에 가입
      // const Response = await JoinGroup(userId, Group_Code);
      // if (response.status == 202) {
      //   Alert.alert('그룹 입장에 성공했습니다!');
      //   navigation.navigate('Group', { email: email });
      // }

      let groupItem;

      SAMPLE_GROUP_CODE_DATA_LIST.forEach((groupDataItem) => {
        if (groupDataItem.code === Group_Code) {
          groupItem = groupDataItem;
        }
      });

      if (groupItem) {
        Alert.alert('그룹 입장에 성공했습니다!');
        navigation.navigate('Group', {
          groupName: groupItem.name,
          groupCode: groupItem.code,
        });
        return;
      }
      Alert.alert('그룹 입장에 실패했습니다!');
      return;
    } catch (error) {
      Alert.alert('오류', '코드 전송에 실패했습니다.');
    }
  };

  // 그룹 가입하기
  const JoinGroup = async (userId, Group_Code) => {
    try {
      const response = await axios.post(`${SERVER_URL}/groupMembers`, {
        Member_Id: userId,
        Group_Code: Group_Code,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '그룹 입장에 실패했습니다.');
    }
  };

  return (
    <ImageBackground
      source={require('hotsix-react-app/assets/backgroundimg3.png')}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>그룹 코드로 그룹 입장하기</Text>
        <Text style={styles.label}>
          공유 받은 그룹 코드로 그룹에 입장하세요
        </Text>

        <View style={styles.inputContainer}>
          <View style={styles.usernameContainer}>
            <TextInput
              style={styles.input}
              value={Group_Code}
              onChangeText={hanldegroupcode}
              placeholder='그룹 코드를 입력하세요'
            />
          </View>
          {!Group_Code && (
            <Text style={{ color: 'red' }}>그룹코드를 입력해주세요.</Text>
          )}
        </View>

        <TouchableOpacity style={styles.signupButton} onPress={handleJoinGroup}>
          <Text style={styles.signupButtonText}>그룹 입장하기</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '90%',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 15,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 50,
    color: 'gray',
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
    backgroundColor: '#F56D6D',
    borderRadius: 4,
  },
  checkButtonText: {
    color: '#ffffff',
  },
  signupButton: {
    marginTop: 16,
    backgroundColor: '#F56D6D',
    borderRadius: 4,
    paddingVertical: 12,
  },
  signupButtonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 18,
  },
});

export default JoinGroupScreen;
