import React from "react";
import { StyleSheet, Text, View, TouchableOpacity,ImageBackground,Image} from "react-native";

const RegisterScreen = ({ navigation }) => {

  return (
    <ImageBackground source={require("hotsix-react-app/assets/backgroundimg3.png")} style={styles.container}>
       <Image
            source={require("hotsix-react-app/assets/MainLogo.png")}
            style={styles.logoImage}
          />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("InsertPhoto")}
        >
          <Text style={styles.loginButtonText}>사진으로 등록하기</Text>
          <Text style={styles.Text}>이미지 파일로 내 시간표를 등록해보세요!</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("InsertIcs")}
        >
          <Text style={styles.loginButtonText}>ics파일로 등록하기</Text>
          <Text style={styles.Text}>캘린더 파일로 내 시간표를 등록해보세요!</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logoImage: {
    width: "80%",
    height: 200,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 50,
    width: "80%",
  },
  loginButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#3679A4",
    fontSize: 20,
  },
  Text: {
    color: "#888888",
    fontSize: 14,
    marginTop: 8,
  },
});
