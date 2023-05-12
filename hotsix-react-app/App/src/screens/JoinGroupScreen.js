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

const SERVER_URL = 'http://localhost:3001'; //백엔드 서버 주소로 변경해야함

const JoinGroupPage = ( {navigation} ) => {
 
  const [Group_Code, setGroup_Code] = useState('');
  const [isGroup_CodeAvailable, setIsGroup_CodeAvailable] = useState(false);  

  const hanldegroupcode = (Group_Code) => {
    const groupcodeRegex = /^\d{1,15}$/;
    setGroup_Code(Group_Code); 
    setIsGroup_CodeAvailable(groupcodeRegex.test(Group_Code));
  }

  // 그룹 코드로 그룹 입장하기
  const handleJoinGroup = async () => {    
    if(!isGroup_CodeAvailable) {Alert.alert("형식에 맞지 않는 코드 입니다."); return;};
    
    try {
      // 그룹 입장을 위한 백엔드 API 호출
      const response = await axios.post(`${SERVER_URL}/group`, {
        Group_Code: Group_Code,
      });
      // 해당 그룹 코드가 존재하는지에 대한 값을 받는 변수
      const Group_Code_check = await axios.get(`${SERVER_URL}/group`);
      if (response.ok && Group_Code_check) {
        // 서버에 이름 전송하여 그룹에 참여  
        Alert.alert("그룹 입장에 성공했습니다!");
        // navigation.navigate('GroupScreen'); 나중에 
      } else if (!Group_Code_check) {
        Alert.alert('존재하지 않는 그룹 코드입니다. 다시 입력해 주세요.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('그룹 입장 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>그룹 코드로 그룹 입장하기</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>그룹 코드</Text>
        <View style={styles.usernameContainer}>
          <TextInput
            style={styles.input}
            value={Group_Code}
            onChangeText={hanldegroupcode}
            placeholder="그룹 코드를 입력하세요"
            secureTextEntry={true}
          />
          </View>
            {!Group_Code && (<Text style={{color:'red'}}>그룹코드를 입력해주세요.</Text>)}
      </View>

      <TouchableOpacity style={styles.signupButton} onPress={handleJoinGroup}>
        <Text style={styles.signupButtonText}>그룹 입장하기</Text>
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

export default JoinGroupPage;

