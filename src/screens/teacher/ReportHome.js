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
} from "react-native-heroicons/outline";

import * as React from 'react';

import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../../utils/auth';
import axios from 'axios';


const ReportHome = () => {

  const navigation = useNavigation();
  const {classes, setRecordG, setLoading, setTotG} = useAuth();

  const getRecord = async (id) => {
    try {
        setLoading(true);
        console.log(id, new Date(), new Date());
        const response = await axios.post('https://attendancetrackerbackend.onrender.com/api/teacher/records', {
            classId : id,
            startDate: '2024-10-01',
            endDate: new Date()
        });
        const arrayOfObjects = Object.entries(response.data.attendanceCount).map(([rollNumber, present]) => ({
          rollNumber,
          present
        }));
        setRecordG(arrayOfObjects);
        setTotG(response.data.tot);
        setLoading(false);
        navigation.navigate('Report');
    } catch (error) {
    //   ToastAndroid.show(`Login failed: ${error}`, ToastAndroid.LONG);
    console.error(error);
    setLoading(false);
    }
};

  return (
    <SafeAreaView>
             <StatusBar
        backgroundColor={theme.maincolor}
        barStyle={"light-content"}
        hidden={false}
      />

      <View style={{ backgroundColor: theme.maincolor, width: wp(100), height: hp(8), justifyContent: 'space-between', alignItems: 'center', display: 'flex', flexDirection: 'row', paddingHorizontal: wp(8) }} >
        <Text style={{ color: 'white', fontSize: wp(5), fontWeight:500 }} >Monthly Attendance Report</Text>
        </View>
      <ScrollView
        scrollEventThrottle={1}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: '#fff', height: hp(100) }}
      >

        {
          classes.map((item, id)=>{return(
            <TouchableOpacity key={id}
          className="flex flex-row items-center p-4 bg-[#01808c2e] m-4 mb-0 rounded-2xl border-[#01808c7a] border-2"
          onPress={() => {
            getRecord(item.id);
            // navigation.navigate('Report', jsonGlobalData);
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
          )})
        }



      </ScrollView>


    </SafeAreaView>
  )
}

export default ReportHome

const styles = StyleSheet.create({})