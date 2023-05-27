import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const GroupTasksScreen = ({ route, navigation }) => {
  const SERVER_URL = 'http://192.168.0.12:3001';
  // 그룹별 헤더
  const { group } = route.params;
  const groupname = group.Group_Name;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: group.Group_Name,
      headerStyle: {
        backgroundColor: '#3679A4',
      },
      headerTintColor: '#ffffff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, group]);

  const [todoText, setTodoText] = useState('');
  const [todos, setTodos] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);

  useEffect(() => {
    // API 요청: 그룹별 내 할 일 목록 가져오기
    axios
      .get(`${SERVER_URL}/groups/${groupname}/todos`)
      .then((response) => {
        const fetchedTodos = response.data;
        setTodos(fetchedTodos);
      })
      .catch((error) => {
        console.error('할 일 목록 가져오기 중 오류 발생:', error);
      });

    // API 요청: 그룹원 목록 가져오기
    axios
      .get(`${SERVER_URL}/groupMembers`)
      .then((response) => {
        const fetchedMembers = response.data;
        setGroupMembers(fetchedMembers);
      })
      .catch((error) => {
        console.error('그룹원 목록 가져오기 중 오류 발생:', error);
      });
  }, []);

  // 새로운 항목 추가
  const addTodo = () => {
    if (todoText.trim() !== '') {
      const newTodo = {
        id: Date.now().toString(),
        text: todoText,
        status: '진행 안됨',
        color: '#888888',
      };
      setTodos([...todos, newTodo]);
      setTodoText('');

      // API 요청: 새로운 항목 추가
      axios
        .post(`${SERVER_URL}/groups/${groupname}/todos`, newTodo)
        .then((response) => {
          console.log('새로운 할 일이 성공적으로 추가되었습니다.');
          setTodos([...todos, newTodo]);
          setTodoText('');
        })
        .catch((error) => {
          console.error('할 일 추가 중 오류 발생:', error);
        });
    }
  };

  // 진행 상태별 정렬 기능
  const sortTodos = () => {
    let sortedTodos = [...todos];
    sortedTodos.sort((a, b) => a.status.localeCompare(b.status));
    setTodos(sortedTodos);
  };

  // 진행 상태 표시 버튼
  const toggleTodoStatus = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        let updatedStatus;
        let updatedColor;
        if (todo.status === '진행 안됨') {
          updatedStatus = '진행 중';
          updatedColor = '#FF4646';
        } else if (todo.status === '진행 중') {
          updatedStatus = '진행 완료';
          updatedColor = '#3679A4';
        } else {
          updatedStatus = '진행 안됨';
          updatedColor = '#888888';
        }
        // API 요청: 할 일 수정
        axios
          .patch(`${SERVER_URL}/todos/${id}`, { status: updatedStatus, color: updatedColor })
          .then((response) => {
            console.log('할 일이 성공적으로 수정되었습니다.');
            const updatedTodo = { ...todo, status: updatedStatus, color: updatedColor };
            const updatedTodos = todos.map((item) => (item.id === id ? updatedTodo : item));
            setTodos(updatedTodos);
          })
          .catch((error) => {
            console.error('할 일 수정 중 오류 발생:', error);
          });

        return {
          ...todo,
          status: updatedStatus,
          color: updatedColor,
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  // 리스트 삭제
  const deleteTodo = (id) => {
    // API 요청: 할 일 삭제
    axios
      .delete(`${SERVER_URL}/todos/${id}`)
      .then((response) => {
        console.log('할 일이 성공적으로 삭제되었습니다.');
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
      })
      .catch((error) => {
        console.error('할 일 삭제 중 오류 발생:', error);
      });
  };

  // 할 일 추가 목록
  const renderItem = ({ item }) => {
    return (
      <View style={styles.todoItem}>
        <View style={[styles.statusIndicator, { backgroundColor: item.color }]} />
        <Text style={[styles.todoText, { color: 'black' }]}>{item.text}</Text>
        <TouchableOpacity
          onPress={() => toggleTodoStatus(item.id)}
          style={[styles.statusButton, { backgroundColor: item.color }]}
        >
          <View>
            <Text style={[styles.statusButtonText, { color: '#fff' }]}>{item.status}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTodo(item.id)} style={styles.deleteButton}>
          <MaterialCommunityIcons name="delete" size={25} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="할 일을 입력하세요"
          value={todoText}
          onChangeText={setTodoText}
        />
        <TouchableOpacity onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>나의 업무 :</Text>
        <TouchableOpacity onPress={sortTodos} style={styles.sortButton}>
          <MaterialCommunityIcons name="sort" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          style={styles.list}
          data={todos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>그룹원 :</Text>
      </View>
      <View style={styles.memberContainer}>
        {groupMembers.map((member) => (
          <Text key={member.id} style={styles.memberText}>{member.name}</Text>
        ))}
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
    height:50
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
    height:250,
  },
  list: {
    flex: 1,
    marginTop: 10,
    
  },
  todoItem: {
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
  todoText: {
    flex: 1,
    fontSize: 16,
  },
  statusButton: {
    padding: 5,
    borderRadius: 5,
  },
  statusButtonText: {
    fontSize: 12,
  },
  deleteButton: {
    marginLeft: 10,
  },
  titleContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#3679A4',
  },
  memberContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  memberText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default GroupTasksScreen;
