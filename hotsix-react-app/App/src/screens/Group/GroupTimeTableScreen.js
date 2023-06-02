import React from 'react';
import { View, Text } from 'react-native';

const GroupTimeTable = ({ route, navigation }) => {
  const { group } = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: group.Group_Name, 
      headerStyle: {
        backgroundColor: '#3679A4', // 헤더 배경색 변경
      },
      headerTintColor: '#ffffff', // 헤더 텍스트 색상 변경
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    
    });
  }, [navigation, group]);

  return (
    <View>
      <Text>{group.Group_Name}의 GroupTimeTable페이지</Text>
    </View>
  );
};

export default GroupTimeTable;
