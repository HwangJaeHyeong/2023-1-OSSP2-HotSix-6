const GroupNoticeCreationScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const createNotice = () => {
    axios.post('http://192.168.0.120:3001/notices', { title, content })
      .then(response => {
        setTitle('');
        setContent('');
        navigation.goBack(); // 작성 완료 후 이전 화면으로 돌아감
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="제목"
          value={title}
          onChangeText={text => setTitle(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="내용"
          value={content}
          onChangeText={text => setContent(text)}
        />
        <Button title="작성" onPress={createNotice} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  noticeTitle: {
    fontSize: 16,
  },
  noticeContent: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 8,
  },
});

export { GroupNoticeScreen, GroupNoticeCreationScreen };