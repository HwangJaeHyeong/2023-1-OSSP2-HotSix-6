import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SAMPLE_NOTICE_DATA_LIST } from '../../constant/notice';
import { A_SERVER_URL } from '../../constant/url';

let idCount = 5;

const GroupNoticeScreen = ({ route, navigation }) => {
  const [notices, setNotices] = useState(SAMPLE_NOTICE_DATA_LIST);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const SERVER_URL = A_SERVER_URL;

  const { group } = route.params;
  const groupcode = String(group.Group_Code);

  //헤더부분
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: group.Group_Name + ' 공지사항',
      headerStyle: {
        backgroundColor: '#3679A4',
      },
      headerTintColor: '#ffffff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, group]);

  useEffect(() => {
    loadNotices();
  }, []);

  //API요청 : 그룹별 공지사항 로드
  const loadNotices = () => {
    // axios
    //   .get(`${SERVER_URL}/group-notices?groupcode=${groupcode}`)
    //   .then((response) => {
    //     setNotices(response.data);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  };
  //API요청 : 그룹별 공지사항 추가
  const createNotice = () => {
    setNotices((prev) => [...prev, { id: idCount, title, content }]);
    setTitle('');
    setContent('');
    setCreateModalVisible(false);
    idCount++;

    // axios
    //   .post(`${SERVER_URL}/group-notices`, { title, content, groupcode })
    //   .then((response) => {
    //     setTitle('');
    //     setContent('');
    //     loadNotices();
    //     setCreateModalVisible(false);
    //     console.log('공지사항이 성공적으로 추가되었습니다.');
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  };

  //API요청 : 그룹별 공지사항 삭제
  const deleteNotice = (Notice_ID) => {
    axios
      .delete(`${SERVER_URL}/group-notices/${Notice_ID}`)
      .then((response) => {
        loadNotices();
        setModalVisible(false);
        console.log('공지사항이 성공적으로 삭제되었습니다.');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //아이템 추가
  const renderNoticeItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedNotice(item);
        setModalVisible(true);
      }}
      style={styles.noticeItem}
    >
      <Text style={styles.noticeTitle}>{item.title}</Text>
      <Text style={styles.noticeContent}>{item.content}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notices}
        renderItem={renderNoticeItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity
        style={styles.addButtonContainer}
        onPress={() => setCreateModalVisible(true)}
      >
        <View style={styles.addButton}>
          <Text style={styles.addButtonLabel}>+</Text>
        </View>
      </TouchableOpacity>

      {/* 삭제 및 세부 보기 모달 창*/}
      <Modal
        animationType='slide'
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>제목</Text>
            <TextInput
              style={styles.modalTitle}
              value={selectedNotice?.title}
              editable={false}
              onChangeText={(text) => {
                setSelectedNotice((prevState) => ({
                  ...prevState,
                  title: text,
                }));
              }}
            />
            <Text style={styles.modalText}>내용</Text>
            <TextInput
              style={styles.modalInput}
              value={selectedNotice?.content}
              editable={false}
              multiline={true}
              onChangeText={(text) => {
                setSelectedNotice((prevState) => ({
                  ...prevState,
                  content: text,
                }));
              }}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => deleteNotice(selectedNotice?.id)}
              >
                <Text style={styles.buttonText}>삭제</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 생성 모달 창*/}
      <Modal
        animationType='slide'
        visible={createModalVisible}
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>제목</Text>
            <TextInput
              style={styles.modalTitle}
              value={title}
              onChangeText={(text) => setTitle(text)}
            />
            <Text style={styles.modalText}>내용</Text>
            <TextInput
              style={styles.modalInput}
              value={content}
              multiline={true}
              onChangeText={(text) => setContent(text)}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.button} onPress={createNotice}>
                <Text style={styles.buttonText}>확인</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setCreateModalVisible(false)}
              >
                <Text style={styles.buttonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
    fontSize: 18,
    marginBottom: 8,
  },
  noticeContent: {
    fontSize: 15,
    color: '#888',
    marginBottom: 8,
  },
  noticeItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    width: '80%',
    borderRadius: 4,
  },
  modalText: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  modalTitle: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
    color: 'black',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
    color: 'black',
    height: 150,
  },

  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    margin: 8,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3679A4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  addButtonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3679A4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonLabel: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default GroupNoticeScreen;
