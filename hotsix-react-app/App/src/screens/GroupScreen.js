import React from 'react';
import { View, Text } from 'react-native';

const GroupScreen = () => {
  return (
    <View>
      <Text>그룹 페이지</Text>
      {/* 추가 */}
    </View>
  );
};

export default GroupScreen;

/*import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { getMyGroups } from '../services/groupService';

const GroupPage = ({ navigation }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    async function fetchGroups() {
      const myGroups = await getMyGroups();
      setGroups(myGroups);
    }

    fetchGroups();
  }, []);

  const handleGroupSelect = (groupId) => {
    navigation.navigate('선택한 그룹 페이지', { groupId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 그룹</Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.groupItem}
            onPress={() => handleGroupSelect(item.id)}
          >
            <Text style={styles.groupName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    marginTop: 16,
    marginBottom: 24,
  },
  groupItem: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 4,
    backgroundColor: '#f1f3f5',
  },
  groupName: {
    fontSize: 18,
  },
});

export default GroupPage;
*/