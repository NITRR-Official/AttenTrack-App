import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PTRView from 'react-native-pull-to-refresh';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {theme} from '../../theme';
import {CpuChipIcon} from 'react-native-heroicons/outline';

import * as React from 'react';

import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../utils/auth';
import axios from 'axios';
import {ActivityIndicator} from 'react-native-paper';
import {BASE_URL} from '../../constants/constants';

const ReportHome = () => {
  const navigation = useNavigation();

  const {classes, setClasses, loading, setLoading, teacheridG} = useAuth();

  const getRecord = async id => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/teacher/records`, {
        class_id: id,
        startDate: '2024-10-01',
        endDate: new Date().toDateString(),
      });
      const responseDate = await axios.post(`${BASE_URL}/api/teacher/overall-records`, {
        class_id: id,
        startDate: '2024-10-01',
        endDate: new Date().toDateString(),
      });
      setLoading(false);
      navigation.navigate('Report', {
        recordG: response.data.class_id,
        totG: response.data.totalDays,
        recordG2: response.data.report,
        recordDate: responseDate.data
      });
    } catch (error) {
      ToastAndroid.show(`Something went wrong`, ToastAndroid.LONG);
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    axios
      .get(`${BASE_URL}/api/teacher/classes-info/${teacheridG}`)
      .then(response => {
        setClasses(response.data.classes);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const refresh = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        fetchData();
        resolve();
      }, 2000);
    });
  };

  return (
    <SafeAreaView className="relative">
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
          Monthly Attendance Report
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
        {classes.map((item, id) => {
          return (
            <TouchableOpacity
              key={item.classname}
              className="flex flex-row items-center p-4 bg-[#01808c2e] m-4 mb-0 rounded-2xl border-[#01808c7a] border-2"
              onPress={() => {
                getRecord(item.class_id);
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
      </PTRView>
    </SafeAreaView>
  );
};

export default ReportHome;

const styles = StyleSheet.create({});
