import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, TextInput, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const GroupNoticeScreen = ({ navigation }) => {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

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

  const createNotice = () => {
    axios.post('http://192.168.0.120:3001/notices', { title, content })
      .then(response => {
        setTitle('');
        setContent('');
        loadNotices();
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

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="제목"
          value={title}
          onChangeText={text => setTitle(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="내용"
          value={content}
          onChangeText={text => setContent(text)}
        />
        <Button title="작성" onPress={createNotice} />
      </View>
      <FlatList
        data={notices}
        renderItem={renderNoticeItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  noticeTitle: {
    fontSize: 16,
  },
  noticeContent: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 8,
  },
});

export default GroupNoticeScreen;
