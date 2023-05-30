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
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Group", { userId: "user1" })}
      >
        <Text style={styles.loginButtonText}>내 그룹리스트</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Makegroup", { email: "example@naver.com" })}
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
