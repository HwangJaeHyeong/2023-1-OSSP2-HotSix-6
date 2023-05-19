import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const GroupDetailsScreen = ({route}) => {
  const { group } = route.params;
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Group Name: {group.Group_Name}</Text>
        <View style={styles.row}>
            <View style={styles.boxcontainer}>
                <View style={styles.box}>
                    <MaterialCommunityIcons name="calendar-month" style={styles.icon} />
                    <Text style={styles.text}>그룹 시간표</Text>
                </View>
            </View>
            <View style={styles.boxcontainer}>
                <View style={styles.box}>
                    <MaterialCommunityIcons name="bullhorn-outline" style={styles.icon}/>
                    <Text style={styles.text}>공지사항</Text>
                </View>
            </View>
           
         </View>

         <View style={styles.row}>
            <View style={styles.boxcontainer}>
                <View style={styles.box}>
                    <MaterialCommunityIcons name="file-document-edit-outline" style={styles.icon} />
                    <Text style={styles.text}>프로젝트 진행 항목</Text>
                </View>
            </View>
            <View style={styles.boxcontainer}>
                <View style={styles.box}>
                    <MaterialCommunityIcons name="progress-check" style={styles.icon}/>
                    <Text style={styles.text}>팀원 업무 진행 상황</Text>
                </View>
            </View>
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
   title:{
    fontSize:20,
    marginBottom : 20,
   },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    
    
  },
  boxcontainer:{
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  box: {
    width: 150,
    height: 150,
    backgroundColor: '#3679A4',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
   
  },

  icon:{
    fontSize: 90, 
    color: '#ffffff', 
    marginBottom: 10,
 
  },

  
  text: {
    color:'#ffffff',
    fontSize: 16,
  },
});

export default GroupDetailsScreen;
