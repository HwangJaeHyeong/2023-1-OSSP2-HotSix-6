import React, { useState, } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

const SERVER_URL = 'http://localhost:3001'; //백엔드 서버 주소로 변경해야함

const CreateNewgroupScreen = ({route}) => {
  
  const navigation = useNavigation();
  const [Group_Name, setGroup_Name] = useState('');
  const [isGroup_NameAvailable, setIsGroup_NameAvailable] = useState(false);  

  // 그룹 이름 판별(아무거나 2~10자)
  const handlegroupname = (Group_Name) => {
    const groupnameRegex = /^.{2,10}$/;
    setGroup_Name(Group_Name); 
    setIsGroup_NameAvailable(groupnameRegex.test(Group_Name));
  }

  // 새 그룹 만들기
  const handlemakegroup = async () => {
    if (!isGroup_NameAvailable) {Alert.alert('올바른 그룹이름을 입력해주세요'); return;};
    
    try {
      // 그룹 만들기를 위한 백엔드 API 호출
      const response = await axios.post(`${SERVER_URL}/group`, {
          Group_Name: Group_Name,
      });
      // 랜덤으로 생성된 그룹 코드 
      const groupcode = response.data;
      Alert.alert("그룹 생성이 완료됐습니다! 주어진 그룹 코드 : ", groupcode);
      navigation.navigate('ManageGroup');   
    } catch (error) {
      console.error(error);
      Alert.alert('그룹 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>새 그룹 만들기</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>그룹 이름</Text>
        <View style={styles.usernameContainer}>
          <TextInput
            style={styles.input}
            value={Group_Name}
            onChangeText={handlegroupname}
            placeholder="그룹 이름을 입력하세요(2~10자)"
          />
          </View>
            {!Group_Name && (<Text style={{color:'red'}}>그룹이름을 입력해주세요.</Text>)}
            {Group_Name && !isGroup_NameAvailable && (<Text style={{color:'red'}}>사용 불가능한 그룹이름 입니다.</Text>)}
            {Group_Name && isGroup_NameAvailable && (<Text style={{color:'green'}}>사용 가능한 그룹이름 입니다.</Text>)}
      </View>

      <TouchableOpacity style={styles.signupButton} onPress={handlemakegroup}>
        <Text style={styles.signupButtonText}>그룹 만들기</Text>
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

export default CreateNewgroupScreen;

