import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

// InsertTextScreen -> RankingScreen 값 넘기는거 예시
// 일단 이 스크린으로 예시 들었는데 나중에는 json으로 받아서 값 넘기기

const schedules = [
  [0, 0, 0, 1, 0, 1, 0], // 8시
  [0, 0, 0, 1, 0, 1, 0], // 8시 30분
  [0, 0, 0, 1, 0, 1, 0], // 9시
  [0, 0, 0, 1, 0, 1, 0], // 9시 30분
  [0, 1, 0, 1, 0, 1, 0], // 10시
  [0, 1, 0, 0, 0, 1, 0], // 10시 30분
  [1, 1, 0, 0, 0, 1, 0], // 11시
  [1, 1, 0, 0, 0, 1, 0], // 11시 30분
  [1, 1, 0, 0, 0, 0, 0], // 12시
  [1, 1, 0, 0, 0, 0, 0], // 12시 30분
  [0, 1, 0, 0, 0, 0, 0], // 13시
  [0, 0, 0, 0, 0, 0, 0], // 13시 30분
  [0, 0, 0, 1, 0, 0, 0], // 14시
  [0, 0, 0, 1, 0, 0, 0], // 14시 30분
  [0, 0, 0, 1, 0, 0, 0], // 15시
  [0, 0, 0, 1, 0, 0, 0], // 15시 30분
  [0, 0, 0, 1, 0, 0, 0], // 16시
  [0, 0, 0, 1, 0, 0, 0], // 16시 30분
  [1, 0, 0, 1, 0, 0, 0], // 17시
  [1, 0, 0, 0, 0, 0, 0], // 17시 30분
  [1, 0, 0, 0, 0, 0, 0], // 18시
  [0, 0, 0, 0, 0, 0, 1], // 18시 30분
  [0, 0, 0, 0, 0, 0, 1], // 19시
  [0, 0, 0, 0, 0, 0, 1], // 19시 30분
  [0, 0, 0, 0, 0, 0, 1], // 20시
  [0, 0, 0, 0, 0, 0, 0], // 20시 30분
  [0, 0, 0, 0, 0, 0, 0], // 21시
  [0, 0, 0, 0, 0, 0, 0], // 21시 30분
  [0, 0, 0, 0, 1, 0, 0], // 22시
  [0, 0, 0, 0, 1, 0, 0], // 22시 30분
  [0, 0, 0, 0, 1, 0, 0], // 23시
  [0, 0, 0, 0, 1, 0, 0], // 23시 30분
  [0, 0, 0, 0, 1, 0, 0], // 24시
];

const InsertTextScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>시간표삽입</Text>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Ranking", { schedules: schedules })}
      >
        <Text style={styles.loginButtonText}>삽입 완료</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InsertTextScreen;

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
