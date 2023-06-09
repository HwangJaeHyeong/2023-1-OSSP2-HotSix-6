import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { CheckBox, Button } from 'react-native-elements';
import axios from 'axios';

const GroupProgressScreen = ({ route, navigation }) => {
  const { group } = route.params;
  const [ boxes, setBoxes ] = useState([]);

  // Layout
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: ` ${group.Group_Name} `,
      headerStyle: {
        backgroundColor: '#3679A4',
      },
      headerTintColor: '#ffffff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: () => (
        <TouchableOpacity style={styles.completeButton} onPress={postBoxesToDB}>
          <Text style={styles.completeButtonText}>완료</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, group, boxes]);

  // 처음에 screen 가져올때 박스 데이터를 가져오는 함수
  const fetchBoxesFromDB = () => {
    axios.get('http://192.168.200.71:3000/users', {
    })
      .then(response => {
        const findbox = response.data.find((item) => item.Group_Code === group.Group_Code);
        // GET 요청 성공 시 박스 데이터를 상태값으로 설정
        const fetchedBoxes = findbox.boxes.map(box => ({
          text: box.text,
          checked: box.checked,
        }));
        setBoxes(fetchedBoxes);
      })
      .catch(error => {
        console.error('박스 데이터 가져오기 실패:', error);
      });
  };
  useEffect(() => {
    fetchBoxesFromDB(); // 화면 진입 시 박스 데이터를 가져오도록 설정
  }, []);

  // 진행 항목 추가: box는 { checked: true or false, text "" } 형태
  const addBox = () => {
    setBoxes([...boxes, { text: '', checked: false }]);
  };

  // box 삭제 
  const deleteBox = (index) => {
    const updatedBoxes = [...boxes];
    updatedBoxes.splice(index, 1);
    setBoxes(updatedBoxes);
  };

  // 박스 안에 텍스트 handle
  const handleTextChange = (text, index) => {
    const updatedBoxes = [...boxes];
    updatedBoxes[index].text = text;
    setBoxes(updatedBoxes);
  };

  // 박스 check
  const handleCheckBoxChange = (index) => {
    const updatedBoxes = [...boxes];
    updatedBoxes[index].checked = !updatedBoxes[index].checked;
    setBoxes(updatedBoxes);
  };

  // 진행사항 프로그래스 나타내기
  const calculateProgress = () => {
    const totalBoxes = boxes.length;
    const completedBoxes = boxes.filter((box) => box.checked).length;
    return totalBoxes === 0 ? 0 : (completedBoxes / totalBoxes) * 100;
  };

  // 완료 버튼 클릭 시 DB로 보내기 
  const postBoxesToDB = () => {
    axios.post('http://192.168.0.9:3000/users', {
      email: "test1@test.com", 
      Group_Code: group.Group_Code,
      boxes: boxes.map(box => ({ text: box.text, checked: box.checked })),
    })
      .then(response => {
        console.log('박스 데이터가 DB로 전송되었습니다.');
        navigation.navigate('GroupDetails');
      })
      .catch(error => {
        console.error('박스 데이터 전송에 실패하였습니다.', error);
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {boxes.map((box, index) => (
          <View key={index} style={styles.box}>
            <TextInput
              style={styles.textInput}
              placeholder="텍스트 입력"
              value={box.text}
              onChangeText={(text) => handleTextChange(text, index)}
            />
            <CheckBox
              checked={box.checked}
              onPress={() => handleCheckBoxChange(index)}
            />
            <TouchableOpacity onPress={() => deleteBox(index)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>삭제</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={addBox}>
          <Text style={styles.addButtonText}>진행 항목 추가</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.progressBar}>
        <View
          style={{
            width: `${calculateProgress()}%`,
            height: '100%',
            backgroundColor: '#3679A4',
            borderRadius: 5,
          }}
        />
        <Text style={styles.progressText}>{`${boxes.filter((box) => box.checked).length} / ${boxes.length}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  content: {
    flexGrow: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: '#3679A4',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#3679A4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  progressBar: {
    width: '100%',
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 5,
  },
  completeButton: {
    marginRight: 10,
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GroupProgressScreen;