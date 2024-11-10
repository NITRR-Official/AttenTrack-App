import { Alert, Modal, PermissionsAndroid, Platform, Pressable, SafeAreaView, StyleSheet, Switch, Text, TextInput, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
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
import axios from 'axios';
import GetLocation from 'react-native-get-location'
import { calculateDistance } from './locationTracker';

const MarkAttendance = () => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState('');
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [receivedOtp, setReceivedOtp] = useState(null);
  const [time, setTime] = useState(0);
  const [finalTime, setFinalTime] = useState(1);

  const handleGetAttendance = async () => {
    try {
      // Await the axios post request to set attendance
      const resp = await axios.get('https://attendancetrackerbackend.onrender.com/getAttendance');
      const data2 = resp.data;  // Contains currentOTP and finalTime
      // console.log('OTP (FrontEnd): ', data2.currentOTP);
      // console.log('Final Time (FrontEnd): ', data2.finalTime);
      setReceivedOtp(data2.currentOTP);
      setFinalTime(data2.finalTime);
    } catch (error) {
      // Catch any errors and handle them
      console.error('Error sending OTP and time to server:', error);
      Alert.alert('Failed to set attendance. Please try again.');
    }
  }; 

  useEffect(() => {

    // Set up WebSocket connection
    socket = new WebSocket('wss://attendancetrackerbackend.onrender.com');
    console.log('Socket from student side connected!');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Handle real-time time updates from the WebSocket
      if (data.type === 'time_update2') {
        handleGetAttendance();
        if(data.time<=0){
            setModalVisible1(false);
        }
        setTime(data.time);  // Update time based on WebSocket message
        // console.log(`Real-time time update received 2: ${data.time}`);
      }
      if(data.type === 'first_call'){
        setOtp('');
        setModalVisible1(true);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
      Alert.alert('Error with WebSocket connection');
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  const handleOtpSubmit = () => {
    if (receivedOtp === otp) {
      // console.log('OTP Matched');
      ToastAndroid.show('OTP Verified !', ToastAndroid.LONG);
      setModalVisible1(false);
      setModalVisible2(true);
        requestLocationPermission();
    } else {
      // console.log('Incorrect OTP');
      ToastAndroid.show('Incorrect OTP !', ToastAndroid.LONG);
    }
  };

  const requestLocationPermission = async () => {
    if(Platform.OS === "android"){
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log("You can access location");
        getCurrentLocation();  // Call your function to get the location
      } else {
        // console.log("Location permission denied");
        ToastAndroid.show('Location permission denied !', ToastAndroid.LONG);
        setTimeout(()=>{setModalVisible2(false)},2000);
      }
    } catch (err) {
      console.warn(err);
    }}
  };

  const getCurrentLocation = () => {
    const targetLatitude = 21.24973790975813;  // target latitude
    const targetLongitude = 81.60502712836308;  // target longitude
    const radius = 3000;  // range

    GetLocation.getCurrentPosition({enableHighAccuracy: true, timeout: 60000})
    .then(location => {
      const distance = calculateDistance(location.latitude, location.longitude,
        targetLatitude, targetLongitude);
      
      if (distance <= radius) {
        socket.send(JSON.stringify({type: 'attendance', rollNumber: 21117102}));
        ToastAndroid.show('Location Matched ! Attendance Marked as Present !',
          ToastAndroid.LONG);
        setTimeout(()=>{setModalVisible2(false)},2000);
      } else {
        ToastAndroid.show('Location not within range', ToastAndroid.LONG);
        setTimeout(()=>{setModalVisible2(false)},2000);
      }
    })
    .catch(error => {
      const { code, message } = error;
      console.warn(code, message);
    });
  };


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
          onPress={() => {
            if(time==0){
              ToastAndroid.show('Wait for the Teacher to Take Attendance..', ToastAndroid.LONG);
            }else{
              handleGetAttendance();
              setModalVisible1(true);
              setOtp('');
            }}}
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
                  <Text className="text-gray-500">Enter OTP :</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, width: '90%' }}>
                    <TextInput
                      onChangeText={setOtp}
                      value={otp}
                      placeholder="Enter OTP..."
                      placeholderTextColor={'gray'}
                      keyboardType='numeric'
                      style={{ flex: 1, paddingLeft: 10, height: 40, color: 'gray' }}
                    />
                  </View>
                  <Pressable
                    className="bg-[#01818C] px-2 py-3 w-[100px] rounded-2xl"
                    onPress={() => {
                      handleOtpSubmit();
                    }}>
                    <Text className="text-white text-center font-medium">Submit</Text>
                  </Pressable>
                  <View className="w-full">
                    <Text className="pb-3 text-gray-500">Time Remaining: {time} seconds</Text>
                    <ProgressBar progress={time/finalTime} color={'#01818C'} backgroundColor={'black'}/>
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
                <Text className="text-gray-400">Getting Your Current Location...</Text>
                </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>

      <View className="w-full flex flex-row justify-between px-4 mb-2">
        <Text className="text-sm  text-gray-400 ">Total Classes Attended : {presentDays + absentDays}</Text>
        <View><Text className="text-sm text-right text-gray-400 ">Present : {presentDays}</Text>
        <Text className="text-sm  text-gray-400 text-right">Absent : {absentDays}</Text></View>
      </View>

      <View style={{ width: wp(95) }} className="bg-[#01808c2e] p-2 rounded-t-md border-[#01808c7a] border-t-2 border-r-2 border-l-2 ">
        <View className="flex flex-row justify-between">
          <Text className="w-3/4 text-gray-600 ">Date</Text>
          <Text className="w-1/4 text-gray-600 text-right">Attendance</Text>
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
              <Text className={`w-3/4 text-[${theme.maincolor}] `} >{item.date}</Text>
              <Text className={`w-1/4 text-[${theme.maincolor}]  text-right`}>{item.attendance?'Present':'Absent'}</Text>
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