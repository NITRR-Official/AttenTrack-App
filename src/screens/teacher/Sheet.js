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
import { ProgressBar, RadioButton } from 'react-native-paper';
import { studentsData } from './studentsData';
import axios from 'axios';

const Sheet = ({ navigation, route }) => {
  // const navigation = useNavigation();

  const [student, setStudent] = useState(studentsData);
  const [presentCount, setPresentCount] = useState(0);  // Count for present students
  const [absentCount, setAbsentCount] = useState(0);    // Count for absent students

  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [progress, setProgress] = useState(0);

  const [otp, setOtp] = useState('');
  const [time, setTime] = useState(10);

  const handleSetAttendance = async () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);
  
    try {
      // Await the axios post request to set attendance
      await axios.post('https://attendancetrackerbackend.onrender.com/setAttendance', {
        otp: generatedOtp,
        time: time
      });
      
      console.log('OTP and time sent to server');
    } catch (error) {
      // Catch any errors and handle them
      console.error('Error sending OTP and time to server:', error);
      alert('Failed to set attendance. Please try again.');
    }
  };   

  const [ws, setWs] = useState(null);

  // console.log('given route in sheet', route.params);

  // const student = route.params.data;

  // console.log('given student in sheet', student);

  useEffect(() => {
    // Set up WebSocket connection
    const socket = new WebSocket('wss://attendancetrackerbackend.onrender.com');
    setWs(socket);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Listen for attendance updates
      if (data.type === 'attendance_update') {
        const updatedRollNumber = data.rollNumber;

        // Update the student's attendance status in real time
        setStudent(prevStudents =>
          prevStudents.map(student =>
            student.rollNumber === updatedRollNumber
              ? { ...student, attendance: true }
              : student
          )
        );

        console.log(student[6].attendance)
        console.log(student[7].attendance)
        console.log(student[8].attendance)

        // Increment the present count
        setPresentCount(prevCount => prevCount + 1);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  // Calculate present and absent students
  const calculateAttendance = () => {
    const present = student.filter(item => item.attendance).length;
    const absent = student.length - present;
    setPresentCount(present);
    setAbsentCount(absent);
  };

  // Function to mark all students as present
  const markAllPresent = () => {
    setStudent(prevStudents =>
      prevStudents.map(student => ({ ...student, attendance: true }))
    );
  };

  // Function to mark all students as absent
  const markAllAbsent = () => {
    setStudent(prevStudents =>
      prevStudents.map(student => ({ ...student, attendance: false }))
    );
  };

  // Calculate the attendance when the component mounts or student list changes
  useEffect(() => {
    calculateAttendance();
  }, [student]);

  return (
    <SafeAreaView style={{ alignItems: 'center' }} >
      <View className="w-full flex flex-row justify-between items-center p-4 pb-0">
        <TouchableOpacity>
          <XMarkIcon size={wp(8)} color={theme.maincolor} onPress={() => navigation.goBack()} />
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: theme.maincolor }} className="flex justify-center items-center rounded-lg p-3 px-5" >
          <Text style={{ color: '#fff', fontSize: wp(3.5), fontWeight: '700' }} >Save</Text>
        </TouchableOpacity>
      </View>

      <View className="w-[95%] bg-[#01808c2e] p-2 px-5 rounded-md border-[#01808c7a] border-2 m-4 mb-3 flex flex-row justify-between items-end">
        <View>
          <View className="flex flex-row"><CpuChipIcon size={wp(8)} fill={theme.maincolor} color={theme.maincolor} /><Text className="text-2xl text-[#01808cb9] font-medium ml-1">VLSI</Text></View>
          <Text className="text-gray-600">Chitrakant Sahu</Text>
        </View>
        <TouchableOpacity
          onPress={()=>{
            handleSetAttendance();
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
                    setTime(parseInt(value));
                    setModalVisible2(true);
                    setModalVisible1(false);
                  }}>
                    <RadioButton.Item label="10 Seconds" value="10" />
                    <RadioButton.Item label="20 Seconds" value="20" />
                    <RadioButton.Item label="30 Seconds" value="30" />
                    <RadioButton.Item label="1 Minute" value="60" />
                    <RadioButton.Item label="2 Minutes" value="120" />
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
          }}>
          <TouchableWithoutFeedback onPress={() => setModalVisible2(false)}>
            <View className="w-full flex-1 bg-[#00000050] flex justify-center">
              <TouchableWithoutFeedback>

                <View className="bg-white m-[20px] rounded-lg p-[35px] shadow-2xl shadow-black flex items-center gap-y-3">
                  <Text className="text-lg font-bold">OTP : {otp}</Text>
                  <View className="w-full">
                    <Text className="pb-3">Time Remaining: {Math.max(Math.floor((1 - progress) * time), 0)} seconds</Text>
                    <ProgressBar progress={1 - progress} color={'#01818C'} />
                  </View>
                  <Pressable
                    className="bg-[#01818C] px-2 py-3 w-[100px] rounded-2xl"
                    onPress={() => setModalVisible2(false)}>
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
        <Text className="text-sm ">Total Students : {presentCount + absentCount}</Text>
        <View><Text className="text-sm text-right">Present : {presentCount}</Text>
          <Text className="text-sm text-right">Absent : {absentCount}</Text></View>
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

          {student.map((item, id) => (
            <View className="flex flex-row justify-between" key={id}>
              <Text className={`w-1/4 text-[${theme.maincolor}]`}>{item.rollNumber}</Text>
              <Text className={`w-1/2 text-[${theme.maincolor}]`}>{item.name}</Text>
              <View className="w-1/4 flex flex-row justify-end items-center">
                <Switch
                  thumbColor={item.attendance ? '#258a4ac4' : '#c41111c4'}
                  onValueChange={() => {
                    setStudent(prevStudents =>
                      prevStudents.map((student, idx) =>
                        id === idx
                          ? { ...student, attendance: !student.attendance }
                          : student
                      )
                    );
                  }}
                  value={item.attendance} />
                <Text className={`text-${item.attendance ? '[#258a4a]' : '[#c41111]'} font-semibold`}>{item.attendance ? 'P' : 'A'}</Text>
              </View>
            </View>
          ))}

        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default Sheet;

const styles = StyleSheet.create({
  // Add any custom styles if needed
});