import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  EnvelopeIcon,
  LinkIcon,
  PencilSquareIcon,
  PhoneIcon,
  UserCircleIcon,
} from 'react-native-heroicons/outline';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {theme} from '../../theme';
import PieChart from 'react-native-pie-chart';
import {useAuth} from '../../utils/auth';
import SInfo from 'react-native-encrypted-storage';
import {ScrollView} from 'react-native-gesture-handler';

const Profile = () => {
  const series = [123, 321, 123, 789, 537];
  const series2 = [300, 30];
  const sliceColor = [
    '#01818C',
    '#01808c7a',
    '#01808c2e',
    '#01808cb9',
    '#01808c37',
  ];
  const sliceColor2 = ['#258a4ac4', '#c41111c4'];

  const saveData = async () => {
    try {
      await SInfo.removeItem('token');
    } catch (e) {
      console.error(e);
    }
  };

  const {setIndex, studentNameG, studentEmailG, rollNumberG} = useAuth();

  return (
    <ScrollView>
    <SafeAreaView style={{alignItems: 'center', marginBottom: hp(10)}}>
      <StatusBar
        backgroundColor={theme.maincolor}
        barStyle={'light-content'}
        hidden={false}
      />
        <View
          style={{
            backgroundColor: theme.maincolor,
            width: wp(100),
            height: hp(8),
            justifyContent: 'space-between',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            paddingHorizontal: wp(8),
          }}>
          <Text style={{color: 'white', fontSize: wp(5), fontWeight: 500}}>
            Profile
          </Text>
          <TouchableOpacity
            onPress={() => {
              setIndex('0');
              saveData();
            }}
            style={{backgroundColor: 'white'}}
            className="flex justify-center items-center rounded-lg p-3 px-4">
            <View className="flex flex-row justify-center items-center">
              <Text
                style={{
                  color: theme.maincolor,
                  fontSize: wp(3.5),
                  fontWeight: '700',
                  marginLeft: 5,
                }}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="w-[95%] bg-[#01808c2e] p-2 px-5 rounded-md border-[#01808c7a] border-2 m-4 mb-3 flex flex-row justify-between relative">
          <View className="flex-1">
            <View className="flex flex-row items-center">
              <UserCircleIcon size={wp(10)} color={theme.maincolor} />
              <Text className="text-3xl text-[#01808cb9] font-medium ml-1">
                {studentNameG}
              </Text>
            </View>
            <Text className="text-[#01808c] font-medium pt-2">
              Roll Number: <Text className="text-gray-500">{rollNumberG}</Text>
            </Text>
            <Text className="text-[#01808c] font-medium pt-2">
              Email: <Text className="text-gray-500">{studentEmailG}</Text>
            </Text>
            <Text className="text-[#01808c] font-medium pt-2">
              Branch:{' '}
              <Text className="text-gray-500">
                {'Electronics & Communication Engineering'}
              </Text>
            </Text>
            <Text className="text-[#01808c] font-medium pt-2">
              Semester: <Text className="text-gray-500">{'4th'}</Text>
            </Text>
            <Text className="text-[#01808c] font-medium pt-2">
              Graduation Year: <Text className="text-gray-500">{2025}</Text>
            </Text>
            <Text className="text-[#01808c] font-medium pt-2">
              Enrollment Number: <Text className="text-gray-500">{211061}</Text>
            </Text>
            <Text className="text-[#01808c] font-medium pt-2">
              College:{' '}
              <Text className="text-gray-500">
                {'National Institute of Technology Raipur'}
              </Text>
            </Text>
            <Text className="text-[#01808c] font-medium pt-2">
              Phone Number: <Text className="text-gray-500">{7717789081}</Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible1(true)}
            className="bg-[#01808cb9] py-1 px-4 rounded-md border-[#01808c7a] border-2 flex items-center absolute top-2 right-2">
            <PencilSquareIcon size={wp(6)} color="white" />
            <Text className="text-white text-[13px] font-medium">
              Reset Password
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{width: wp(95)}}
          className="p-2 rounded-md border-[#01808c7a] border-2">
          <View className="flex flex-row w-full justify-around p-2">
            <PieChart
              widthAndHeight={140}
              series={series}
              sliceColor={sliceColor}
            />
            <PieChart
              widthAndHeight={140}
              series={series2}
              sliceColor={sliceColor2}
              coverRadius={0.45}
              coverFill={'#FFF'}
            />
          </View>
          <View className="flex flex-row justify-between p-2">
            <View>
              <View className="flex flex-row items-center ">
                <View className={`w-4 h-4 mr-2 bg-[${sliceColor[0]}]`}></View>
                <Text className="text-gray-500">Mathematics : {series[0]}</Text>
              </View>
              <View className="flex flex-row items-center">
                <View className={`w-4 h-4 mr-2 bg-[#01808c62]`}></View>
                <Text className="text-gray-500">Physics : {series[1]}</Text>
              </View>
              <View className="flex flex-row items-center">
                <View className={`w-4 h-4 mr-2 bg-[${sliceColor[2]}]`}></View>
                <Text className="text-gray-500">Chemistry : {series[2]}</Text>
              </View>
              <View className="flex flex-row items-center">
                <View className={`w-4 h-4 mr-2 bg-[${sliceColor[3]}]`}></View>
                <Text className="text-gray-500">Biology : {series[3]}</Text>
              </View>
              <View className="flex flex-row items-center">
                <View className={`w-4 h-4 mr-2 bg-[#01808c62]`}></View>
                <Text className="text-gray-500">English : {series[4]}</Text>
              </View>
            </View>
            <View>
              <View className="flex flex-row items-center">
                <View className={`w-4 h-4 mr-2 bg-[${sliceColor2[0]}]`}></View>
                <Text className="text-gray-500">
                  Classes Attended : {series2[0]}
                </Text>
              </View>
              <View className="flex flex-row items-center">
                <View className={`w-4 h-4 mr-2 bg-[${sliceColor2[1]}]`}></View>
                <Text className="text-gray-500">
                  Classes Unattended : {series2[1]}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex flex-row justify-around w-full py-3">
          <TouchableOpacity className="bg-[#01808c1f] p-2 rounded-full border-[#01808c7a] border-2">
            <EnvelopeIcon size={22} color={'#01808cb9'} />
          </TouchableOpacity>
          <TouchableOpacity className="bg-[#01808c1f] p-2 rounded-full border-[#01808c7a] border-2">
            <PhoneIcon size={22} color={'#01808cb9'} />
          </TouchableOpacity>
          <TouchableOpacity className="bg-[#01808c1f] p-2 rounded-full border-[#01808c7a] border-2">
            <LinkIcon size={22} color={'#01808cb9'} />
          </TouchableOpacity>
        </View>
    </SafeAreaView>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
