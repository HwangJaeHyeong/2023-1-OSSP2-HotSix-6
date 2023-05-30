import React, { useState } from "react";
import { View, Button, Image, Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import axios from "axios";
import { Menu } from "react-native-paper"; // 변경

const InsertPhotoScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null); // 변경
  const [selectedMinute, setSelectedMinute] = useState(null); // 변경
  const [schedules, setschedules] = useState(null);
  
  const selectImage = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== "granted") {
      alert("카메라 권한이 필요합니다.");
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
        formData.append("image", {
          uri: selectedImage.uri,
          name: "image.jpg",
          type: "image/jpeg",
        });

        formData.append("time", `${selectedHour}`); // 변경

        // const config = {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        // };

        const response = await axios.post(
          `http://192.168.200.24:8000/user/time-table/`, {
          email: `test1@test.com`,
          formData, 
          });
        const imageData = response.data.image;
        setschedules(imageData);

        Alert.alert(
          "이미지와 시간 전송 성공",
          "이미지와 시간이 서버로 전송되었습니다."
        );
      } catch (error) {
        Alert.alert(
          "이미지와 시간 전송 실패",
          "이미지와 시간을 서버로 전송하는 데 실패했습니다."
        );
      }
    } else {
      Alert.alert(
        "이미지 및 시간 선택",
        "전송할 이미지와 시간을 선택해주세요."
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
    <View style={styles.container}>
      <Button
        style={styles.selectButton}
        title="JPG 파일 선택"
        onPress={selectImage}
      />

      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: selectedImage.uri }}
            style={{ flex: 1, width: null, height: null }}
            resizeMode="contain"
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
            <Button title="확인" onPress={sendImageToServer} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
  },
  buttonContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  questionBubble: {
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  pickerStyle: {
    width: "80%",
    height: 50,
    color: "#344953",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: "center",
  },
});

export default InsertPhotoScreen;
