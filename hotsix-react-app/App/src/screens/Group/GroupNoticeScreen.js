import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, TextInput, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const GroupNoticeScreen = ({ navigation }) => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = () => {
    axios.get('http://192.168.0.120:3001/notices')
      .then(response => {
        setNotices(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const deleteNotice = (noticeId) => {
    axios.delete(`http://192.168.0.120:3001/notices/${noticeId}`)
      .then(response => {
        loadNotices();
      })
      .catch(error => {
        console.error(error);
      });
  };

  const renderNoticeItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('GroupNoticeDetails', { notice: item, onDelete: deleteNotice })}>
      <Text style={styles.noticeTitle}>{item.title}</Text>
      <View style={styles.noticeContent}></View>
    </TouchableOpacity>
  );

  const navigateToCreateNotice = () => {
    navigation.navigate('GroupNoticeCreation');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Button title="작성" onPress={navigateToCreateNotice} />
      </View>
      <FlatList
        data={notices}
        renderItem={renderNoticeItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};
