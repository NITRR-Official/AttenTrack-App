import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import {ArrowUpTrayIcon, XMarkIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {theme} from '../../theme';
import Papa from 'papaparse';
import DocumentPicker from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import {useAuth} from '../../utils/auth';
import axios from 'axios';
import {BASE_URL} from '../../constants/constants';
const CreateClass = () => {
  const navigation = useNavigation();

  const [classname, setClassname] = useState('');
  const [batch, setBatch] = useState('');
  const [semester, setSemester] = useState('');
  const [jsonLocalData, setJsonLocalData] = useState([]);
  const [students, setStudents] = useState([]);
  const {
    setClasses,
    departmentG,
    teacheridG,
    loading,
    setLoading,
    setRefreshing,
  } = useAuth();

  const handleOnFileLoad = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const fileUri = res[0].uri;
      let fileContent;

      if (Platform.OS === 'ios') {
        const destPath = `${RNFS.TemporaryDirectoryPath}/${res[0].name}`;
        await RNFS.copyFile(res[0].uri, destPath);
        fileContent = await RNFS.readFile(destPath, 'utf8');
      } else {
        fileContent = await RNFS.readFile(fileUri, 'utf8');
      }

      parseCSV(fileContent);
    } catch (err) {
      ToastAndroid.show('Error reading file', ToastAndroid.LONG);
      console.error('File error:', err);
    }
  };

  const parseCSV = csvData => {
    try {
      const result = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
      });

      if (result.errors.length > 0) {
        throw new Error('Error parsing CSV');
      }

      const transformedData = result.data.map(item => ({
        rollNumber: item.ROLLNO?.toString() || '',
        fullName: item.STUDNAME?.toString() || '',
        email: item.EMAIL?.toString() || '',
      }));

      setStudents(transformedData);
      setJsonLocalData(result.data);
      ToastAndroid.show(
        `${transformedData.length} students loaded`,
        ToastAndroid.SHORT,
      );
    } catch (error) {
      ToastAndroid.show('Invalid CSV format', ToastAndroid.LONG);
      console.error('Parse error:', error, jsonLocalData);
    }
  };

  const validateForm = () => {
    if (!classname.trim()) {
      ToastAndroid.show('Class name is required', ToastAndroid.LONG);
      return false;
    }

    if (!batch.trim()) {
      ToastAndroid.show('Batch is required', ToastAndroid.LONG);
      return false;
    }

    if (!semester.trim()) {
      ToastAndroid.show('Semester is required', ToastAndroid.LONG);
      return false;
    }

    if (!departmentG) {
      ToastAndroid.show('Department is required', ToastAndroid.LONG);
      return false;
    }

    if (students.length === 0) {
      ToastAndroid.show('Please upload student list', ToastAndroid.LONG);
      return false;
    }

    const invalidStudents = students.some(
      student =>
        !student.email.trim() ||
        !student.fullName.trim() ||
        !student.rollNumber.trim(),
    );

    if (invalidStudents) {
      ToastAndroid.show(
        'All students must have valid email, name and roll number',
        ToastAndroid.LONG,
      );
      return false;
    }

    return true;
  };

  const createClass = async () => {
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        classname: classname.trim(),
        batch: batch.trim(),
        semester: semester.trim(),
        department: departmentG,
        teacherid: teacheridG,
        students: students.map(student => ({
          email: student.email.trim(),
          fullName: student.fullName.trim(),
          rollNumber: student.rollNumber.trim(),
        })),
      };

      console.log('Sending payload:', payload);

      const response = await axios.post(
        `${BASE_URL}/api/class/create-class`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      ToastAndroid.show('Class Added Successfully!', ToastAndroid.LONG);
      setClasses(prevClasses => [
        ...prevClasses,
        {id: response.data._id, classname},
      ]);
      setRefreshing(true);
      navigation.goBack();
    } catch (error) {
      console.error('Error creating class:', error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to create class';
      ToastAndroid.show(`Error: ${errorMessage}`, ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <XMarkIcon size={wp(8)} color={theme.maincolor} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            createClass();
          }}
          style={styles.saveButton}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator animating={true} color={'white'} />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <View contentContainerStyle={styles.formContainer}>
        <TextInput
          placeholder="Class Name"
          placeholderTextColor="#909090"
          onChangeText={setClassname}
          value={classname}
          style={styles.input}
        />

        <TextInput
          placeholder="Semester"
          placeholderTextColor="#909090"
          onChangeText={setSemester}
          value={semester}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Batch"
          placeholderTextColor="#909090"
          onChangeText={setBatch}
          value={batch}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Department"
          placeholderTextColor="#909090"
          value={departmentG}
          editable={false}
          style={styles.input}
        />

        <TouchableOpacity
          onPress={handleOnFileLoad}
          style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload Student List</Text>
          <ArrowUpTrayIcon size={wp(8)} color="#fff" />
        </TouchableOpacity>

        {students.length > 0 && (
          <>
            <View style={styles.studentHeader}>
              <Text style={styles.headerText}>Roll No</Text>
              <Text style={styles.headerText}>Name</Text>
              <Text style={styles.headerText}>Email</Text>
            </View>

            <ScrollView style={styles.studentList}>
              {students.map((student, index) => (
                <View key={student} style={styles.studentRow}>
                  <Text style={styles.studentText}>{student.rollNumber}</Text>
                  <Text style={styles.studentText}>{student.fullName}</Text>
                  <Text style={styles.studentText} numberOfLines={1}>
                    {student.email}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    width: '100%',
    height: hp(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(8),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  saveButton: {
    backgroundColor: theme.maincolor,
    width: wp(18),
    height: wp(10),
    borderRadius: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: '700',
  },
  formContainer: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(5),
  },
  input: {
    borderWidth: 1,
    borderColor: theme.maincolor,
    width: '100%',
    height: hp(5.5),
    borderRadius: wp(2),
    paddingHorizontal: wp(4),
    marginTop: wp(4),
    color: theme.maincolor,
    fontSize: wp(4),
    fontWeight: '500',
  },
  uploadButton: {
    height: hp(7),
    width: '100%',
    backgroundColor: theme.maincolor,
    borderRadius: wp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: wp(8),
    paddingHorizontal: wp(4),
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: '400',
  },
  studentHeader: {
    marginTop: wp(4),
    backgroundColor: theme.maincolor,
    paddingHorizontal: wp(4),
    width: '100%',
    height: hp(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: wp(2),
  },
  headerText: {
    fontWeight: '700',
    fontSize: wp(3.5),
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  studentList: {
    backgroundColor: '#f5f5f5',
    width: '100%',
    maxHeight: hp(40),
    marginTop: wp(2),
    borderRadius: wp(2),
  },
  studentRow: {
    borderWidth: 1,
    borderColor: theme.maincolor,
    marginTop: wp(2),
    backgroundColor: '#fff',
    borderRadius: wp(2),
    paddingHorizontal: wp(4),
    width: '100%',
    height: hp(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentText: {
    fontSize: wp(3.5),
    color: theme.maincolor,
    flex: 1,
    textAlign: 'center',
  },
});

export default CreateClass;
