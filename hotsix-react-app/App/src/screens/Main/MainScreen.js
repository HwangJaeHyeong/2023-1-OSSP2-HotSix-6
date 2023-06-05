import React from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";

const MainScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>메인화면</Text>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Group", { userId: "user1" })}
      >
        <Text style={styles.loginButtonText}>내 그룹 보기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Timetable")}
      >
        <Text style={styles.loginButtonText}>내 시간표 보기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>회원정보 수정</Text>
      </TouchableOpacity>
     
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  logo: {
    backgroundColor: "#dddddd",
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  input: {
    width: "80%",
    borderColor: "#dddddd",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  loginButton: {
    width: "80%",
    backgroundColor: "#1c7ed6",
    marginBottom: 16,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});
