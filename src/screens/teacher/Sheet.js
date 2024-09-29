import { Modal, Pressable, SafeAreaView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { BookOpenIcon, CpuChipIcon, PlusCircleIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { theme } from '../../theme';
import { ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { ProgressBar, RadioButton } from 'react-native-paper';

const studentsData = [
  {
    rollNumber: 21116028,
    name: "D Anuj Kumar",
    attendance: true,
  },
  {
    rollNumber: 21116040,
    name: "Harsh Dewangan",
    attendance: true,
  },
  {
    rollNumber: 21116008,
    name: "Aniket Kumar",
    attendance: false,
  },
  {
    rollNumber: 21116070,
    name: "Mohit Doraiburu",
    attendance: false,
  },
]

const Sheet = () => {
  const navigation = useNavigation();

  const [student, setStudent] = useState(studentsData);

  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(10000);

  useEffect(() => {
    let interval;
    if (modalVisible2) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 1) {
            setModalVisible2(false);
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
  }, [modalVisible2]);

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center' }} >
      <View className="w-full flex flex-row justify-between items-center p-4">
        <TouchableOpacity>
          <XMarkIcon size={wp(8)} color={theme.maincolor} onPress={() => navigation.goBack()} />
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: theme.maincolor }} className="flex justify-center items-center rounded-lg p-3 px-5" >
          <Text style={{ color: '#fff', fontSizeq: wp(6), fontWeight: '700' }} >Save</Text>
        </TouchableOpacity>
      </View>

      <View className="w-[95%] bg-[#01808c2e] p-2 px-5 rounded-md border-[#01808c7a] border-2 m-4 flex flex-row justify-between items-end">
        <View>
          <View className="flex flex-row"><CpuChipIcon size={wp(8)} fill={theme.maincolor} color={theme.maincolor} /><Text className="text-2xl text-[#01808cb9] font-medium ml-1">VLSI</Text></View>
          <Text className="text-gray-600">Chitrakant Sahu</Text>
        </View>
        <TouchableOpacity
          onPress={() => setModalVisible1(true)}
          className="flex flex-col justify-center items-center bg-[#01808cb9] p-2 px-5 rounded-md border-[#01808c7a] border-2">
          <PlusCircleIcon size={wp(10)} color="white" />
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
                  <Text className="text-lg font-bold">OTP : 123456</Text>
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



      <ScrollView
        scrollEventThrottle={1}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: '#fff', height: hp(100) }}
      >
        <View style={{ width: wp(95) }} className="bg-[#01808c2e] p-2 rounded-t-md border-[#01808c7a] border-t-2 border-r-2 border-l-2 ">
          <View className="flex flex-row justify-between">
            <Text className="w-1/4">Roll Number</Text>
            <Text className="w-1/2 text-center">Name</Text>
            <Text className="w-1/4 text-right">Attendance</Text>
          </View>
        </View>
        <View style={{ width: wp(95) }} className="p-2 rounded-b-md border-[#01808c7a] border-b-2 border-r-2 border-l-2 flex gap-y-3">

          {student.map((item, id) => (
            <View className="flex flex-row justify-between" key={id}>
              <Text className="w-1/4">{item.rollNumber}</Text>
              <Text className="w-1/2">{item.name}</Text>
              <View className="w-1/4 flex flex-row justify-end items-center">
                <Switch
                  thumbColor={item.attendance ? '#258a4a' : '#c41111'}
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

export default Sheet

const styles = StyleSheet.create({

});