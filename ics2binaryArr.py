# ICS 파일을 텍스트 형식으로 열어서 읽기
# 파일의 내용을 한 줄씩 읽으면서 이벤트 데이터를 추출
def ics_to_binary_array(file_path):
    with open(file_path, 'r', encoding='utf=8') as file:
        lines = file.readlines()

    events = []
    event_data = []
    for line in lines:
        if line.startswith('BEGIN:VEVENT'):
            event_data=[]
        elif line.startswith('END:VEVENT'):
            events.append(event_data)
        elif (line.startswith('DTSTART') or 
            line.startswith('DTEND') or
            line.startswith('RRULE') or 
            line.startswith('SUMMARY')):
            event_data.append(line)
    
    for event in events:
        for i in range(0, len(event)):
            slice_start = event[i].find(':') + 1
            slice_end = event[i].find('\n')
            event[i] = event[i][slice_start:slice_end]
            if 'FREQ' in event[i]: idx = i
        if(event[idx].find(';') != -1):
                temp = event[idx].split(';')
                event.remove(event[idx])
                event.insert(idx, temp[1])
                event.insert(idx, temp[0])

    for event in events:
        print(event)
    return events

# 사용 예시
ics_file_path = 'skatkdddnjs1@gmail.com.ics'
binary_array = ics_to_binary_array(ics_file_path)
