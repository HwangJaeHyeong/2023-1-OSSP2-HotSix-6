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

      <FlatList
        style={styles.list}
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
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
    flexDirection: 'row',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#3679A4',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    flex: 1,
  },
  sortButton: {
    width: 40,
    height: 40,
    backgroundColor: '#3679A4',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    marginTop: 16,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f2f2f2',
    borderRadius: 4,
  },
  statusButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusButtonText: {
    fontWeight: 'bold',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  deleteButton: {
    padding: 5,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default GroupTasksScreen;
