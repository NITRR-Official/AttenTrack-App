import {
  Modal,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState, useMemo, useRef} from 'react';
import PropTypes from 'prop-types';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  CpuChipIcon,
  PencilSquareIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';
import {theme} from '../../theme';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, ProgressBar} from 'react-native-paper';
import axios from 'axios';
import GetLocation from 'react-native-get-location';
import {calculateDistance} from './locationTracker';
import {useAuth} from '../../utils/auth';
import {API_URL, BASE_URL} from '../../constants/constants';

const MarkAttendance = ({route}) => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState('');
  const [modalVisible0, setModalVisible0] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [receivedOtp, setReceivedOtp] = useState(null);
  const [time, setTime] = useState(0);
  const [finalTime, setFinalTime] = useState(1);
  const [id, setId] = useState('');
  const [range, setRange] = useState();
  const [lat, setLat] = useState();
  const [long, setLong] = useState();
  const [retry, setRetry] = useState(false);
  const {rollNumberG, turnONGPS} = useAuth();

  const handleGetAttendance = async () => {
    try {
      const resp = await axios.get(`${BASE_URL}/getAttendance`);
      const data2 = resp.data;
      setReceivedOtp(data2.currentOTP);
      setFinalTime(data2.finalTime);
      setId(data2.currentId);
    } catch (error) {
      console.error('Error sending OTP and time to server:', error);
      ToastAndroid.show(
        'Failed to set attendance. Please try again.',
        ToastAndroid.LONG,
      );
      cancelMarking()
      setRetry(true);
    }
  };

  const socket = useMemo(() => new WebSocket(`wss://${API_URL}`), []);

  const popupAutoShownRef = useRef(false);

  useEffect(() => {
    const handleTeacherInfo = data => {
      setRange(data.range);
      setLat(data.location.latitude);
      setLong(data.location.longitude);
    };

    socket.onmessage = event => {
      const data = JSON.parse(event.data);
      if (data.type === 'time_update2') {
        handleGetAttendance();
        if (data.time <= 0) {
          cancelMarking();
        }

        if (!popupAutoShownRef.current) {
          setModalVisible1(true);
          popupAutoShownRef.current = true; // prevent it from showing again
        }

        setTime(data.time);

        handleTeacherInfo({
          location: data.location,
          range: data.range,
        });
      }
      if (data.type === 'teacherLoc') {
        setRange(data.range);
        setLat(data.location.latitude);
        setLong(data.location.longitude);
      }
      if (data.type === 'first_call') {
        setOtp('');
        setModalVisible1(true);
      }
    };

    socket.onerror = error => {
      console.log('WebSocket Error:', error);
      cancelMarking()
      setRetry(true);
      ToastAndroid.show('Error With WebSocket Connection', ToastAndroid.LONG);
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
    if (receivedOtp == otp && id == route.params.id) {
      ToastAndroid.show('OTP Verified !', ToastAndroid.LONG);
      setModalVisible1(false);
      setModalVisible2(true);
      requestLocationPermission();
    } else {
      ToastAndroid.show('Incorrect OTP or invalid class !', ToastAndroid.LONG);
    }
  };

  const cancelMarking = () => {
    setModalVisible1(false);
    setModalVisible0(false);
    setModalVisible2(false);
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          ToastAndroid.show('Location permission denied !', ToastAndroid.LONG);
          setTimeout(() => {
            setModalVisible2(false);
          }, 2000);
          cancelMarking()
        }
      } catch (err) {
        cancelMarking()
        setRetry(true);
        console.warn(err);
      }
    }
  };

  const getCurrentLocation = () => {
    GetLocation.getCurrentPosition({enableHighAccuracy: true, timeout: 60000})
      .then(location => {
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          lat,
          long,
        );
        if (distance <= range) {
          socket.send(
            JSON.stringify({type: 'attendance', rollNumber: rollNumberG}),
          );
          ToastAndroid.show(
            'Location Matched ! Attendance Marked as Present !',
            ToastAndroid.LONG,
          );
          setTimeout(() => {
            setModalVisible2(false);
          }, 2000);
        } else {
          ToastAndroid.show('Location not within range', ToastAndroid.LONG);
          setTimeout(() => {
            setModalVisible2(false);
          }, 2000);
        }

        //For experiment basis only
        ToastAndroid.show(`R: ${range} m, D: ${distance} m`, ToastAndroid.LONG);
        ToastAndroid.show(
          `LAT-S: ${location.latitude}, LONG-S: ${location.longitude}`,
          ToastAndroid.LONG,
        );
        ToastAndroid.show(`LAT-T: ${lat}, LONG-T: ${long}`, ToastAndroid.LONG);
      })
      .catch(error => {
        const {code, message} = error;
        cancelMarking()
        setRetry(true);
        console.warn(code, message);
      });
  };

  const givePresent = () => {
    console.log("Give present: ", time);
    if (time == 0) {
      ToastAndroid.show(
        'Wait for the Teacher to Take Attendance..',
        ToastAndroid.LONG,
      );
    } else {
      handleGetAttendance();
      setModalVisible1(true);
      setOtp('');
    }
  }

  return (
    <SafeAreaView style={{alignItems: 'center'}}>
      <View className="w-full flex flex-row justify-between items-center p-4 pb-0">
        <TouchableOpacity>
          <XMarkIcon
            size={wp(8)}
            color={theme.maincolor}
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>
      </View>

      <View className="w-[95%] bg-[#01808c2e] p-2 px-3 rounded-md border-[#01808c7a] border-2 m-4 mb-3 flex flex-row justify-between items-end">
        <View>
          <View className="flex flex-row flex-wrap">
            <CpuChipIcon
              size={wp(8)}
              fill={theme.maincolor}
              color={theme.maincolor}
            />
            <Text className="text-2xl text-[#01808cb9] font-medium ml-1">
              {route.params.className.length > 10
                ? route.params.className.substring(0, 10) + '...'
                : route.params.className}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={()=>{
            givePresent()
          }}
          className="flex flex-col justify-center items-center bg-[#01808cb9] p-2 rounded-md border-[#01808c7a] border-2">
          <PencilSquareIcon size={wp(6)} color="white" />
          <Text className="text-white text-[15px] font-medium">
            Mark Attendance
          </Text>
        </TouchableOpacity>

        {/* Warning dialog box */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible0}
          onRequestClose={() => {
            setModalVisible0(!modalVisible0);
          }}>
          <TouchableWithoutFeedback onPress={() => setModalVisible0(false)}>
            <View className="w-full flex-1 bg-[#00000050] flex justify-center">
              <TouchableWithoutFeedback>
                <View className="bg-white p-4 m-4 rounded-3xl">
                  <Text className="ml-2 text-[15px] font-medium text-gray-600 flex-shrink">
                    Do You Really Want to end this attendance session ?
                  </Text>
                  <View className="flex flex-row justify-between mt-5">
                    <TouchableOpacity
                      className="bg-red-400 p-3 w-[100px] rounded-2xl"
                      onPress={() => {
                        cancelMarking();
                      }}>
                      <Text className="text-white font-bold text-center">
                        Yes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-[#01808cc5] p-3 w-[100px] rounded-2xl"
                      onPress={() => setModalVisible0(false)}>
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

        {/* Retry dialog box */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={retry}
          onRequestClose={() => {
            setRetry(!retry);
          }}>
          <TouchableWithoutFeedback>
            <View className="w-full flex-1 bg-[#00000050] flex justify-center">
              <TouchableWithoutFeedback>
                <View className="bg-white p-4 m-4 rounded-3xl">
                  <Text className="ml-2 text-[15px] font-medium text-gray-600 flex-shrink">
                    Network not available or GPS not turned ON
                  </Text>
                  <View className="flex flex-row justify-between mt-5">
                    <TouchableOpacity
                      className="bg-red-400 p-3 w-[100px] rounded-2xl"
                      onPress={() => {
                        givePresent();
                        setRetry(false);
                      }}>
                      <Text className="text-white font-bold text-center">
                        Retry
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-red-400 p-3 w-[100px] rounded-2xl"
                      onPress={() => {
                        // Go to GPS settings
                        turnONGPS();
                      }}>
                      <Text className="text-white font-bold text-center">
                        Settings
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-[#01808cc5] p-3 w-[100px] rounded-2xl"
                      onPress={() => setRetry(false)}>
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

        {/* OTP dialog box */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible1}
          onRequestClose={() => {
            setModalVisible0(true);
          }}>
          <View className="w-full flex-1 bg-[#00000050] flex justify-center">
            <TouchableWithoutFeedback>
              <View className="bg-white m-[20px] rounded-lg p-[35px] shadow-2xl shadow-black flex items-center gap-y-3">
                <Text className="text-gray-500">Enter OTP :</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: 'gray',
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    width: '90%',
                  }}>
                  <TextInput
                    onChangeText={setOtp}
                    value={otp}
                    placeholder="Enter OTP..."
                    placeholderTextColor={'gray'}
                    keyboardType="numeric"
                    style={{
                      flex: 1,
                      paddingLeft: 10,
                      height: 40,
                      color: 'gray',
                    }}
                  />
                </View>
                <View className="flex flex-row justify-center w-full mt-5">
                  <Pressable
                    className="bg-[#01818C] px-2 py-3 w-[100px] rounded-2xl mr-2"
                    onPress={() => {
                      handleOtpSubmit();
                    }}>
                    <Text className="text-white text-center font-medium">
                      Submit
                    </Text>
                  </Pressable>
                  <Pressable
                    className="bg-[#01818C] px-2 py-3 w-[100px] rounded-2xl"
                    onPress={() => {
                      setModalVisible0(true);
                    }}>
                    <Text className="text-white text-center font-medium">
                      Cancel
                    </Text>
                  </Pressable>
                </View>

                <View className="w-full">
                  <Text className="pb-3 text-gray-500">
                    Time Remaining: {time} seconds
                  </Text>
                  <ProgressBar
                    progress={time / finalTime}
                    color={'#01818C'}
                    backgroundColor={'black'}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>

        {/* Getting location dialog box */}
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
                  <View>
                    <Text className="text-gray-400">
                      Getting Your Current Location...
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>


      </View>

      <View className="w-full flex flex-row justify-between px-4 mb-2">
        <Text className="text-sm  text-gray-400 ">
          Total Classes Attended : {route.params.attDataG.totalClasses}
        </Text>
        <View>
          <Text className="text-sm text-right text-gray-400 ">
            Present : {route.params.attDataG.presentClasses}
          </Text>
          <Text className="text-sm  text-gray-400 text-right">
            Absent :{' '}
            {route.params.attDataG.totalClasses -
              route.params.attDataG.presentClasses}
          </Text>
        </View>
      </View>

      <View
        style={{width: wp(95)}}
        className="bg-[#01808c2e] p-2 rounded-t-md border-[#01808c7a] border-t-2 border-r-2 border-l-2 ">
        <View className="flex flex-row justify-between">
          <Text className="w-2/4 text-gray-600">Date</Text>
          <Text className="w-1/4 text-gray-600">Time</Text>
          <Text className="w-1/4 text-gray-600 text-right">Attendance</Text>
        </View>
      </View>

      <ScrollView
        scrollEventThrottle={1}
        contentContainerStyle={{flexGrow: 1}}
        style={{backgroundColor: '#fff', height: hp(60)}}>
        <View
          style={{width: wp(95)}}
          className="p-2 rounded-b-md border-[#01808c7a] border-b-2 border-r-2 border-l-2 flex gap-y-3">
          {route.params.attDataG.attendanceMap.map((data, index) => (
            <View className="flex flex-row justify-between" key={index}>
              <Text className={`w-2/4 text-[${theme.maincolor}]`}>
                {data.date}
              </Text>
              <Text className={`w-1/4 text-[${theme.maincolor}]`}>
                {data.time}
              </Text>
              <Text className={`w-1/4 text-[${theme.maincolor}] text-right`}>
                {data.status ? 'Present' : 'Absent'}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

MarkAttendance.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      attDataG: PropTypes.shape({
        attendanceMap: PropTypes.arrayOf(
          PropTypes.shape({
            date: PropTypes.string.isRequired,
            status: PropTypes.bool.isRequired,
          }),
        ).isRequired,
        totalClasses: PropTypes.number.isRequired,
        presentClasses: PropTypes.number.isRequired,
      }),
      className: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default MarkAttendance;
