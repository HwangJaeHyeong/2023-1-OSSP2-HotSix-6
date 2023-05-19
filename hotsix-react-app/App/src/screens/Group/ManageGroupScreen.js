import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  PanResponder,
  Image,
  TouchableOpacity,
} from "react-native";

const ManageGroupScreen = ({ navigation }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    require("../../components/1.png"),
    require("../../components/2.png"),
    require("../../components/3.png"),
    // 추가 이미지 경로들
  ];

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,

    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx < -50) {
        const nextImageIndex = currentImageIndex + 1;
        if (nextImageIndex < images.length) {
          setCurrentImageIndex(nextImageIndex);
        }
      } else if (gestureState.dx > 50) {
        const prevImageIndex = currentImageIndex - 1;
        if (prevImageIndex >= 0) {
          setCurrentImageIndex(prevImageIndex);
        }
      }
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer} {...panResponder.panHandlers}>
        <Image style={styles.image} source={images[currentImageIndex]} />
      </View>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Group", { userId: "user1" })}
      >
        <Text style={styles.loginButtonText}>내 그룹리스트</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Makegroup", { userId: "user1" })}
      >
        <Text style={styles.loginButtonText}>새 그룹 만들기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ManageGroupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#000000",
  },
  image: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  loginButton: {
    width: "80%",
    marginTop: 5,
    backgroundColor: "#1c7ed6",
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});
