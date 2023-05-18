import React from 'react';
import { Alert, StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import TimeTable, { generateTimeTableData, } from 'react-native-timetable';
import { addMinutes } from 'date-fns';
import moment from 'moment';

const schedules = [
  [0,0,0,0,0,1,0], // 8시 
  [0,0,0,0,0,1,0], // 8시 30분 
  [0,0,0,0,0,1,0], // 9시
  [0,0,0,0,0,1,0], // 9시 30분
  [0,0,0,0,0,1,0], // 10시 
  [0,0,0,0,0,1,0], // 10시 30분
  [1,0,0,0,0,1,0], // 11시
  [1,0,0,0,0,1,0], // 11시 30분
  [1,1,0,0,0,0,0], // 12시
  [1,1,0,0,0,0,0], // 12시 30분
  [0,1,0,0,0,0,0], // 13시
  [0,0,0,0,0,0,0], // 13시 30분 
  [0,0,0,1,0,0,0], // 14시
  [0,0,0,1,0,0,0], // 14시 30분
  [0,0,0,1,0,0,0], // 15시 
  [0,0,0,1,0,0,0], // 15시 30분 
  [0,0,0,1,0,0,0], // 16시
  [0,0,0,1,0,0,0], // 16시 30분 
  [1,0,0,1,0,0,0], // 17시
  [1,0,0,0,0,0,0], // 17시 30분
  [1,0,0,0,0,0,0], // 18시 
  [0,0,0,0,0,0,1], // 18시 30분
  [0,0,0,0,0,0,1], // 19시 
  [0,0,0,0,0,0,1], // 19시 30분
  [0,0,0,0,0,0,1], // 20시 
  [0,0,0,0,0,0,0], // 20시 30분
  [0,0,0,0,0,0,0], // 21시
  [0,0,0,0,0,0,0], // 21시 30분
  [0,0,0,0,1,0,0], // 22시
  [0,0,0,0,1,0,0], // 22시 30분
  [0,0,0,0,1,0,0], // 23시 
  [0,0,0,0,1,0,0], // 23시 30분
  [0,0,0,0,1,0,0], // 24시 
];

const createEvent = (start, end, i) => {
  const date = new Date('2023-05-01T00:00:00.000Z');
  const startTime = addMinutes(date, start + 480);
  const endTime = addMinutes(date, end + 480);
  const Date1 = i;
  return {
    startTime: startTime,
    endTime: endTime,
    Date1: Date1, 
  }
};

// 이진 배열을 Event 객체의 배열로 변환
const events = [];

for(let i = 0; i < schedules[0].length; i++) {
  let start = null;
  let end = null;
  let flag = null; 
  for(let j = 0; j < schedules.length; j++) {
    const row = schedules[j];
    const val = row[i];
    if(val === 1 && start === null) {
      start = j * 30;
      flag = true; 
    } else if (val === 0 && flag) {
      end = (j-1) * 30; 
      events.push(createEvent(start, end, i));
      start = null;
      end = null;
      flag = null;
    }
  }
  if (start !== null) {
    end = (schedules.length - 1) * 30;
    events.push(createEvent(start, end, i));
  }
} 

const eventsFormatted = events.map(event => {
  return {
    ...event,
    startTime: event.startTime.toISOString(),
    endTime: event.endTime.toISOString(),
    // Date1: event.Date1.toISOString(),
  };
});

const RankingScreen = () => {
  const navigation = useNavigation();

  const renderGridItem = ({ item }) => {
    const start = moment.utc(item.startTime);
    const starttime = start.format('HH:mm');
    
    const end = moment.utc(item.endTime);
    const endtime = end.format('HH:mm');
    
    const Date1 = item.Date1;
    const Date2 = ["월", "화", "수", "목", "금", "토", "일"];
    const viewdate = Date2[Date1];

    const duration = moment.duration(end.diff(start)).asMinutes() * 16 / 24;
    const topOffset = (start.hour() - 8) * 38 + start.minute();
    const height = duration;
    const width = 44; // 버튼의 너비
    const leftOffset = width * Date1;

    return (
      <TouchableOpacity
        style={[styles.eventButton, { top: topOffset, height: height, width: width, left: leftOffset+5 }]}
        onPress={() => Alert.alert(`${viewdate}: ${starttime} ~ ${endtime}`)}
      >
        <Text style={styles.eventButtonText}>
          {/* {start.format('HH:mm')} - {end.format('HH:mm')} */}
          {viewdate}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timeText}></Text>

        {Array.from(Array(7).keys()).map((day) => (
          <Text key={day} style={styles.dayText}>
            {moment().day(day + 1).format('ddd')}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        <View style={styles.timeColumn}>
        {Array.from(Array(17).keys()).map((hour) => (
          <Text key={hour} style={styles.timeText}>
            {moment().hour(hour + 8).format('HH:00')}
          </Text>
        ))}
      </View>
        <View style={styles.eventGrid}>
          {eventsFormatted.map((event, index) => (
            <React.Fragment key={index}>{renderGridItem({ item: event })}</React.Fragment>
          ))}
        </View>
      </View>
    </View>
  );
};

export default RankingScreen;

const styles = StyleSheet.create({
  titleContainer: {
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#00bfff',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  timetableContainer: {
    flex: 1,
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  timeline: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  timelineLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  eventBlock: {
    position: 'absolute',
    left: 50,
    right: 0,
    backgroundColor: '#f9c2ff',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  eventTime: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  eventTitle: {
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    padding: 10,
  },
  timeText: {
    flex: 1,
    textAlign: 'center',
    color: '#888',
  },
  dayText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
  },
  timeColumn: {
    flex: 1,
    borderRightColor: '#ccc',
    borderRightWidth: 1,
  },
  eventGrid: {
    flex: 7,
    paddingLeft: 10,
    paddingRight: 10,
    position: 'relative',
  },
  eventButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#3399ff',
    borderRadius: 5,
    padding: 5,
  },
  eventButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


