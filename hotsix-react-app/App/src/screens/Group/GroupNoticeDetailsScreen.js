import React from 'react';
import { View, Text, Button } from 'react-native';

const GroupNoticeDetailScreen = ({ route, navigation }) => {
  const { notice, onDelete } = route.params;

  const deleteNotice = () => {
    onDelete(notice.id);
    navigation.goBack();
  };

  return (
    <View>
      <Text>{notice.title}</Text>
      <Text>{notice.content}</Text>
      <Button title="삭제" onPress={deleteNotice} />
    </View>
  );
};

export default GroupNoticeDetailScreen;
