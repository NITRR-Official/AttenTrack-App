import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { CpuChipIcon, PencilSquareIcon, XMarkIcon } from 'react-native-heroicons/outline';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { theme } from '../../theme';

const Profile = () => {
  return (
    <SafeAreaView style={{ alignItems: 'center' }} >

<StatusBar
        backgroundColor={theme.maincolor}
        barStyle={"light-content"}
        hidden={false}
      />

      <View style={{ backgroundColor: theme.maincolor, width: wp(100), height: hp(8), justifyContent: 'space-between', alignItems: 'center', display: 'flex', flexDirection: 'row', paddingHorizontal: wp(8) }} >
        <Text style={{ color: 'white', fontSize: wp(5), fontWeight:500 }} >Profile</Text>
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
      </View>

      <ScrollView
        scrollEventThrottle={1}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: '#fff', height: hp(67) }}
      >
        <View style={{ width: wp(95) }} className="p-2 rounded-md border-[#01808c7a] border-2">

        </View>

      </ScrollView>

    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({})