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
} from "react-native-heroicons/outline";

import * as React from 'react';

import { useNavigation } from "@react-navigation/native";


const ReportHome = () => {

  const navigation = useNavigation();

  return (
    <SafeAreaView>
             <StatusBar
        backgroundColor={theme.maincolor}
        barStyle={"light-content"}
        hidden={false}
      />

      <View style={{ backgroundColor: theme.maincolor, width: wp(100), height: hp(10), justifyContent: 'space-between', alignItems: 'center', display: 'flex', flexDirection: 'row', paddingHorizontal: wp(8) }} >
        <Text style={{ color: 'white', fontSize: wp(6), fontWeight:700 }} >Monthly Attendance Report</Text>
        </View>
      <ScrollView
        scrollEventThrottle={1}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: '#fff', height: hp(100) }}
      >

        <TouchableOpacity
          className="flex flex-row items-center p-4 bg-[#01808c2e] m-4 mb-0 rounded-2xl border-[#01808c7a] border-2"
          onPress={() => navigation.navigate('Report')}
        >
          <CpuChipIcon size={wp(10)} color="#01808cb9" />
          <Text
            className="ml-2 text-lg font-medium text-gray-600 flex-shrink"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            VLSI (2025 BATCH)
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          className="flex flex-row items-center p-4 bg-[#01808c2e] m-4 mb-0 rounded-2xl border-[#01808c7a] border-2"
          onPress={() => navigation.navigate('Report')}
        >
          <PhoneIcon size={wp(10)} color="#01808cb9" />
          <Text
            className="ml-2 text-lg font-medium text-gray-600 flex-shrink"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Analog Communication (2026 BATCH)
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          className="flex flex-row items-center p-4 bg-[#01808c2e] m-4 mb-0 rounded-2xl border-[#01808c7a] border-2"
          onPress={() => navigation.navigate('Report')}
        >
          <ComputerDesktopIcon size={wp(10)} color="#01808cb9" />
          <Text
            className="ml-2 text-lg font-medium text-gray-600 flex-shrink"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Operating System (2026 BATCH)
          </Text>
        </TouchableOpacity>



      </ScrollView>


    </SafeAreaView>
  )
}

export default ReportHome

const styles = StyleSheet.create({})