import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState} from 'react';
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
import ChangePassword from '../../components/ChangePassword';

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

  const {
    setIndex,
    studentNameG,
    studentEmailG,
    rollNumberG,
    branch,
    semester,
    pass,
    enroll,
    phone,
  } = useAuth();
  const [modalView, setModalView] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);

  const handleClose = close => {
    setModalView(close);
  };

  const alert = () => {
    ToastAndroid.show('This feature is not available yet!', ToastAndroid.SHORT);
  };

  return (
    <ScrollView>
      <SafeAreaView style={{alignItems: 'center', marginBottom: hp(10)}}>
        <StatusBar
          backgroundColor={theme.maincolor}
          barStyle={'light-content'}
          hidden={false}
        />

        {modalView && (
          <ChangePassword
            type="student"
            id={rollNumberG}
            closeDialog={handleClose}
          />
        )}

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
              setModalVisible1(true);
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
              Branch: <Text className="text-gray-500">{branch}</Text>
            </Text>
            <Text className="text-[#01808c] font-medium pt-2">
              Semester: <Text className="text-gray-500">{semester}</Text>
            </Text>
            <Text className="text-[#01808c] font-medium pt-2">
              Graduation Year: <Text className="text-gray-500">{pass}</Text>
            </Text>
            <Text className="text-[#01808c] font-medium pt-2">
              Enrollment Number: <Text className="text-gray-500">{enroll}</Text>
            </Text>
            <Text className="text-[#01808c] font-medium pt-2">
              College:{' '}
              <Text className="text-gray-500">
                {'National Institute of Technology Raipur'}
              </Text>
            </Text>
            <Text className="text-[#01808c] font-medium pt-2">
              Phone Number: <Text className="text-gray-500">{phone}</Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setModalView(true)}
            className="bg-[#01808cb9] py-1 px-4 rounded-md border-[#01808c7a] border-2 flex items-center absolute top-2 right-2">
            <PencilSquareIcon size={wp(6)} color="white" />
            <Text className="text-white text-[13px] font-medium">
              Update Profile
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
          <TouchableOpacity
            onPress={alert}
            className="bg-[#01808c1f] p-2 rounded-full border-[#01808c7a] border-2">
            <EnvelopeIcon size={22} color={'#01808cb9'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={alert}
            className="bg-[#01808c1f] p-2 rounded-full border-[#01808c7a] border-2">
            <PhoneIcon size={22} color={'#01808cb9'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={alert}
            className="bg-[#01808c1f] p-2 rounded-full border-[#01808c7a] border-2">
            <LinkIcon size={22} color={'#01808cb9'} />
          </TouchableOpacity>
        </View>

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
                  <Text className="ml-2 text-[15px] font-medium text-gray-600 flex-shrink">
                    Do You Really Want to logout from : {rollNumberG}
                  </Text>
                  <View className="flex flex-row justify-between mt-5">
                    <TouchableOpacity
                      className="bg-red-400 p-3 w-[100px] rounded-2xl"
                      onPress={() => {
                        setIndex('0');
                        saveData();
                        setModalVisible1(false);
                      }}>
                      <Text className="text-white font-bold text-center">
                        Yes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-[#01808cc5] p-3 w-[100px] rounded-2xl"
                      onPress={() => setModalVisible1(false)}>
                      <Text className="text-white font-bold text-center">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
