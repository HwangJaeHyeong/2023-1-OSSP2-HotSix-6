import React, { useState } from "react";
import {
  View,
  Button,
  Image,
  Dimensions,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location"; // expo-location을 추가로 import합니다.
import axios from "axios";

const InsertPhotoScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const selectImage = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync(); // 위치 권한을 요청합니다.
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
    if (selectedImage) {
      try {
        const formData = new FormData();
        formData.append("image", {
          uri: selectedImage.uri,
          name: "image.jpg",
          type: "image/jpeg",
        });

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

        const response = await axios.post(
          "http://172.30.1.31:8000/receive_image/",
          formData,
          config
        );
        const imageData = response.data.image;

        Alert.alert("이미지 전송 성공", "이미지가 서버로 전송되었습니다.");
      } catch (error) {
        Alert.alert(
          "이미지 전송 실패",
          "이미지를 서버로 전송하는 데 실패했습니다."
        );
      }
    } else {
      Alert.alert("이미지 선택", "전송할 이미지를 선택해주세요.");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="JPG 파일 선택" onPress={selectImage} />
      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: selectedImage.uri }}
            style={{ flex: 1, width: null, height: null }}
            resizeMode="contain"
          />
          <View style={styles.buttonContainer}>
            <Button title="확인" onPress={sendImageToServer} />
          </View>
        </View>
      )}
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
});

export default InsertPhotoScreen;
