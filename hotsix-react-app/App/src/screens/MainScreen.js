import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const MainScreen = ({ navigation }) => {
  return (
    <View>
      <Text>메인화면</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Group')}>
        <Text>내 그룹 페이지로 이동</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Timetable')}>
        <Text>내 시간표 페이지로 이동</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MainScreen;