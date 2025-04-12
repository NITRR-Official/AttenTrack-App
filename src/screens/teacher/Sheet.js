import {
  ScrollView,
  Alert,
  Modal,
  PermissionsAndroid,
  Pressable,
  SafeAreaView,
  Switch,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState, useMemo} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  CpuChipIcon,
  PencilSquareIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';
import {theme} from '../../theme';
import {ActivityIndicator, ProgressBar, RadioButton} from 'react-native-paper';
import axios from 'axios';
import {useAuth} from '../../utils/auth';
import GetLocation from 'react-native-get-location';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import {BASE_URL} from '../../constants/constants';

import PropTypes from 'prop-types';

const Sheet = ({navigation, route}) => {
  const {loading, setLoading} = useAuth();
  const [lag, setLag] = useState(false);

  const [student, setStudent] = useState();
  const socket = useMemo(
    () => new WebSocket('wss://attendancetrackerbackend.onrender.com'),
    [],
  );

  useEffect(() => setStudent(route.params.jsonGlobalData), []);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (student) {
      setRecords(
        student.map(s => ({rollNumber: s.rollNumber, is_present: false})),
      );
    }
  }, [student]);

  useEffect(() => {
    if (records && records.length > 0) {
      calculateAttendance();
    }
  }, [records]);

  // Calculate present and absent students
  const calculateAttendance = () => {
    if (records && records.length > 0) {
      const present = records.filter(record => record.is_present).length;
      const absent = records.length - present;
      setPresentCount(present);
      setAbsentCount(absent);
    } else {
      setPresentCount(0);
      setAbsentCount(0);
    }
  };

  const [presentCount, setPresentCount] = useState(0); // Count for present students
  const [absentCount, setAbsentCount] = useState(0); // Count for absent students

  const [modalVisible0, setModalVisible0] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  const [otp, setOtp] = useState('');
  const [time, setTime] = useState(0);
  const [finalTime, setFinalTime] = useState(0);

  const updateRecordAttendance = (prevRecords, updatedRollNumber) => {
    return prevRecords.map(record =>
      record.rollNumber === updatedRollNumber
        ? {...record, is_present: true}
        : record,
    );
  };

  useEffect(() => {
    console.log('Socket from teacher side connected!');

    socket.onmessage = event => {
      const data = JSON.parse(event.data);

      // Listen for attendance updates
      if (data.type === 'attendance2') {
        const updatedRollNumber = data.rollNumber;

        setRecords(prevRecords =>
          updateRecordAttendance(prevRecords, updatedRollNumber),
        );

        // Increment the present count
        setPresentCount(prevCount => prevCount + 1);
      }
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  const handleSetAttendance = async val => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);

    try {
      await axios.post(`${BASE_URL}/setAttendance`, {
        otp: generatedOtp,
        time: val,
      });
    } catch (error) {
      console.error('Error sending OTP and time to server:', error);
      ToastAndroid.show(
        'Failed to set attendance. Please try again.',
        ToastAndroid.LONG,
      );
    }
  };

  const handleSetAttendance2 = () => {
    let interval;

    socket.send(JSON.stringify({type: 'first_call'}));

    interval = setInterval(() => {
      setTime(prev => {
        if (prev <= 0) {
          setModalVisible2(false);
          clearInterval(interval);
          setTime(0);
          setFinalTime(0);

          // Send final time update to WebSocket before closing
          // console.log('Sending final time update:', 0);
          socket.send(JSON.stringify({type: 'time_update', time: 0}));
          return 0;
        }

        // Send time updates in real-time via WebSocket
        // console.log('Sending real-time time update:', prev-1);
        socket.send(JSON.stringify({type: 'time_update', time: prev - 1}));

        return prev - 1;
      });
    }, 1000);

    socket.onerror = error => {
      console.log('WebSocket Error:', error);
      ToastAndroid.show('Error with WebSocket connection', ToastAndroid.LONG);
      clearInterval(interval);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };
  };

  const createAttendance = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/api/attendance/createAttendance`,
        {
          class_id: route.params.id,
          date: new Date(),
          records: Object.fromEntries(
            records.map(item => [item.rollNumber, item.is_present]),
          ),
        },
      );

      ToastAndroid.show(`Attendance Added Successfully !`, ToastAndroid.LONG);
      console.log('Attendance Added Successful:', response.data);
      downloadReport();
      navigation.goBack();
      setLoading(false);
    } catch (error) {
      ToastAndroid.show(`Something went wrong`, ToastAndroid.LONG);
      console.error(error);
      setLoading(false);
    }
  };

  // Function to mark all students as present
  const markAllPresent = () => {
    setRecords(prevRecords =>
      prevRecords.map(record => ({...record, is_present: true})),
    );
  };

  // Function to mark all students as absent
  const markAllAbsent = () => {
    setRecords(prevRecords =>
      prevRecords.map(record => ({...record, is_present: false})),
    );
  };

  const requestLocationPermission = async range => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can access location');
          getCurrentLocation(range); // Call your function to get the location
        } else {
          console.log('Location permission denied');
          setLag(false);
          ToastAndroid.show('Location permission denied !', ToastAndroid.LONG);
        }
      } catch (err) {
        console.warn(err);
        setLag(false)
      }
    }
  };

  const getCurrentLocation = range => {
    GetLocation.getCurrentPosition({enableHighAccuracy: true, timeout: 60000})
      .then(location => {
        socket.send(
          JSON.stringify({
            type: 'teacherLoc',
            location: location,
            range,
          }),
        );
        setModalVisible0(false);
        setModalVisible1(true);
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      })
      .finally(() => {
        setLag(false);
      });
  };

  const generateHTML = () => {
    if (!records) return '';

    // Main styles for the PDF
    let html = `
    <h1>${new Date().toISOString().split('T')[0]} : Attendance Report</h1>
    <table border="1" style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="padding: 8px;">Roll Number</th>
          <th style="padding: 8px;">Name</th>
          <th style="padding: 8px;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${records
          .map(
            record => `
          <tr>
            <td style="padding: 8px;">${record.rollNumber}</td>
            <td style="padding: 8px;">${
              student?.find(s => s.rollNumber === record.rollNumber)?.name ||
              'N/A'
            }</td>
            <td style="padding: 8px;">${
              record.is_present ? 'Present' : 'Absent'
            }</td>
          </tr>
        `,
          )
          .join('')}
      </tbody>
    </table>
  `;

    return html;
  };

  // Function to generate and download the PDF
  const downloadReport = async () => {
    const options = {
      html: generateHTML(),
      fileName: `${new Date().toISOString().split('T')[0]}_Attendance_Report`,
      directory: 'Download',
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      const newPath = `${RNFS.DownloadDirectoryPath}/${
        new Date().toISOString().split('T')[0]
      }_Attendance_Report.pdf`;

      // Move file to download directory
      await RNFS.moveFile(file.filePath, newPath);

      Alert.alert(
        'Report Downloaded',
        `The report has been moved to: ${newPath}`,
      );
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Failed to download the report.', ToastAndroid.LONG);
    }
  };

  return (
    <SafeAreaView style={{alignItems: 'center'}}>
      <View className="w-full flex flex-row justify-between items-center p-4 pb-0">
        <TouchableOpacity>
          <XMarkIcon
            size={wp(8)}
            color={theme.maincolor}
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => createAttendance()}
          style={{backgroundColor: theme.maincolor}}
          className="flex justify-center items-center rounded-lg p-3 px-5">
          <Text style={{color: '#fff', fontSize: wp(3.5), fontWeight: '700'}}>
            {loading ? (
              <ActivityIndicator animating={true} color={'white'} />
            ) : (
              'Save'
            )}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="w-[95%] bg-[#01808c2e] p-2 px-3 rounded-md border-[#01808c7a] border-2 m-4 mb-3 flex flex-row justify-between items-end">
        <View>
          <View className="flex flex-row flex-wrap">
            <CpuChipIcon
              size={wp(8)}
              fill={theme.maincolor}
              color={theme.maincolor}
            />
            <Text className="text-2xl text-[#01808cb9] font-medium ml-1">
              {route.params.classname.length > 10
                ? route.params.classname.substring(0, 10) + '...'
                : route.params.classname}
            </Text>
          </View>
          <Text className="text-gray-600">
            {route.params.teacherName.length > 25
              ? route.params.teacherName.substring(0, 25) + '...'
              : route.params.teacherName}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setModalVisible0(true);
          }}
          className="flex flex-col justify-center items-center bg-[#01808cb9] p-2 rounded-md border-[#01808c7a] border-2">
          <PencilSquareIcon size={wp(6)} color="white" />
          <Text className="text-white text-[15px] font-medium">
            Take Attendance
          </Text>
        </TouchableOpacity>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible0}
          onRequestClose={() => {
            setModalVisible0(!modalVisible0);
          }}>

          {lag && (
            <View className="z-20 w-full p-2 top-[40%] absolute ">
              <ActivityIndicator
                animating={true}
                color={'#01808c7a'}
                size={wp(10)}
              />
            </View>
          )}

          <TouchableWithoutFeedback onPress={() => setModalVisible0(false)}>
            <View className="w-full flex-1 bg-[#00000050] flex justify-center">
              <TouchableWithoutFeedback>
                <View className="bg-white m-[20px] rounded-lg p-[35px] shadow-2xl shadow-black flex items-center gap-y-3">
                  <Text className="text-black">Select Range :</Text>
                  <RadioButton.Group
                    onValueChange={value => {
                      setLag(true);
                      requestLocationPermission(parseInt(value));
                    }}>
                    <RadioButton.Item
                      labelStyle={{color: '#6a6a6a'}}
                      label="10m"
                      value="10"
                      disabled={lag}
                    />
                    <RadioButton.Item
                      labelStyle={{color: '#6a6a6a'}}
                      label="20m"
                      value="20"
                        disabled={lag}
                    />
                    <RadioButton.Item
                      labelStyle={{color: '#6a6a6a'}}
                      label="30m"
                      value="30"
                        disabled={lag}
                    />
                    <RadioButton.Item
                      labelStyle={{color: '#6a6a6a'}}
                      label="40m"
                      value="40"
                        disabled={lag}
                    />
                    <RadioButton.Item
                      labelStyle={{color: '#6a6a6a'}}
                      label="50m"
                      value="50"
                        disabled={lag}
                    />
                    <RadioButton.Item
                      labelStyle={{color: '#6a6a6a'}}
                      label="100m"
                      value="100"
                        disabled={lag}
                    />
                    <RadioButton.Item
                      labelStyle={{color: '#6a6a6a'}}
                      label="200m"
                      value="200"
                        disabled={lag}
                    />
                    <RadioButton.Item
                      labelStyle={{color: '#6a6a6a'}}
                      label="500m"
                      value="500"
                        disabled={lag}
                    />
                    <RadioButton.Item
                      labelStyle={{color: '#6a6a6a'}}
                      label="1000m"
                      value="1000"
                        disabled={lag}
                    />
                  </RadioButton.Group>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible1}
          onRequestClose={() => {
            setModalVisible1(!modalVisible1);
          }}>
          <TouchableWithoutFeedback onPress={() => setModalVisible1(false)}>
            <View className="w-full flex-1 bg-[#00000050] flex justify-center">
              <TouchableWithoutFeedback>
                <View className="bg-white m-[20px] rounded-lg p-[35px] shadow-2xl shadow-black flex items-center gap-y-3">
                  <RadioButton.Group
                    onValueChange={value => {
                      setFinalTime(parseInt(value));
                      setTime(parseInt(value));
                      setModalVisible2(true);
                      setModalVisible1(false);
                      handleSetAttendance(parseInt(value));
                      handleSetAttendance2();
                    }}>
                    <RadioButton.Item
                      labelStyle={{color: '#6a6a6a'}}
                      label="10 Seconds"
                      value="10"
                    />
                    <RadioButton.Item
                      labelStyle={{color: '#6a6a6a'}}
                      label="20 Seconds"
                      value="20"
                    />
                    <RadioButton.Item
                      labelStyle={{color: '#6a6a6a'}}
                      label="30 Seconds"
                      value="30"
                    />
                    <RadioButton.Item
                      labelStyle={{color: '#6a6a6a'}}
                      label="1 Minute"
                      value="60"
                    />
                    <RadioButton.Item
                      labelStyle={{color: '#6a6a6a'}}
                      label="2 Minutes"
                      value="120"
                    />
                  </RadioButton.Group>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible2}
          onRequestClose={() => {
            setModalVisible2(!modalVisible2);
            setTime(0);
            setFinalTime(0);
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              setModalVisible2(false);
              setTime(0);
              setFinalTime(0);
            }}>
            <View className="w-full flex-1 bg-[#00000050] flex justify-center">
              <TouchableWithoutFeedback>
                <View className="bg-white m-[20px] rounded-lg p-[35px] shadow-2xl shadow-black flex items-center gap-y-3">
                  <Text className="text-lg font-bold text-gray-400">
                    OTP : {otp}
                  </Text>
                  <View className="w-full">
                    <Text className="pb-3 text-gray-500">
                      Time Remaining: {time} seconds
                    </Text>
                    <ProgressBar
                      progress={time / finalTime}
                      color={'#01818C'}
                    />
                  </View>
                  <Pressable
                    className="bg-[#01818C] px-2 py-3 w-[100px] rounded-2xl"
                    onPress={() => {
                      setModalVisible2(false);
                      setTime(0);
                      setFinalTime(0);
                    }}>
                    <Text className="text-white text-center font-medium">
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>

      {/* Add buttons for marking all present/absent */}
      <View className="flex flex-row justify-between w-full mb-3 px-3">
        <TouchableOpacity
          onPress={markAllPresent}
          className="flex-1 bg-[#258a4ac4] py-2 rounded-md mr-4 items-center">
          <Text className="text-white font-semibold">Mark All Present</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={markAllAbsent}
          className="flex-1 bg-[#c41111c4] py-2 rounded-md ml-4 items-center">
          <Text className="text-white font-semibold">Mark All Absent</Text>
        </TouchableOpacity>
      </View>

      {/* Display present and absent count */}
      <View className="w-full flex flex-row justify-between px-4 mb-2">
        <Text className="text-sm text-gray-400 ">
          Total Students : {presentCount + absentCount}
        </Text>
        <View>
          <Text className="text-sm text-gray-400 text-right">
            Present : {presentCount}
          </Text>
          <Text className="text-sm text-gray-400 text-right">
            Absent : {absentCount}
          </Text>
        </View>
      </View>

      <View
        style={{width: wp(95)}}
        className="bg-[#01808c2e] p-2 rounded-t-md border-[#01808c7a] border-t-2 border-r-2 border-l-2 ">
        <View className="flex flex-row justify-between">
          <Text className="w-1/4  text-[#7c7c7c] ">Roll Number</Text>
          <Text className="w-1/2 text-[#7c7c7c] text-center">Name</Text>
          <Text className="w-1/4 text-[#7c7c7c] text-right">Attendance</Text>
        </View>
      </View>
      <ScrollView
        scrollEventThrottle={1}
        contentContainerStyle={{flexGrow: 1}}
        style={{backgroundColor: '#fff', height: hp(60)}}
        className="border-b-2 border-[#01808c7a] rounded-b-md">
        <View
          style={{width: wp(95)}}
          className="p-2 rounded-b-md border-[#01808c7a] border-b-2 border-r-2 border-l-2 flex gap-y-3">
          {student && records ? (
            student.map((item, id) => (
              <View
                className="flex flex-row justify-between"
                key={item.rollNumber}>
                <Text className={`w-1/4 text-[${theme.maincolor}]`}>
                  {item.rollNumber}
                </Text>
                <Text className={`w-1/2 text-[${theme.maincolor}]`}>
                  {item.name}
                </Text>
                <View className="w-1/4 flex flex-row justify-end items-center">
                  <Switch
                    thumbColor={
                      records[id]?.is_present ? '#258a4ac4' : '#c41111c4'
                    }
                    trackColor={{false: '#ffaaaac4', true: '#8bdca8c4'}}
                    onValueChange={() => {
                      setRecords(prevRecords => {
                        if (id >= prevRecords.length) return prevRecords; // Prevents out-of-range access

                        // Ensure you're not mutating the original state
                        const updatedRecords = [...prevRecords];
                        updatedRecords[id] = {
                          ...updatedRecords[id],
                          is_present: !updatedRecords[id].is_present,
                        };
                        return updatedRecords;
                      });
                    }}
                    value={records[id]?.is_present}
                  />
                  <Text className={`text-gray-400 font-semibold`}>
                    {records[id]?.is_present ? 'P' : 'A'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text>Student Data is Empty !</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

Sheet.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

export default Sheet;
