import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {theme} from '../../theme';
import {CpuChipIcon} from 'react-native-heroicons/outline';

import React, {useEffect, useState} from 'react';

import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../utils/auth';
import axios from 'axios';
import {ActivityIndicator} from 'react-native-paper';
import {BASE_URL} from '../../constants/constants';
import PTRView from 'react-native-pull-to-refresh';

const Home = () => {
  const navigation = useNavigation();
  const {rollNumberG, loading, setLoading, studentidG, setStudentClass} = useAuth();
  const [selectedClass, setSelectedClass] = useState(null);

  const getClassInfo = async () => {
    setLoading(true);
    try {
      console.log('Student ID:', studentidG);
      const response = await axios.get(
        `${BASE_URL}/api/student/classes-info/${studentidG}`,
      );
      setStudentClass(response.data.classes);
      setSelectedClass(response.data.classes);
    } catch (error) {
      ToastAndroid.show(`Something went wrong.`, ToastAndroid.LONG);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getAttendance = async (id, name) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/student/attendance`, {
        class_id: id,
        rollNumber: rollNumberG,
      });
      console.log('Attendance:', response.data);
      navigation.navigate('MarkAttendance', {
        attDataG: response.data.res,
        className: name,
      });
    } catch (error) {
      ToastAndroid.show(`Something went wrong`, ToastAndroid.LONG);
      console.log('From get attendance: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClassInfo();
  }, [studentidG]);

  const refresh = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        getClassInfo();
        resolve();
      }, 2000);
    });
  };

  return (
    <SafeAreaView classItem="relative" style={{marginBottom: hp(10)}}>
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
          Classes
        </Text>
      </View>

      {loading && (
        <View className="z-10 w-full p-2 top-[40%] absolute ">
          <ActivityIndicator
            animating={true}
            color={'#01808c7a'}
            size={wp(10)}
          />
        </View>
      )}

      <PTRView
        onRefresh={refresh}
        scrollEventThrottle={1}
        contentContainerStyle={{flexGrow: 1}}
        style={{
          backgroundColor: '#fff',
          height: hp(100),
          opacity: loading ? 0.5 : 1,
        }}>
        {selectedClass?.map((item, id) => {
          return (
            <TouchableOpacity
              key={item.class_id}
              className="flex flex-row items-center p-4 bg-[#01808c2e] m-4 mb-0 rounded-2xl border-[#01808c7a] border-2"
              onPress={() => {
                console.log('From button: ', item);
                getAttendance(item.class_id, item.classname);
              }}
              disabled={loading}>
              <CpuChipIcon size={wp(8)} color="#01808cb9" />
              <Text
                className="ml-2 text-[15px] font-medium text-gray-600 flex-shrink"
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.classname}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View
          style={{
            backgroundColor: '#fff',
            width: wp(100),
            height: hp(8),
            marginTop: hp(15),
            justifyContent: 'space-between',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            paddingHorizontal: wp(8),
          }}></View>
        {!loading && selectedClass?.length == 0 && (
          <Text className="text-gray-600 text-center pt-4 text-lg">
            You Have Not Been Added In Any Class
          </Text>
        )}
      </PTRView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
