import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Modal from 'react-native-modal';

const GroupScreen = ({ route }) => {
  const SERVER_URL = 'http://192.168.0.240:8000/';
  const navigation = useNavigation();
  const email = 'osh94230315@gmail.com';
  const { groupName, groupCode } = route.params;
  //예시 하나 넣어놨습니다. 원래는 비워놓아야합니다.
  const [groups, setGroups] = useState([
    {
      Group_Code: 12345,
      Group_Name: 'Example Group',
    },
    {
      Group_Code: 1234235,
      Group_Name: 'Example Group2',
    },
  ]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);

  useEffect(() => {
    if (groupName && groupCode) {
      setGroups((prev) => [
        ...prev,
        {
          Group_Code: groupCode,
          Group_Name: groupName,
        },
      ]);
    }
  }, [groupName, groupCode]);

  useEffect(() => {
    //사용자가 속한 그룹이름과 그룹코드를 가져온다. 위의 형식대로
    axios
      .get(`${SERVER_URL}/group/get-group/?email=${email}`)
      .then((response) => {
        const userGroups = response.data;
        console.log(response.data);
        setGroups(userGroups);
      });
  }, []);

  const toggleModal = (group) => {
    setSelectedGroup(group);
    setModalVisible(!isModalVisible);
  };

  const leaveGroup = async () => {
    if (selectedGroup) {
      try {
        //백엔드한테 그룹에서 나가는 요청보내는 함수 만들어서 실행하고고
        //await removeUserFromGroup(selectedGroup.Group_Code, userId);
        console.log('그룹에서 나갑니다...');

        //이게 백엔드에서는 느리니까 일시적으로 화면에서 지우고 나중에 백엔드가 되면 되는대로 바꾸는
        //최적화 방법이라고는 하는디 일단 이렇게 해놓겠음.
        const updatedGroups = groups.filter(
          (group) => group.Group_Code !== selectedGroup.Group_Code
        );
        setGroups(updatedGroups);

        // 모달 닫기
        setConfirmModalVisible(false);
        setModalVisible(false);
      } catch (error) {
        console.error('Failed to leave the group:', error);
      }
    }
  };

  const renderGroupItem = ({ item }) => (
    <TouchableWithoutFeedback
      onLongPress={() => toggleModal(item)}
      onPress={() => navigation.navigate('GroupDetails', { group: item })}
    >
      <View style={styles.groupItem}>
        <Text style={styles.groupName}>{item.Group_Name}</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 그룹</Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.Group_Code.toString()}
        renderItem={renderGroupItem}
      />
      <TouchableOpacity
        style={styles.JoinGroupButton}
        onPress={() => navigation.navigate('JoinGroup', { email })}
      >
        <Text style={styles.JoinGroupButtonText}>
          그룹 코드로 그룹 입장하기
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.CreateGroupButton}
        onPress={() => navigation.navigate('Makegroup', { email })}
      >
        <Text style={styles.CreateGroupButtonText}>새 그룹 만들기</Text>
      </TouchableOpacity>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          {selectedGroup && (
            <>
              <Text style={styles.modalText}>
                그룹 코드: {selectedGroup.Group_Code}
              </Text>
              <Text style={styles.modalText}>
                그룹 이름: {selectedGroup.Group_Name}
              </Text>
            </>
          )}
          <TouchableOpacity onPress={() => console.log('그룹 코드 확인하기')}>
            <Text style={styles.modalOption}>그룹코드 확인하기</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('그룹 이름 수정하기')}>
            <Text style={styles.modalOption}>그룹이름 수정하기</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setConfirmModalVisible(true)}>
            <Text style={styles.modalOption}>그룹나가기</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('그룹 인원 확인하기')}>
            <Text style={styles.modalOption}>그룹인원 확인하기</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.modalClose}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={isConfirmModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>정말 나가시겠습니까?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={leaveGroup}>
              <Text style={styles.modalButton}>확인</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setConfirmModalVisible(false)}>
              <Text style={styles.modalButton}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  groupItem: {
    backgroundColor: '#F9F9F9',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderLeftWidth: 10,
    borderColor: '#F56D6D',
    elevation: 5,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalText: {
    color: '#3679A4',
    fontSize: 16,
    marginBottom: 10,
  },
  modalOption: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  modalClose: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginTop: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
    paddingHorizontal: 20,
  },
  JoinGroupButton: {
    marginTop: 16,
    backgroundColor: '#3679A4',
    borderRadius: 4,
    paddingVertical: 12,
  },
  CreateGroupButton: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderColor: '#3679A4',
    borderRadius: 4,
    paddingVertical: 12,
    borderWidth: 1,
  },
  JoinGroupButtonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 18,
  },
  CreateGroupButtonText: {
    textAlign: 'center',
    color: '#3679A4',
    fontSize: 18,
  },
});

export default GroupScreen;
