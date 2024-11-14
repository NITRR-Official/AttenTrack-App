import {
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  BackHandler,
  ScrollView,
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
  SignalIcon,
  WifiIcon,
} from "react-native-heroicons/outline";

import * as React from 'react';

import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../../utils/auth';
import axios from 'axios';


const Home = () => {

  const navigation = useNavigation();
  const { rollNumberG, classes, setClasses, setAttDataG } = useAuth();

  const getClassInfo = async () => {
    try {
      const response = await axios.get(`https://attendancetrackerbackend.onrender.com/api/student/class-info/${rollNumberG}`);
      setClasses(response.data.map(classItem => ({
        id: classItem._id,
        classname: classItem.classname
      })));
    } catch (error) {
      //   ToastAndroid.show(`Login failed: ${error}`, ToastAndroid.LONG);
      console.error(error);
    }
  }

  const getAttendance = async (id, name) => {
    try {
      const response = await axios.get(`https://attendancetrackerbackend.onrender.com/api/student/attendance?class_id=${id}&rollNumber=${rollNumberG}`);
      console.log(response.data);
      navigation.navigate('MarkAttendance', {attDataG:response.data.res, teacherName:response.data.teacher, className:name} );
    } catch (error) {
      //   ToastAndroid.show(`Login failed: ${error}`, ToastAndroid.LONG);
      console.error(error);
    }
  }

  React.useEffect(() => {
    getClassInfo();
  }, [])

  return (
    <SafeAreaView>
      <StatusBar
        backgroundColor={theme.maincolor}
        barStyle={"light-content"}
        hidden={false}
      />

      <View style={{ backgroundColor: theme.maincolor, width: wp(100), height: hp(8), justifyContent: 'space-between', alignItems: 'center', display: 'flex', flexDirection: 'row', paddingHorizontal: wp(8) }} >
        <Text style={{ color: 'white', fontSize: wp(5), fontWeight: 500 }} >Classes</Text>

        {/* <TouchableOpacity
          onPress={() => navigation.navigate('CreateClass')}>
          <PlusCircleIcon size={wp(10)} color="#fff" />
        </TouchableOpacity> */}
      </View>
      <ScrollView
        scrollEventThrottle={1}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: '#fff', height: hp(100) }}
      >

        {
          classes?.map((item, id) => {
            return (
              <TouchableOpacity key={id}
                className="flex flex-row items-center p-4 bg-[#01808c2e] m-4 mb-0 rounded-2xl border-[#01808c7a] border-2"
                onPress={() => {
                  getAttendance(item.id, item.classname);
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
              </TouchableOpacity>
            )
          })
        }
        {classes?.length == 0 && <Text className="text-gray-600 text-center pt-4 text-lg">You Have Not Been Added In Any Class</Text>}

      </ScrollView>


    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({})