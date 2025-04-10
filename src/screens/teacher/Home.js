import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  ToastAndroid,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {theme} from '../../theme';
import {
  CpuChipIcon,
  PlusCircleIcon,
  TrashIcon,
} from 'react-native-heroicons/outline';
import PTRView from 'react-native-pull-to-refresh';

import React, {useEffect, useState} from 'react';

import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../utils/auth';
import axios from 'axios';
import {ActivityIndicator} from 'react-native-paper';
import {BASE_URL} from '../../constants/constants';
const Home = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const {
    classes,
    setClasses,
    loading,
    setLoading,
    teacheridG,
    teacherNameG,
    refreshing,
    setRefreshing,
  } = useAuth();

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

  useEffect(() => {
    if (refreshing) {
      setLoading(true);
      fetchData();
      setRefreshing(false);
    }
  }, [refreshing]);

  const deleteClass = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/api/class/remove/${
          classes.find(cls => cls.classname === selectedClass).class_id
        }`,
      );
      setClasses(prevClasses =>
        prevClasses.filter(item2 => item2.classname !== selectedClass),
      );
      ToastAndroid.show(
        `${selectedClass} Deleted Successfully !`,
        ToastAndroid.LONG,
      );
    } catch (error) {
      ToastAndroid.show(
        `Something went wrong and we couldn't remove the class.`,
        ToastAndroid.LONG,
      );
      console.log(error);
    }
  };

  const getList = async (id, name) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/class/getList/${id}`);
      navigation.navigate('Sheet', {
        jsonGlobalData: response.data.students,
        id: id,
        classname: name,
        teacherName: teacherNameG,
      });
    } catch (error) {
      ToastAndroid.show(
        `Something went wrong and we couldn't get the list.`,
        ToastAndroid.LONG,
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const navigation = useNavigation();

  const [modalVisible1, setModalVisible1] = useState(false);

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
          Classes
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate('CreateClass')}>
          <PlusCircleIcon size={wp(8)} color="#fff" />
        </TouchableOpacity>
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
              key={id}
              disabled={loading}
              className="flex flex-row items-center p-4 bg-[#01808c2e] m-4 mb-0 rounded-2xl border-[#01808c7a] border-2"
              onPress={() => {
                getList(item.class_id, item.classname);
              }}>
              <CpuChipIcon size={wp(8)} color="#01808cb9" />
              <Text
                className="ml-2 text-[15px] font-medium text-gray-600 flex-shrink"
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.classname}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setModalVisible1(true);
                  setSelectedClass(item.classname);
                }}
                style={{marginLeft: 'auto'}}>
                <TrashIcon size={wp(6)} color="red" />
              </TouchableOpacity>
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

        {classes.length == 0 && (
          <Text className="text-gray-600 text-center pt-4 text-lg">
            No Class is Created Yet
          </Text>
        )}

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
                    Do You Really Want to This Class : {selectedClass}
                  </Text>
                  <View className="flex flex-row justify-between mt-5">
                    <TouchableOpacity
                      className="bg-red-400 p-3 w-[100px] rounded-2xl"
                      onPress={() => {
                        deleteClass();
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
      </PTRView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
