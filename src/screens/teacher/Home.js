import {
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  BackHandler,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
  ToastAndroid,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { theme } from '../../theme'
import {
  ComputerDesktopIcon,
  CpuChipIcon,
  PhoneIcon,
  PlusCircleIcon,
  TrashIcon,
} from "react-native-heroicons/outline";

import * as React from 'react';

import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../../utils/auth';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';

const Home = () => {

  const [selectedClass, setSelectedClass] = React.useState(null);
  const { classes, setClasses, loading, setLoading } = useAuth();

  const deleteClass = async () => {
    try {
      const response = await axios.delete(`https://attendancetrackerbackend.onrender.com/api/class/remove/${selectedClass}`);
      ToastAndroid.show(`${selectedClass} Deleted Successfully !`, ToastAndroid.LONG);
      console.log('Class Deleted Successfully:', response.data);
    } catch (error) {
      //   ToastAndroid.show(`Login failed: ${error}`, ToastAndroid.LONG);
      console.error(error);
    }
  };

  const getList = async (id, name) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://attendancetrackerbackend.onrender.com/api/class/getList/${id}`);
      console.log('tn', response.data);
      navigation.navigate('Sheet', { jsonGlobalData: response.data.rec, id: id, classname: name, teacherName: response.data.teacher });
    } catch (error) {
      //   ToastAndroid.show(`Login failed: ${error}`, ToastAndroid.LONG);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const navigation = useNavigation();

  const [modalVisible1, setModalVisible1] = React.useState(false);

  return (
    <SafeAreaView className="relative">
      <StatusBar
        backgroundColor={theme.maincolor}
        barStyle={"light-content"}
        hidden={false}
      />

      <View style={{ backgroundColor: theme.maincolor, width: wp(100), height: hp(8), justifyContent: 'space-between', alignItems: 'center', display: 'flex', flexDirection: 'row', paddingHorizontal: wp(8) }} >
        <Text style={{ color: 'white', fontSize: wp(5), fontWeight: 500 }} >Classes</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('CreateClass')}>
          <PlusCircleIcon size={wp(8)} color="#fff" />
        </TouchableOpacity>
      </View>
      { loading && <View className="z-10 w-full p-2 top-[40%] absolute ">
      <ActivityIndicator animating={true} color={'#01808c7a'} size={wp(10)} />
      </View> }
      <ScrollView
        scrollEventThrottle={1}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: '#fff', height: hp(100), opacity:loading?0.5:1 }}
      >

        {
          classes.map((item, id) => {
            return (
              <TouchableOpacity key={id}
                disabled={loading}
                className="flex flex-row items-center p-4 bg-[#01808c2e] m-4 mb-0 rounded-2xl border-[#01808c7a] border-2"
                onPress={() => {
                  getList(item.id, item.classname);
                }}
              >
                <CpuChipIcon size={wp(8)} color="#01808cb9" />
                <Text
                  className="ml-2 text-[15px] font-medium text-gray-600 flex-shrink"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.classname}

                </Text>

                <TouchableOpacity onPress={() => {
                  setModalVisible1(true); setSelectedClass(item.classname);
                }} style={{ marginLeft: 'auto' }}>
                  <TrashIcon size={wp(6)} color="red" />
                </TouchableOpacity>

              </TouchableOpacity>
            )
          })
        }
        {classes.length == 0 && <Text className="text-gray-600 text-center pt-4 text-lg">No Class is Created Yet</Text>}

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

                <View className="bg-white p-4 m-4 rounded-3xl">
                  <Text className="ml-2 text-[15px] font-medium text-gray-600 flex-shrink">Do You Really Want to This Class : {selectedClass}</Text>
                  <View className="flex flex-row justify-between mt-5">
                    <TouchableOpacity className="bg-red-400 p-3 w-[100px] rounded-2xl" onPress={() => {
                      setClasses((prevClasses) => prevClasses.filter((item2) => item2.classname !== selectedClass));
                      deleteClass();
                      setModalVisible1(false);
                    }}>
                      <Text className="text-white font-bold text-center">Yes</Text></TouchableOpacity>
                    <TouchableOpacity className="bg-[#01808cc5] p-3 w-[100px] rounded-2xl" onPress={() => setModalVisible1(false)}><Text className="text-white font-bold text-center">Cancel</Text></TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>


      </ScrollView>


    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({})