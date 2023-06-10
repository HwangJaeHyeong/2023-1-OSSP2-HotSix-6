import { B_SERVER_URL } from '@constants/baseUrl'
import axios from 'axios'
import * as DocumentPicker from 'expo-document-picker'
import { useState } from 'react'
import { Alert, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const InsertIcsScreen = () => {
  const [selectedFile, setSelectedFile] = useState(null)

  //파일 선택
  const handleFileSelection = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'text/calendar', // ICS 파일
        copyToCacheDirectory: false,
        multiple: false,
      })

      if (res.type === 'success') {
        setSelectedFile(res)
      } else {
        console.log('파일 형식이 맞지 않습니다. .ics파일을 등록해주세요')
      }
    } catch (error) {
      console.log(error)
    }
  }

  //파일 업로드
  const handleUpload = async () => {
    if (selectedFile) {
      try {
        const fileUri = selectedFile.uri
        const formData = new FormData()
        formData.append('file', {
          uri: fileUri,
          name: selectedFile.name,
          type: 'text/calendar',
        })

        const response = await axios.post(`${B_SERVER_URL}/user/img-time-table`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        console.log(response.data)

        Alert.alert('파일 전송 성공', '파일이 서버로 전송되었습니다.')
      } catch (error) {
        console.log(error)
        Alert.alert('파일 전송 실패', '파일을 서버로 전송하는 데 실패했습니다.')
      }
    }
  }

  return (
    <ImageBackground source={require('assets/images/background_img_2.png')} style={styles.container}>
      <Text style={styles.Text}>캘린더파일로</Text>
      <Text style={styles.loginButtonText}> 내 시간표를 등록해보세요! </Text>
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          {selectedFile ? (
            <MaterialCommunityIcons name="file-check-outline" style={styles.icon} />
          ) : (
            <MaterialCommunityIcons name="file-plus-outline" style={styles.icon} />
          )}
          {selectedFile && <Text>{selectedFile.name}</Text>}
          <TouchableOpacity onPress={handleFileSelection} style={styles.button}>
            <Text style={styles.buttonText}>.ics 파일 선택</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
          <Text style={styles.buttonText}>업로드</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 300,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dotted',
    borderWidth: 3,
    borderColor: 'gray',
  },
  icon: {
    fontSize: 90,
    color: 'gray',
    marginBottom: 10,
  },
  uploadButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#3679A4',
    borderRadius: 5,
    width: 300,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#3679A4',
    borderRadius: 5,
    marginTop: 10,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 25,
    marginBottom: 20,
  },
  Text: {
    color: '#ffffff',
    fontSize: 25,
  },
})
export default InsertIcsScreen
