import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  SAMPLE_GROUP_TASK_DATA_LIST,
  SAMPLE_TASK_DATA_LIST,
} from '../../constant/task';

let idCount = 5;

const GroupTasksScreen = ({ route, navigation }) => {
  // const SERVER_URL = 'http://192.168.0.12:3001';
  // 그룹별 헤더
  const { group } = route.params;
  const groupcode = String(group.Group_Code);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: group.Group_Name + ' 업무 진행 상황',
      headerStyle: {
        backgroundColor: '#3679A4',
      },
      headerTintColor: '#ffffff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, group]);

  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState(SAMPLE_TASK_DATA_LIST);
  const [groupTasks, setGroupTasks] = useState(SAMPLE_GROUP_TASK_DATA_LIST);

  //api 요청 : 그룹 업무 목록 가져오기
  useEffect(() => {
    // axios
    //   .get(`${SERVER_URL}/group-tasks?groupcode=${groupcode}`)
    //   .then((response) => {
    //     const fetchedTasks = response.data;
    //     setGroupTasks(fetchedTasks);
    //   })
    //   .catch((error) => {
    //     console.error('그룹 업무 목록 가져오기 중 오류 발생:', error);
    //   });
  }, []);

  //api 요청 : 내 업무 목록 가져오기
  useEffect(() => {
    // axios
    //   .get(`${SERVER_URL}/my-tasks?groupcode=${groupcode}`)
    //   .then((response) => {
    //     const fetchedTasks = response.data;
    //     setTasks(fetchedTasks);
    //   })
    //   .catch((error) => {
    //     console.error('할 일 목록 가져오기 중 오류 발생:', error);
    //   });
  }, []);

  // 새로운 항목 추가
  const addTask = () => {
    if (taskText.trim() !== '') {
      const newTask = {
        id: Date.now().toString(),
        text: taskText,
        status: '진행 안됨',
      };
      setTaskText('');
      setTasks((prev) => [
        ...prev,
        { id: idCount, text: taskText, status: '진행 안됨' },
      ]);
      idCount++;

      // API 요청: 새로운 항목 추가
      // axios
      //   .post(`${SERVER_URL}/my-tasks`, { ...newTask, groupcode })
      //   .then((response) => {
      //     console.log('새로운 할 일이 성공적으로 추가되었습니다.');
      //     const createdTask = response.data;
      //     const color = getStatusColor(createdTask.status);
      //     const updatedTask = { ...createdTask, color };

      //     setTasks((prevTasks) => [...prevTasks, updatedTask]);
      //   })
      //   .catch((error) => {
      //     console.error('할 일 추가 중 오류 발생:', error);
      //   });
    }
  };

  // 상태에 따른 색상을 반환
  const getStatusColor = (status) => {
    switch (status) {
      case '진행 안됨':
        return '#888888';
      case '진행 중':
        return '#FF4646';
      case '진행 완료':
        return '#3679A4';
      default:
        return '#888888';
    }
  };

  // 진행 상태별 정렬
  const sortTasks = () => {
    let sortedTasks = [...tasks];
    sortedTasks.sort((a, b) => {
      const statusOrder = ['진행 안됨', '진행 중', '진행 완료'];
      return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    });
    setTasks(sortedTasks);
  };

  // 진행 상태 표시 버튼
  const toggleTaskStatus = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        let updatedStatus;
        let updatedColor;
        if (task.status === '진행 안됨') {
          updatedStatus = '진행 중';
          updatedColor = '#FF4646';
        } else if (task.status === '진행 중') {
          updatedStatus = '진행 완료';
          updatedColor = '#3679A4';
        } else {
          updatedStatus = '진행 안됨';
          updatedColor = '#888888';
        }
        // API 요청: 할 일 수정
        // axios
        //   .patch(`${SERVER_URL}/my-tasks/${id}`, { status: updatedStatus })
        //   .then((response) => {
        //     console.log('할 일이 성공적으로 수정되었습니다.');
        //     const updatedTask = { ...task, status: updatedStatus };
        //     const updatedColor = getStatusColor(updatedStatus);
        //     updatedTask.color = updatedColor;
        //     const updatedTasks = tasks.map((item) =>
        //       item.id === id ? updatedTask : item
        //     );
        //     setTasks(updatedTasks);
        //   })
        //   .catch((error) => {
        //     console.error('할 일 수정 중 오류 발생:', error);
        //   });

        setTasks((prev) =>
          prev.map((value) =>
            value.id === id ? { ...value, status: updatedStatus } : value
          )
        );

        return {
          ...task,
          status: updatedStatus,
          color: updatedColor,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  // 리스트 삭제
  const deleteTask = (id) => {
    // API 요청: 할 일 삭제
    // axios
    //   .delete(`${SERVER_URL}/my-tasks/${id}`)
    //   .then((response) => {
    //     console.log('할 일이 성공적으로 삭제되었습니다.');
    //     const updatedTasks = tasks.filter((task) => task.id !== id);
    //     setTasks(updatedTasks);
    //   })
    //   .catch((error) => {
    //     console.error('할 일 삭제 중 오류 발생:', error);
    //   });
    setTasks((prev) => prev.filter((value) => value.id !== id));
  };

  // 내 업무 추가 목록
  const renderItem = ({ item }) => {
    const taskColor = getStatusColor(item.status);

    return (
      <View style={styles.taskItem}>
        <View
          style={[styles.statusIndicator, { backgroundColor: taskColor }]}
        />
        <Text style={[styles.taskText, { color: 'black' }]}>{item.text}</Text>
        <TouchableOpacity
          onPress={() => toggleTaskStatus(item.id)}
          style={[styles.statusButton, { backgroundColor: taskColor }]}
        >
          <View>
            <Text style={[styles.statusButtonText, { color: '#fff' }]}>
              {item.status}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteTask(item.id)}
          style={styles.deleteButton}
        >
          <MaterialCommunityIcons name='delete' size={25} color='black' />
        </TouchableOpacity>
      </View>
    );
  };

  //그룹원 업무
  const renderGroupTaskItem = ({ item }) => {
    const taskColor = getStatusColor(item.status);
    return (
      <View style={styles.groupTaskItem}>
        <View style={styles.groupTaskTitleContainer}>
          <View
            style={[styles.statusIndicator, { backgroundColor: taskColor }]}
          />
          <Text style={[styles.taskText, { color: 'black' }]}>{item.text}</Text>
          <Text style={styles.authorText}>담당: {item.author}</Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='할 일을 입력하세요'
          value={taskText}
          onChangeText={setTaskText}
        />
        <TouchableOpacity onPress={addTask} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>나의 업무 :</Text>
        <TouchableOpacity onPress={sortTasks} style={styles.sortButton}>
          <MaterialCommunityIcons name='sort' size={20} color='#fff' />
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          style={styles.list}
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>그룹원 업무 :</Text>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          style={styles.list}
          data={groupTasks}
          renderItem={renderGroupTaskItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#888',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  addButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#3679A4',
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#3679A4',
    height: 50,
  },
  sortButton: {
    padding: 5,
    backgroundColor: '#3679A4',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 10,
    height: 250,
  },
  list: {
    flex: 1,
    marginTop: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    marginBottom: 10,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  statusButton: {
    padding: 5,
    borderRadius: 5,
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    marginLeft: 10,
  },
  authorText: {
    marginTop: 5,
    fontSize: 12,
    fontStyle: 'italic',
  },
  groupTaskItem: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  groupTaskTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  groupTaskTitle: {
    fontWeight: 'bold',
  },
  groupTaskDescription: {
    fontStyle: 'italic',
  },
  memberTasks: {
    marginTop: 5,
    paddingLeft: 10,
  },
});

export default GroupTasksScreen;
