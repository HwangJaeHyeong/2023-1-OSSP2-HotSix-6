import React, {useState, useEffect} from 'react';
import {View, Text, FlatList,StyleSheet} from 'react-native';

const GroupScreen = ({route}) => {
  const { userId } = route.params;
  const [groups, setGroups] = useState([]);
  
  
  useEffect(() => {
    fetch(`http://172.30.1.10:3000/groupMembers`)
      .then((response) => response.json())
      .then((groupMembersData) => {
        const userGroupCodes = groupMembersData
          .filter((groupMember) => groupMember.Member_ID === userId)
          .map((groupMember) => groupMember.Group_Code);
  
        fetch(`http://172.30.1.10:3000/groups`)
          .then((response) => response.json())
          .then((groupsData) => {
            const filteredGroups = groupsData.filter((group) =>
              userGroupCodes.includes(group.Group_Code)
            );
            setGroups(filteredGroups);
          });
      });
  }, [userId]);

  const renderGroupItem = ({item}) => (
    <View style={styles.groupItem}>
      <Text style={styles.groupName}>{item.Group_Name}</Text>
    </View>
  );


  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Groups</Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.Group_Code.toString()}
        renderItem={renderGroupItem}
      />
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  groupItem: {
    backgroundColor: '#007AFF',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GroupScreen;