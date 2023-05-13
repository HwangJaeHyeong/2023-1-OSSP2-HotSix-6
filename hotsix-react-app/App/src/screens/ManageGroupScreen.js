import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const ManageGroupScreen = ({ navigation }) => {
  return (
    // user1으로 가정
    <View>
      <Text>메인화면</Text>  
      <TouchableOpacity onPress={() => navigation.navigate('Group', {userId: 'user1'})}>
        <Text>내 그룹리스트 페이지로 이동</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Makegroup', {userId: 'user1'})}>
        <Text>새 그룹 만들기 페이지로 이동</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ManageGroupScreen;