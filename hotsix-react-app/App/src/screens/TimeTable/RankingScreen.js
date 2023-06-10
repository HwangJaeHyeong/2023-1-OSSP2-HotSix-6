import { useRoute } from '@react-navigation/native';
import { addMinutes } from 'date-fns';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SAMPLE_RANKING_DATA_LIST } from '../../constant/ranking';
//시간표를 누르면 그것들을 배열에 추가하거나 제거한다.

const RankingScreen = ({ navigation }) => {
  const route = useRoute();
  // const { schedules } = route.params;

  const schedules = SAMPLE_RANKING_DATA_LIST;

  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);

  const getTimeIndex = (time) => {
    const [hours, minutes] = time.split(':');
    const totalMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    return (totalMinutes - 480) / 30;
  };

  const handleEventPress = (index) => {
    const event = eventsFormatted[index];
    const existingEventIndex = selectedEvents.findIndex(
      (selectedEvent) => selectedEvent.index === index
    );

    if (existingEventIndex > -1) {
      // 이미 선택된 이벤트면 배열에서 제거
      const newSelectedEvents = [...selectedEvents];
      newSelectedEvents.splice(existingEventIndex, 1);
      setSelectedEvents(newSelectedEvents);
    } else {
      // 선택 안된 이벤트면 배열에 추가
      setSelectedEvents([...selectedEvents, { ...event, index }]);
    }
  };

  const printSelectedEventsInfo = () => {
    // const schedule = {};
    // const weekDays = ['월', '화', '수', '목', '금', '토', '일'];

    // selectedEvents.forEach((selectedEvent) => {
    //   const { startTime, endTime, Date1 } = selectedEvent;
    //   const day = weekDays[Date1];

    //   if (!startTime || !endTime) {
    //     console.log('Invalid event time:', selectedEvent);
    //     return;
    //   }

    //   const start = moment.utc(startTime);
    //   const end = moment.utc(endTime);

    //   const str_idx = getTimeIndex(start.format('HH:mm'));
    //   const time_len = Math.round(
    //     moment.duration(end.diff(start)).asMinutes() / 30
    //   );

    //   if (!schedule[day]) {
    //     schedule[day] = [];
    //   }

    //   schedule[day].push([str_idx, time_len]);
    // });
    // console.log(schedule);

    // axios
    //   .post('http://172.30.1.52:8000/test/', schedule)
    //   .then((response) => {
    //     console.log(response);
    //     Alert.alert('백엔드로 데이터가 성공적으로 전송되었습니다.');
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    navigation.goBack();
    navigation.goBack();
    navigation.goBack();
    navigation.navigate('menu');
  };

  // 전 화면에서 schedules 받아서 시간표에서 "1" 공강으로 인식 시키기
  useEffect(() => {
    const handleTimetable = (schedules) => {
      const generatedEvents = [];
      for (let i = 0; i < schedules[0].length; i++) {
        let start = null;
        let end = null;
        let flag = null;
        for (let j = 0; j < schedules.length; j++) {
          const row = schedules[j];
          const val = row[i];
          if (val === 0 && start === null) {
            start = j * 30;
            flag = true;
          } else if (val === 1 && flag) {
            end = (j - 1) * 30;
            generatedEvents.push(createEvent(start, end, i));
            start = null;
            end = null;
            flag = null;
          }
        }
        if (start !== null) {
          end = (schedules.length - 1) * 30;
          generatedEvents.push(createEvent(start, end, i));
        }
      }
      setEvents(generatedEvents);
    };

    // 데이터 값 뽑아서 각각 startTime, endTime, Date1 에 저장
    const createEvent = (start, end, i) => {
      const date = new Date('2023-05-01T00:00:00.000Z');
      const startTime = addMinutes(date, start + 480);
      const endTime = addMinutes(date, end + 480);
      const Date1 = i;
      return {
        startTime: startTime,
        endTime: endTime,
        Date1: Date1,
      };
    };

    handleTimetable(schedules);
  }, [schedules]);

  // 초기화
  const eventsFormatted = events.map((event) => {
    return {
      ...event,
      startTime: event.startTime.toISOString(),
      endTime: event.endTime.toISOString(),
    };
  });

  // 화면에 값 띄우기
  const renderGridItem = ({ item, index }) => {
    const start = moment.utc(item.startTime);
    const starttime = start.format('HH:mm');

    const end = moment.utc(item.endTime);
    const endtime = end.format('HH:mm');

    const Date1 = item.Date1;
    const Date2 = ['월', '화', '수', '목', '금', '토', '일'];
    const viewdate = Date2[Date1];

    const duration = (moment.duration(end.diff(start)).asMinutes() * 16) / 24;
    const topOffset = (start.hour() - 8) * 38 + start.minute();
    const height = duration;
    const width = 44; // 버튼의 너비
    const leftOffset = width * Date1;

    const isSelected = selectedEvents.some((event) => event.index === index);

    return (
      <TouchableOpacity
        style={[
          styles.eventButton,
          { top: topOffset, height: height, width: width, left: leftOffset },
          isSelected ? styles.selectedEventButton : null,
        ]}
        onPress={() => {
          handleEventPress(index);
        }}
      >
        <Text style={styles.eventButtonText}>{viewdate}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timeText}></Text>

        {Array.from(Array(7).keys()).map((day) => (
          <Text key={day} style={styles.dayText}>
            {moment()
              .day(day + 1)
              .format('ddd')}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        <View style={styles.timeColumn}>
          {Array.from(Array(17).keys()).map((hour) => (
            <Text key={hour} style={styles.timeText}>
              {moment()
                .hour(hour + 8)
                .format('HH:00')}
            </Text>
          ))}
        </View>
        <View style={styles.eventGrid}>
          {eventsFormatted.map((event, index) => (
            <React.Fragment key={index}>
              {renderGridItem({ item: event, index: index })}
            </React.Fragment>
          ))}
        </View>
      </View>
      <TouchableOpacity
        style={styles.checkButton}
        onPress={printSelectedEventsInfo}
      >
        <Text style={styles.checkButtonText}>확인</Text>
      </TouchableOpacity>
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
    marginLeft: 4,
    backgroundColor: '#3ad2c4',
    borderRadius: 5,
    padding: 5,
  },
  eventButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedEventButton: {
    backgroundColor: '#0000ff',
  },
  checkButton: {
    marginTop: 16,
    backgroundColor: '#2196f3',
    borderRadius: 4,
    paddingVertical: 12,
  },
  checkButtonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
  },
});
