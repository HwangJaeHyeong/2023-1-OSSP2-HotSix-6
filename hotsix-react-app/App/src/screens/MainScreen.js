import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const MainScreen = ({ navigation }) => {
  return (
    // user1으로 가정
    <View>
      <Text>메인화면</Text>  
      <TouchableOpacity onPress={() => navigation.navigate('ManageGroup')}>
        <Text>내 그룹 페이지로 이동</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Timetable')}>
        <Text>내 시간표 페이지로 이동</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MainScreen;