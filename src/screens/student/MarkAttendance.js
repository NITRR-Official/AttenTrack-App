import { Modal, Pressable, SafeAreaView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { BookOpenIcon, CpuChipIcon, PencilSquareIcon, PlusCircleIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { theme } from '../../theme';
import { ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, ProgressBar, RadioButton } from 'react-native-paper';
import {attendanceData} from './attendanceData'

const MarkAttendance = () => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState('');
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  const [receivedOtp, setReceivedOtp] = useState(null);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(0);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Set up WebSocket connection
    const socket = new WebSocket('wss://attendancetrackerbackend.onrender.com');
    setWs(socket);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'otp') {
        setReceivedOtp(data.otp);
        console.log('OTP received:', data.otp);
      }else if (data.type === 'progress_update') {
        setProgress(data.progress);
        setTime(data.time);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleOtpSubmit = () => {
    if (ws) {
      ws.send(JSON.stringify({ type: 'otp_verification', otp }));
    }
  };

  useEffect(() => {
    let interval;
    if (modalVisible1) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 1) {
            setModalVisible1(false);
            clearInterval(interval);
            return 1;
          }
          return Math.min(prev + 1 / time, 1);
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [modalVisible1]);

  useEffect(() => {
    let interval;
    if (modalVisible2) {
      interval = setTimeout(() => {
        setModalVisible2(false);
      }, 3000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [modalVisible2]);

  const [presentDays, setPresentDays] = useState(0);
  const [absentDays, setAbsentDays] = useState(0);

  useEffect(() => {
    calculateAttendance();
  }, [attendanceData]);

  const calculateAttendance = () => {
    let present = 0;
    let absent = 0;

    attendanceData.forEach((record) => {
      if (record.attendance) {
        present++;
      } else {
        absent++;
      }
    });

    setPresentDays(present);
    setAbsentDays(absent);
  };

  return (
    <SafeAreaView style={{ alignItems: 'center' }} >
      <View className="w-full flex flex-row justify-between items-center p-4 pb-0">
        <TouchableOpacity>
          <XMarkIcon size={wp(8)} color={theme.maincolor} onPress={() => navigation.goBack()} />
        </TouchableOpacity>
      </View>

      <View className="w-[95%] bg-[#01808c2e] p-2 px-5 rounded-md border-[#01808c7a] border-2 m-4 mb-3 flex flex-row justify-between items-end">
        <View>
          <View className="flex flex-row"><CpuChipIcon size={wp(8)} fill={theme.maincolor} color={theme.maincolor} /><Text className="text-2xl text-[#01808cb9] font-medium ml-1">VLSI</Text></View>
          <Text className="text-gray-600">Chitrakant Sahu</Text>
        </View>
        <TouchableOpacity
          onPress={() => setModalVisible1(true)}
          className="flex flex-col justify-center items-center bg-[#01808cb9] p-2 px-5 rounded-md border-[#01808c7a] border-2">
          <PencilSquareIcon size={wp(6)} color="white" />
          <Text className="text-white text-[15px] font-medium">Mark Attendance</Text>
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
                  <Text>Enter OTP :</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, width: '90%' }}>
                    <TextInput
                      onChangeText={setOtp}
                      value={otp}
                      placeholder="Enter OTP..."
                      style={{ flex: 1, paddingLeft: 10, height: 40, color: 'gray' }}
                      secureTextEntry={true}
                    />
                  </View>
                  <Pressable
                    className="bg-[#01818C] px-2 py-3 w-[100px] rounded-2xl"
                    onPress={() => {
                      setModalVisible2(true);
                      setModalVisible1(false);
                      handleOtpSubmit();
                    }}>
                    <Text className="text-white text-center font-medium">Submit</Text>
                  </Pressable>
                  <View className="w-full">
                    <Text className="pb-3">Time Remaining: {Math.max(Math.floor((1 - progress) * time), 0)} seconds</Text>
                    <ProgressBar progress={1 - progress} color={'#01818C'} />
                  </View>
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
              <ActivityIndicator animating={true} color={'black'} />
                <View >
                <Text>Getting Your Current Location...</Text>
                </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>

      <View className="w-full flex flex-row justify-between px-4 mb-2">
        <Text className="text-sm ">Total Classes Attended : {presentDays + absentDays}</Text>
        <View><Text className="text-sm text-right">Present : {presentDays}</Text>
        <Text className="text-sm text-right">Absent : {absentDays}</Text></View>
      </View>

      <View style={{ width: wp(95) }} className="bg-[#01808c2e] p-2 rounded-t-md border-[#01808c7a] border-t-2 border-r-2 border-l-2 ">
        <View className="flex flex-row justify-between">
          <Text className="w-3/4">Date</Text>
          <Text className="w-1/4 text-right">Attendance</Text>
        </View>
      </View>

      <ScrollView
        scrollEventThrottle={1}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: '#fff', height: hp(67) }}
      >
        <View style={{ width: wp(95) }} className="p-2 rounded-b-md border-[#01808c7a] border-b-2 border-r-2 border-l-2 flex gap-y-3">

          {attendanceData.map((item, id) => (
            <View className="flex flex-row justify-between" key={id}>
              <Text className="w-3/4">{item.date}</Text>
              <Text className="w-1/4 text-right">{item.attendance?'Present':'Absent'}</Text>
            </View>
          ))}

        </View>

      </ScrollView>

    </SafeAreaView>
  )
}

export default MarkAttendance;

const styles = StyleSheet.create({
  // Add any custom styles if needed
});