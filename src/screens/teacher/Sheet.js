import { Modal, Pressable, SafeAreaView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { BookOpenIcon, CpuChipIcon, PencilSquareIcon, PlusCircleIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { theme } from '../../theme';
import { ScrollView } from 'react-native';
// import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, ProgressBar, RadioButton } from 'react-native-paper';
import axios from 'axios';
import { useAuth } from '../../utils/auth';

const Sheet = ({ navigation, route }) => {
  // const navigation = useNavigation();

  const { jsonGlobalData, classId, loading, setLoading } = useAuth();

  const [student, setStudent] = useState();

  useEffect(()=>setStudent(jsonGlobalData),[jsonGlobalData]);

  const [records, setRecords] = useState([]);

  useEffect(()=>{
    setRecords(student?.map((s) => ({ rollNumber: s.rollNumber, is_present: false })));
    calculateAttendance();
  },[student]);

  const [presentCount, setPresentCount] = useState(0);  // Count for present students
  const [absentCount, setAbsentCount] = useState(0);    // Count for absent students

  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  const [otp, setOtp] = useState('');
  const [time, setTime] = useState(0);
  const [finalTime, setFinalTime] = useState(0);

  useEffect(() => {
    socket = new WebSocket('wss://attendancetrackerbackend.onrender.com');
    console.log('Socket from teacher side connected!');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Listen for attendance updates
      if (data.type === 'attendance2') {
        const updatedRollNumber = data.rollNumber;

        setRecords(prevRecords =>
          prevRecords.map(record =>
            record.rollNumber === updatedRollNumber 
              ? { ...record, is_present: true } 
              : record
          )
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

  const handleSetAttendance = async (val) => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);

    try {
      // Await the axios post request to set attendance
      await axios.post('https://attendancetrackerbackend.onrender.com/setAttendance', {
        otp: generatedOtp,
        time: val
      });

      console.log('OTP and time sent to server');
    } catch (error) {
      // Catch any errors and handle them
      console.error('Error sending OTP and time to server:', error);
      alert('Failed to set attendance. Please try again.');
    }
  };

  const handleSetAttendance2 = () => {
    let interval;

    socket.send(JSON.stringify({ type: 'first_call' }));

    interval = setInterval(() => {
      setTime(prev => {
        if (prev <= 0) {
          setModalVisible2(false);
          clearInterval(interval);
          setTime(0);
          setFinalTime(0);

          // Send final time update to WebSocket before closing
          // console.log('Sending final time update:', 0);
          socket.send(JSON.stringify({ type: 'time_update', time: 0 }));
          return 0;
        }

        // Send time updates in real-time via WebSocket
        // console.log('Sending real-time time update:', prev-1);
        socket.send(JSON.stringify({ type: 'time_update', time: prev - 1 }));

        return prev - 1;
      });
    }, 1000);

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
      alert('Error with WebSocket connection');
      clearInterval(interval);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };
  };

  const createAttendance = async () => {
    try {
        setLoading(true);
        console.log(classId, new Date(), records);
        const response = await axios.post('https://attendancetrackerbackend.onrender.com/api/attendance/createAttendance', {
            class_id: classId,
            date: new Date(),
            records: records
        });
        ToastAndroid.show(`Attendance Added Successfully !`, ToastAndroid.LONG);
        console.log('Attendance Added Successful:', response.data);
        navigation.goBack();
        setLoading(false);
    } catch (error) {
    //   ToastAndroid.show(`Login failed: ${error}`, ToastAndroid.LONG);
    console.error(error);
    setLoading(false);
    }
};

  // Calculate present and absent students
  const calculateAttendance = () => {
    const present = records?.filter(record => record.is_present).length;
    const absent = records?.length - present;
    setPresentCount(present);
    setAbsentCount(absent);
  };

// Function to mark all students as present
const markAllPresent = () => {
  setRecords(prevRecords =>
    prevRecords.map(record => ({ ...record, is_present: true }))
  );
};


  // Function to mark all students as absent
  const markAllAbsent = () => {
    setRecords(prevRecords =>
      prevRecords.map(record => ({ ...record, is_present: false }))
    );
  };

  return (
    <SafeAreaView style={{ alignItems: 'center' }} >
      <View className="w-full flex flex-row justify-between items-center p-4 pb-0">
        <TouchableOpacity>
          <XMarkIcon size={wp(8)} color={theme.maincolor} onPress={() => navigation.goBack()} />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>createAttendance()} style={{ backgroundColor: theme.maincolor }} className="flex justify-center items-center rounded-lg p-3 px-5" >
          <Text style={{ color: '#fff', fontSize: wp(3.5), fontWeight: '700' }} >{loading?<ActivityIndicator animating={true} color={'white'} />:'Save'}</Text>
        </TouchableOpacity>
      </View>

      <View className="w-[95%] bg-[#01808c2e] p-2 px-5 rounded-md border-[#01808c7a] border-2 m-4 mb-3 flex flex-row justify-between items-end">
        <View>
          <View className="flex flex-row"><CpuChipIcon size={wp(8)} fill={theme.maincolor} color={theme.maincolor} /><Text className="text-2xl text-[#01808cb9] font-medium ml-1">VLSI</Text></View>
          <Text className="text-gray-600">Chitrakant Sahu</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setModalVisible1(true)
          }}
          className="flex flex-col justify-center items-center bg-[#01808cb9] p-2 px-5 rounded-md border-[#01808c7a] border-2">
          <PencilSquareIcon size={wp(6)} color="white" />
          <Text className="text-white text-[15px] font-medium">Take Attendance</Text>
        </TouchableOpacity>

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
                  <RadioButton.Group onValueChange={value => {
                    setFinalTime(parseInt(value));
                    setTime(parseInt(value));
                    setModalVisible2(true);
                    setModalVisible1(false);
                    handleSetAttendance(parseInt(value));
                    handleSetAttendance2();
                  }}>
                    <RadioButton.Item labelStyle={{ color: "#6a6a6a" }} label="10 Seconds" value="10" />
                    <RadioButton.Item labelStyle={{ color: "#6a6a6a" }} label="20 Seconds" value="20" />
                    <RadioButton.Item labelStyle={{ color: "#6a6a6a" }} label="30 Seconds" value="30" />
                    <RadioButton.Item labelStyle={{ color: "#6a6a6a" }} label="1 Minute" value="60" />
                    <RadioButton.Item labelStyle={{ color: "#6a6a6a" }} label="2 Minutes" value="120" />
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
          <TouchableWithoutFeedback onPress={() => {
            setModalVisible2(false);
            setTime(0);
            setFinalTime(0);
          }}>
            <View className="w-full flex-1 bg-[#00000050] flex justify-center">
              <TouchableWithoutFeedback>

                <View className="bg-white m-[20px] rounded-lg p-[35px] shadow-2xl shadow-black flex items-center gap-y-3">
                  <Text className="text-lg font-bold text-gray-400">OTP : {otp}</Text>
                  <View className="w-full">
                    <Text className="pb-3 text-gray-500">Time Remaining: {time} seconds</Text>
                    <ProgressBar progress={time / finalTime} color={'#01818C'} />
                  </View>
                  <Pressable
                    className="bg-[#01818C] px-2 py-3 w-[100px] rounded-2xl"
                    onPress={() => {
                      setModalVisible2(false);
                      setTime(0);
                      setFinalTime(0);
                    }}>
                    <Text className="text-white text-center font-medium">Cancel</Text>
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
        <Text className="text-sm text-gray-400 ">Total Students : {presentCount + absentCount}</Text>
        <View><Text className="text-sm text-gray-400 text-right">Present : {presentCount}</Text>
          <Text className="text-sm text-gray-400 text-right">Absent : {absentCount}</Text></View>
      </View>

      <View style={{ width: wp(95) }} className="bg-[#01808c2e] p-2 rounded-t-md border-[#01808c7a] border-t-2 border-r-2 border-l-2 ">
        <View className="flex flex-row justify-between">
          <Text className="w-1/4  text-[#7c7c7c] ">Roll Number</Text>
          <Text className="w-1/2 text-[#7c7c7c] text-center">Name</Text>
          <Text className="w-1/4 text-[#7c7c7c] text-right">Attendance</Text>
        </View>
      </View>
      <ScrollView
        scrollEventThrottle={1}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: '#fff', height: hp(62) }}
      >
        <View style={{ width: wp(95) }} className="p-2 rounded-b-md border-[#01808c7a] border-b-2 border-r-2 border-l-2 flex gap-y-3">

          {student&&records?student.map((item, id) => (
            <View className="flex flex-row justify-between" key={id}>
              <Text className={`w-1/4 text-[${theme.maincolor}]`}>{item.rollNumber}</Text>
              <Text className={`w-1/2 text-[${theme.maincolor}]`}>{item.name}</Text>
              <View className="w-1/4 flex flex-row justify-end items-center">
                <Switch
                  thumbColor={records[id]?.is_present ? '#258a4ac4' : '#c41111c4'}
                  trackColor={{ false: '#ffaaaac4', true: '#8bdca8c4' }}
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
                  value={records[id]?.is_present} />
                <Text className={`text-gray-400 font-semibold`}>{records[id]?.is_present ? 'P' : 'A'}</Text>
              </View>
            </View>
          )):<Text>Student Data is Empty !</Text>}

        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default Sheet;

const styles = StyleSheet.create({
  // Add any custom styles if needed
});