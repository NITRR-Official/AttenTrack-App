import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ToastAndroid,
  ActivityIndicator,
  Switch,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useMemo, useRef} from 'react';
import PropTypes from 'prop-types';
import {theme} from '../../theme';
import {ArrowDownTrayIcon, XMarkIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import {RadioButton, TextInput} from 'react-native-paper';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import email from 'react-native-email';
import {useAuth} from '../../utils/auth';
import axios from 'axios';
import {BASE_URL} from '../../constants/constants';
import PTRView from 'react-native-pull-to-refresh';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Edit = ({close, id, date}) => {
  Edit.propTypes = {
    close: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    date: PropTypes.shape({
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    }).isRequired,
  };

  const [loading, setLoading] = useState(false);
  const [showing, setShowing] = useState(true);
  const [data, setData] = useState([]);
  const previousAttendance = useRef({});
  const [modalVisible, setModalVisible] = useState(false);

  const modifyAttendance = async (id, roll) => {
    try {
      if (roll.length <= 0) {
        close(false, false);
        setLoading(false);
        return;
      }
      const response = await axios.patch(
        `${BASE_URL}/api/attendance/change-specific-record`,
        {
          attendance_id: id,
          datas: roll,
        },
      );
      if (response.status === 200) {
        ToastAndroid.show('Attendance updated successfully', ToastAndroid.LONG);
        close(false, true);
      } else {
        ToastAndroid.show('Attendance not updated', ToastAndroid.SHORT);
        close(false, false);
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      Alert.alert(
        'Error',
        `Failed to update attendance record ${error.message}`,
      );
      close(false, false);
    } finally {
      setLoading(false);
    }
  };

  // console.log(data, data.length)
  const getAttendance = async id => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/attendance/specific-record?id=${id}`,
      );
      if (response.status === 200) {
        console.log(response.data);
        setData(
          Object.entries(response.data).map(([rollNumber, present]) => ({
            rollNumber,
            present,
          })),
        );
        previousAttendance.current = response.data;
      } else {
        console.log(data, data.length);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      Alert.alert('Error', `Failed to fetch attendance data ${error.message}.`);
    } finally {
      setShowing(false);
    }
  };

  const comparator = (lastAttendace, currentAttendance, toSave) => {
    const roll = [];
    currentAttendance.map(item => {
      const lastItem = lastAttendace[item.rollNumber];
      if (item.present != lastItem) {
        roll.push(item.rollNumber);
      }
    });
    console.log('Roll: ', roll);
    if (toSave) {
      modifyAttendance(id, roll);
    }
    return roll.length > 0;
  };

  useEffect(() => {
    getAttendance(id);
  }, []);

  const toggleAttendance = rollNumber => {
    console.log(rollNumber, data);
    setData(prevData =>
      prevData.map(item =>
        item.rollNumber === rollNumber
          ? {...item, present: !item.present}
          : item,
      ),
    );
  };

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: hp(100),
        width: wp(100),
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // semi-transparent black background
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
      }}>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View className="w-full flex-1 bg-[#00000050] flex justify-center">
            <TouchableWithoutFeedback>
              <View className="bg-white p-4 m-4 rounded-3xl">
                <Text className="ml-2 text-[15px] font-medium text-gray-600 flex-shrink">
                  Save before exit ?
                </Text>
                <View className="flex flex-row justify-between mt-5">
                  <TouchableOpacity
                    className="bg-red-400 p-3 w-[100px] rounded-2xl"
                    onPress={() => {
                      comparator(previousAttendance.current, data, true);
                    }}>
                    {loading ? (
                      <ActivityIndicator animating={true} color={'white'} />
                    ) : (
                      <Text className="text-white font-bold text-center">
                        Yes
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-[#01808cc5] p-3 w-[100px] rounded-2xl"
                    onPress={() => close(false, false)}>
                    <Text className="text-white font-bold text-center">No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {showing ? (
        <View className="z-10 w-full p-2 top-[40%] absolute ">
          <ActivityIndicator
            animating={true}
            color={'#01808c7a'}
            size={wp(10)}
          />
        </View>
      ) : (
        <View
          animationType="fade"
          transparent={true}
          visible={true}
          style={{
            height: hp(76),
            width: wp(90),
            position: 'absolute',
            top: hp(5),
            left: wp(5),
            zIndex: 50,
            backgroundColor: '#ffffff',
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: {width: 4, height: 4},
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 5,
          }}>
          {/* Header Buttons */}
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={styles.subHeader} className="mr-1">
              Date and Time :
            </Text>

            <Text style={styles.subHeader} className="mr-1">
              {date.date} {date.time}
            </Text>
          </View>

          {/* Header Row */}
          <View
            style={{
              width: '100%',
              backgroundColor: '#01808c2e',
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderTopWidth: 2,
              borderLeftWidth: 2,
              borderRightWidth: 2,
              borderColor: '#01808c7a',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{width: '75%', color: '#7c7c7c', fontWeight: '500'}}>
                Roll Number
              </Text>
              <Text
                style={{
                  width: '25%',
                  color: '#7c7c7c',
                  textAlign: 'right',
                  fontWeight: '500',
                }}>
                Attendance
              </Text>
            </View>
          </View>

          {/* Scrollable Attendance List */}
          <View
              style={{
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                height: hp(60),
                gap: 12,
                borderWidth: 2,
                borderColor: '#01808c7a',
              }}>

          <ScrollView
            scrollEventThrottle={1}
            contentContainerStyle={{flexGrow: 1}}
            style={{
              backgroundColor: '#fff',
            }}>
              {data && data.length > 0 ? (
                data.map((item, id) => (
                    <View
                      key={item.rollNumber}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 6,
                        borderBottomWidth: 1,
                        borderBottomColor: '#e0e0e0',
                      }}>
                      <Text
                        style={{
                          width: '75%',
                          color: theme.maincolor || '#01808c',
                          fontSize: 16,
                        }}>
                        {item.rollNumber}
                      </Text>

                      <View
                        style={{
                          width: '25%',
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                        }}>
                        <Switch
                          thumbColor={item.present ? '#258a4ac4' : '#c41111c4'}
                          trackColor={{false: '#ffaaaac4', true: '#8bdca8c4'}}
                          onValueChange={() => {
                            toggleAttendance(item.rollNumber);
                          }}
                          value={item.present}
                        />
                        <Text
                          style={{
                            color: '#555',
                            fontWeight: '600',
                            marginLeft: 6,
                          }}>
                          {item.present ? 'P' : 'A'}
                        </Text>
                      </View>
                    </View>
                ))
              ) : (
                <Text style={{textAlign: 'center', color: '#777'}}>
                  No attendance found!
                </Text>
              )}
          </ScrollView>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <TouchableOpacity
              onPress={() => {
                setLoading(true);
                comparator(previousAttendance.current, data, true);
              }}
              style={{
                backgroundColor: theme.maincolor || '#01808c',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 8,
              }}>
              {loading ? (
                <ActivityIndicator animating={true} color={'white'} />
              ) : (
                <Text style={{color: 'white', fontWeight: '600'}}>Save</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (comparator(previousAttendance.current, data, false)) {
                  setModalVisible(true);
                } else close(false, false);
              }}
              style={{
                backgroundColor: '#cccccc',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 8,
              }}>
              <Text style={{color: '#333', fontWeight: '600'}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const Delete = ({close, id}) => {
  Delete.propTypes = {
    close: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
  };
  const [loading, setLoading] = useState(false);
  const deleteAttendance = async id => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/attendance/delete-record?id=${id}`,
      );
      if (response.status === 204) {
        ToastAndroid.show(
          'Attendance record deleted successfully',
          ToastAndroid.LONG,
        );
        close(false, true);
      } else {
        close(false, false);
        ToastAndroid.show('Attendance not deleted', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error deleting attendance:', error);
      Alert.alert(
        'Error',
        `Failed to delete attendance record ${error.message}.`,
      );
      close(false, false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <TouchableWithoutFeedback onPress={() => close(false, false)}>
        <View className="w-full flex-1 bg-[#00000050] flex justify-center">
          <TouchableWithoutFeedback>
            <View className="bg-white p-4 m-4 rounded-3xl">
              <Text className="ml-2 text-[15px] font-medium text-gray-600 flex-shrink">
                Do You Really Want to delete the selected attendance record ?
              </Text>
              <View className="flex flex-row justify-between mt-5">
                <TouchableOpacity
                  className="bg-red-400 p-3 w-[100px] rounded-2xl"
                  onPress={() => {
                    setLoading(true);
                    deleteAttendance(id);
                  }}>
                  {loading ? (
                    <ActivityIndicator animating={true} color={'white'} />
                  ) : (
                    <Text className="text-white font-bold text-center">
                      Yes
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-[#01808cc5] p-3 w-[100px] rounded-2xl"
                  onPress={() => close(false, false)}>
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
  );
};

const Report = ({route}) => {
  const navigation = useNavigation();
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  const [loading, setLoading] = useState(false);
  const [datas, setDatas] = useState(route.params);
  const [edit, setEdit] = useState(false);
  const [thresPerc, setThresPerc] = useState(75);
  const [subject, setSubject] = useState('Short Attendance Notice');
  const [body, setBody] = useState('');
  const [studentsBelowThreshold, setStudentsBelowThreshold] = useState([]);
  const {teacherNameG, telephone, departmentG} = useAuth();
  const attendance_id = useRef('');
  const curr_date = useRef({date: '', time: ''});

  useEffect(() => {
    const threshold = Object.entries(datas.recordG2 || {})?.filter(
      ([, student]) => (student.presentCount * 100) / datas.totG <= thresPerc,
    );

    setStudentsBelowThreshold(threshold);

    setBody(`Dear Student,

I hope this email finds you well. This is to inform you that your current attendance is below ${thresPerc}%. Regular attendance is crucial for your continued success, so we encourage you to prioritize attending your scheduled classes/activities.

Please take necessary steps to improve your attendance to meet the required threshold.

Best regards,
${teacherNameG}
Department: ${departmentG === 'Not Set' ? 'Your Position/Role' : departmentG}
Contact: ${telephone === 'Not Set' ? 'Your Contact Information' : telephone}
`);
  }, [thresPerc, datas]);

  const emailList = useMemo(() => {
    return studentsBelowThreshold.map(([, data]) => data.email);
  }, [studentsBelowThreshold]);

  const generateHTML = () => {
    if (!datas.recordG) return '';

    // Main styles for the PDF
    let html = `
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 10px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
    th { background-color: #f4f4f4; }
    h2 { color: ${theme.maincolor}; }
  </style>
</head>
<body>
  <h2>Attendance Report</h2>
  <h3>Students with Attendance Under ${thresPerc}%</h3>
  <table>
    <tr>
      <th>Roll Number</th>
      <th>Name</th>
      <th>Attendance (%)</th>
    </tr>
      ${studentsBelowThreshold.map(
        ([rollNumber, item]) => `
      <tr>
        <td>${rollNumber}</td>
        <td>${item.name || 'Unknown'}</td>
        <td>${((item.presentCount * 100) / datas.totG).toFixed(2)}%</td>
      </tr>`,
      )}
  </table>
  <h3>Daily Attendance Statistics</h3>
  <table>
    <tr>
      <th>Date</th>
      <th>Time</th>
      <th>Present</th>
      <th>Absent</th>
    </tr>
      ${datas.recordDate.map(
        ({date, time, presentCount, absentCount}) =>
          `<tr>
                  <td>${date}</td>
                  <td>${time}</td>
                  <td>${presentCount}</td>
                  <td>${absentCount}</td>
                </tr>`,
      )}
  </table>
</body>
</html>
`;

    return html;
  };

  const getRecord = async id => {
    try {
      const response = await axios.post(`${BASE_URL}/api/teacher/records`, {
        class_id: id,
        startDate: '2024-10-01',
        endDate: new Date().toDateString(),
      });
      const responseDate = await axios.post(
        `${BASE_URL}/api/teacher/overall-records`,
        {
          class_id: id,
          startDate: '2024-10-01',
          endDate: new Date().toDateString(),
        },
      );
      setDatas({
        recordG: response.data.class_id,
        totG: response.data.totalDays,
        recordG2: response.data.report,
        recordDate: responseDate.data,
      });
    } catch (error) {
      ToastAndroid.show(`Something went wrong`, ToastAndroid.LONG);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (close, success) => {
    if (success) {
      refresh();
    }
    setEdit(close);
  };

  const handleDeleteClose = (close, success) => {
    if (success) {
      refresh();
    }
    setModalVisible4(close);
  };

  // Function to generate and download the PDF
  const downloadReport = async () => {
    const options = {
      html: generateHTML(),
      fileName: 'Class_Attendance_Report',
      directory: 'Download',
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      const newPath = `${RNFS.DownloadDirectoryPath}/Class_Attendance_Report.pdf`;

      // Move file to download directory
      await RNFS.moveFile(file.filePath, newPath);

      Alert.alert(
        'Report Downloaded',
        `The report has been moved to: ${newPath}`,
      );
    } catch (error) {
      Alert.alert('Error', `Failed to download the report, ${error.message}`);
    }
  };

  if (!datas.recordG) {
    return (
      <View className="flex justify-center items-center h-screen">
        {/* <ActivityIndicator animating={true} color={'black'} /> */}
        <Text className="text-lg text-gray-500 ">Loading report...</Text>
      </View>
    );
  }

  const refresh = () => {
    setLoading(true);
    return new Promise(resolve => {
      setTimeout(() => {
        getRecord(route.params.id);
        resolve();
      }, 2000);
    });
  };

  return (
    <>
      {edit && (
        <Edit
          close={handleClose}
          id={attendance_id.current}
          date={curr_date.current}
        />
      )}

      <View className="w-full flex flex-row justify-between items-center p-4">
        <TouchableOpacity>
          <XMarkIcon
            size={wp(8)}
            color={theme.maincolor}
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={downloadReport}
          style={{backgroundColor: theme.maincolor}}
          className="flex justify-center items-center rounded-lg p-3 px-4">
          <View className="flex flex-row justify-center items-center">
            <ArrowDownTrayIcon color={'white'} size={20} />
            <Text
              style={{
                color: '#fff',
                fontSize: wp(3.2),
                fontWeight: '700',
                marginLeft: 5,
              }}>
              Download Report
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="z-10 w-full p-2 top-[40%] absolute ">
          <ActivityIndicator
            animating={true}
            color={'#01808c7a'}
            size={wp(10)}
          />
        </View>
      ) : (
        <PTRView onRefresh={refresh}>
          <View style={styles.container}>
            <View className="flex flex-row items-center p-1">
              <Text style={styles.subHeader} className="mr-1">
                Students with Attendance{' '}
              </Text>
              <TouchableOpacity
                className={`border-[${theme.maincolor}] border-2 rounded-lg`}
                onPress={() => {
                  setModalVisible2(true);
                }}>
                <Text
                  className={` p-2 px-4 text-[15px] text-[${theme.maincolor}] font-bold rounded-lg`}>
                  &lt;= {thresPerc} %
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                className={`bg-[${theme.maincolor}] p-2 rounded-lg w-[120px]`}
                onPress={() => setModalVisible1(true)}>
                <Text className={`text-white font-bold text-center`}>
                  Send Email
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Roll Number</Text>
                <Text style={styles.tableHeaderText}>Name</Text>
                <Text style={styles.tableHeaderText}>Attendance (%)</Text>
              </View>
              {studentsBelowThreshold.map(([rollNumber, data], index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{rollNumber}</Text>
                  <Text style={styles.tableCell1}>
                    {data.name || 'Unknown'}
                  </Text>
                  <Text style={styles.tableCell2}>
                    {((data.presentCount * 100) / datas.totG).toFixed(2)}%
                  </Text>
                </View>
              ))}
            </View>
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
                      <RadioButton.Group
                        onValueChange={value => {
                          setModalVisible2(false);
                          setThresPerc(parseInt(value));
                        }}>
                        <RadioButton.Item
                          labelStyle={{color: '#6a6a6a'}}
                          label="<= 10%"
                          value="10"
                        />
                        <RadioButton.Item
                          labelStyle={{color: '#6a6a6a'}}
                          label="<= 20%"
                          value="20"
                        />
                        <RadioButton.Item
                          labelStyle={{color: '#6a6a6a'}}
                          label="<= 30%"
                          value="30"
                        />
                        <RadioButton.Item
                          labelStyle={{color: '#6a6a6a'}}
                          label="<= 40%"
                          value="40"
                        />
                        <RadioButton.Item
                          labelStyle={{color: '#6a6a6a'}}
                          label="<= 50%"
                          value="50"
                        />
                        <RadioButton.Item
                          labelStyle={{color: '#6a6a6a'}}
                          label="<= 60%"
                          value="60"
                        />
                        <RadioButton.Item
                          labelStyle={{color: '#6a6a6a'}}
                          label="<= 70%"
                          value="70"
                        />
                        <RadioButton.Item
                          labelStyle={{color: '#6a6a6a'}}
                          label="<= 75%"
                          value="75"
                        />
                        <RadioButton.Item
                          labelStyle={{color: '#6a6a6a'}}
                          label="<= 100%"
                          value="100"
                        />
                      </RadioButton.Group>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
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
                    {/* <Text className="ml-2 text-[15px] font-medium text-gray-600 flex-shrink">yoyo</Text> */}
                    <TextInput
                      className="h-[40px] my-2 rounded-none rounded-t-lg"
                      onChangeText={setSubject}
                      value={subject}
                      placeholder="Enter Subject Here"
                    />
                    <TextInput
                      className=" rounded-none"
                      onChangeText={setBody}
                      value={body}
                      placeholder="Enter Body Here"
                      multiline={true}
                      numberOfLines={6} // Adjust this value to control the height of the text area
                      style={{textAlignVertical: 'top'}} // Ensures the text starts at the top
                    />
                    <View className="flex flex-row justify-between mt-5">
                      <TouchableOpacity
                        className=" bg-red-400  p-3 w-[100px] rounded-2xl "
                        onPress={() => setModalVisible1(false)}>
                        <Text className="text-white font-bold text-center">
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-[#01808cc5] p-3 w-[100px] rounded-2xl "
                        onPress={() => {
                          email(emailList, {
                            subject: subject,
                            body: body,
                            checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
                          }).catch(console.error);
                        }}>
                        <Text className="text-white font-bold text-center">
                          Send
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {modalVisible4 && (
            <Delete close={handleDeleteClose} id={attendance_id.current} />
          )}

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible3}
            onRequestClose={() => {
              setModalVisible3(!modalVisible3);
            }}>
            <TouchableWithoutFeedback onPress={() => setModalVisible3(false)}>
              <View className="w-full flex-1 bg-[#00000050] flex justify-center">
                <TouchableWithoutFeedback>
                  <View className="bg-white p-4 m-4 rounded-3xl">
                    <Text className="ml-2 text-[15px] font-medium text-gray-600 flex-shrink">
                      Please select the attendance modification option:
                    </Text>
                    <View className="flex flex-row justify-between mt-5">
                      <TouchableOpacity
                        className="bg-red-400 p-3 w-[100px] rounded-2xl"
                        onPress={() => {
                          setEdit(true);
                          setModalVisible3(false);
                        }}>
                        <Text className="text-white font-bold text-center">
                          Modify
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-red-400 p-3 w-[100px] rounded-2xl"
                        onPress={() => {
                          setModalVisible3(false);
                          setModalVisible4(true);
                        }}>
                        <Text className="text-white font-bold text-center">
                          Delete
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-[#01808cc5] p-3 w-[100px] rounded-2xl"
                        onPress={() => setModalVisible3(false)}>
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

          {/* Daily Statistics */}
          <View style={styles.section}>
            <Text style={styles.subHeader}>Daily Attendance Statistics:</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText1}>Date</Text>
                <Text style={styles.tableHeaderText1}>Time</Text>
                <Text style={styles.tableHeaderText2}>Present</Text>
                <Text style={styles.tableHeaderText2}>Absent</Text>
              </View>
              {datas.recordDate.map(
                ({date, time, id, presentCount, absentCount}, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      attendance_id.current = id;
                      curr_date.current = {date, time};
                      setModalVisible3(true);
                    }}
                    key={index}
                    style={styles.tableRow}>
                    <Text style={styles.tableCell1}>{date}</Text>
                    <Text style={styles.tableCell1}> {time} </Text>
                    <Text style={styles.tableCell2}>{presentCount}</Text>
                    <Text style={styles.tableCell3}>{absentCount}</Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          </View>
        </PTRView>
      )}
    </>
  );
};

Report.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      recordG: PropTypes.string,
      recordG2: PropTypes.object,
      recordDate: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string.isRequired,
          presentCount: PropTypes.number.isRequired,
          absentCount: PropTypes.number.isRequired,
        }),
      ),
      totG: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Report;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 0,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: theme.maincolor,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
    justifyContent: 'space-between', // Align text properly
  },
  count: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#e74c3c', // Highlighting low attendance count
  },
  studentText: {
    fontSize: 14,
    color: 'gray',
  },
  attendancePercentage: {
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: theme.maincolor,
    padding: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  tableHeaderText1: {
    flex: 3,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    width: wp(60),
  },
  tableHeaderText2: {
    flex: 1.4,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    width: wp(20),
  },
  tableHeaderText3: {
    flex: 2,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    width: wp(40),
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: 'gray',
  },
  tableCell1: {
    flex: 3,
    textAlign: 'center',
    color: 'gray',
    width: wp(60),
  },
  tableCell2: {
    flex: 1,
    textAlign: 'center',
    color: 'gray',
    width: wp(20),
  },
  tableCell3: {
    flex: 1.4,
    textAlign: 'center',
    color: 'gray',
    width: wp(30),
  },
});
