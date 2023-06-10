import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useState } from 'react';
import {
  Alert,
  Button,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const InsertPhotoScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null); // 변경
  const [selectedMinute, setSelectedMinute] = useState(null); // 변경
  const [schedules, setSchedules] = useState(null);

  const selectImage = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      alert('카메라 권한이 필요합니다.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setSelectedImage({ uri: result.assets[0].uri });
    }
  };

  const sendImageToServer = async () => {
    if (selectedImage && selectedHour && selectedMinute) {
      // 변경
      try {
        const formData = new FormData();
        formData.append('image', {
          uri: selectedImage.uri,
          name: 'image.jpg',
          type: 'image/jpeg',
        });

        formData.append('time', `${selectedHour}:${selectedMinute}`); // 변경

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };

        navigation.navigate('Ranking');

        // 첫 이미지 보내기
        // const response = await axios.post(
        //   `${B_SERVER_URL}/user/images/`,
        //   formData,
        //   config
        // );

        // // /user/view-time-table/ 이거로 이메일이랑 같이 보내기 -> 배열 데이터 받기

        // const imageData = response.data.image;
        // setSchedules(imageData);

        // DB에 이미지 올리기 요청
        // const response2 = await axios.put(
        //   `${B_SERVER_URL}/user/img-time-table/`,
        //   { email: 'test1@test.com' }
        // );

        // 전송이 완료됐다면 다시 Timetable로 이동.
        if (response2.status >= 200 && response2.status < 300) {
          // Alert.alert(
          //   '이미지와 시간 전송 성공',
          //   '이미지와 시간이 서버로 전송되었습니다.'
          // );
        }
      } catch (error) {
        // Alert.alert(
        //   '이미지와 시간 전송 실패',
        //   '이미지와 시간을 서버로 전송하는 데 실패했습니다.'
        // );
      }
    } else {
      Alert.alert(
        '이미지 및 시간 선택',
        '전송할 이미지와 시간을 선택해주세요.'
      );
    }
  };

  const hours = [];
  for (let i = 8; i <= 12; i++) {
    hours.push(i);
  }
  const minutes = [];
  for (let j = 0; j < 60; j += 10) {
    minutes.push(j);
  }

  return (
    <ImageBackground
      source={require('hotsix-react-app/assets/backgroundimg2.png')}
      style={styles.container}
    >
      {!selectedImage && (
        <View style={styles.container2}>
          <Text style={styles.Text}>캘린더파일로</Text>
          <Text style={styles.loginButtonText}>
            {' '}
            내 시간표를 등록해보세요!{' '}
          </Text>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name='file-plus-outline'
              style={styles.icon}
            />
            <TouchableOpacity onPress={selectImage} style={styles.button}>
              <Text style={styles.buttonText}>JPG 파일 선택</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: selectedImage.uri }}
            style={{ flex: 1, width: null, height: null }}
            resizeMode='contain'
          />
          <View style={styles.questionBubble}>
            <Text style={styles.questionText}>
              일정에서 제일 빠른 시작시간을 입력해주세요.
            </Text>
          </View>
          <Picker
            selectedValue={selectedHour}
            style={styles.pickerStyle}
            onValueChange={(itemValue) => setSelectedHour(itemValue)}
          >
            {hours.map((hour, index) => (
              <Picker.Item label={`${hour}시`} value={hour} key={index} />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedMinute}
            style={styles.pickerStyle}
            onValueChange={(itemValue) => setSelectedMinute(itemValue)}
          >
            {minutes.map((minute, index) => (
              <Picker.Item label={`${minute}분`} value={minute} key={index} />
            ))}
          </Picker>
          <View style={styles.buttonContainer}>
            <Button title='확인' onPress={sendImageToServer} color='#F56D6D' />
          </View>
        </View>
      )}

      {/* {sendImageToServer && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => navigation.navigate("Ranking", { schedules: schedules })}
          >
          <Text style={styles.questionText}>삽입 완료</Text>
        </TouchableOpacity>
        </View>
      )} */}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  container2: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  questionBubble: {
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pickerStyle: {
    width: '80%',
    height: 50,
    color: '#344953',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 25,
    marginBottom: 20,
    alignItems: 'center',
  },
  Text: {
    color: '#ffffff',
    fontSize: 25,
    alignItems: 'center',
  },
  iconContainer: {
    width: 300,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dotted',
    borderWidth: 3,
    borderColor: 'gray',
    backgroundColor: '#ffffff',
  },
  icon: {
    fontSize: 90,
    color: 'gray',
    marginBottom: 10,
  },

  buttonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#3679A4',
    borderRadius: 5,
    marginTop: 10,
  },
});

export default InsertPhotoScreen;
