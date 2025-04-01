import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect} from 'react';
import {theme} from '../../theme';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {ArrowDownTrayIcon, XMarkIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import {RadioButton, TextInput} from 'react-native-paper';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import email from 'react-native-email';

const Report = ({route}) => {
  const navigation = useNavigation();

  const [modalVisible1, setModalVisible1] = React.useState(false);
  const [modalVisible2, setModalVisible2] = React.useState(false);
  const [thresPerc, setThresPerc] = React.useState(100);
  const [emailList, setEmailList] = React.useState([]);

  useEffect(() => {
    console.log('Report', route.params);
    const studentsBelowThreshold = route.params.recordG
      ?.filter(item => (item.noDaysP * 100) / route.params.totG < thresPerc)
      .map(item => item.name.replace(/\s+/g, '') + '@gmail.com');
    setEmailList(studentsBelowThreshold);
  }, [thresPerc]);

  const [subject, setSubject] = React.useState('');
  const [body, setBody] = React.useState(
    `Dear Student,

I hope this email finds you well. This is to inform you that your current attendance is below ${50}%. Regular attendance is crucial for your continued success, so we encourage you to prioritize attending your scheduled classes/activities.

Please take necessary steps to improve your attendance to meet the required threshold.`,
  );

  const generateHTML = () => {
    if (!route.params.recordG) return '';

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
    ${route.params.recordG
      ?.filter(item => (item.noDaysP * 100) / route.params.totG <= thresPerc)
      .map(
        item => `
        <tr>
          <td>${item.rollNumber}</td>
          <td>${item.name}</td>
          <td>${(item.noDaysP * 100) / route.params.totG.toFixed(2)}%</td>
        </tr>`,
      )
      .join('')}
  </table>
  <h3>Daily Attendance Statistics</h3>
  <table>
    <tr>
      <th>Date</th>
      <th>Present</th>
      <th>Absent</th>
    </tr>
    ${route.params.recordG2
      ?.map(
        dayStat => `
        <tr>
          <td>${new Date(dayStat.date).toISOString().split('T')[0]}</td>
          <td>${dayStat.presentCount}</td>
          <td>${dayStat.absentCount}</td>
        </tr>`,
      )
      .join('')}
  </table>
</body>
</html>
`;

    return html;
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
      Alert.alert('Error', 'Failed to download the report.');
    }
  };

  if (!route.params.recordG) {
    return (
      <View className="flex justify-center items-center h-screen">
        {/* <ActivityIndicator animating={true} color={'black'} /> */}
        <Text className="text-lg text-gray-500 ">Loading report...</Text>
      </View>
    );
  }

  return (
    <>
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

      <ScrollView>
        <View style={styles.container}>
          {/* Overall Class Attendance */}
          {/* <View style={styles.section}>
            <Text style={styles.subHeader}>Overall Class Attendance: {report.overallClassAttendance.toFixed(2)}%</Text>
          </View>
          <ProgressBar progress={report.overallClassAttendance.toFixed(0) / 100} color={theme.maincolor} className="mb-4" /> */}

          {/* <View className="rounded-md border-[#01808c7a] border-2 my-2">
            <View className="flex flex-row w-full justify-around p-4">
              <PieChart
                widthAndHeight={150}
                series={[lowAttStudents, lowAttStudents1, lowAttStudents2]}
                sliceColor={sliceColor2}
                coverRadius={0.45}
                coverFill={'#FFF'}
              />
            </View>
            <View className="flex flex-col items-start p-2">
              <TouchableOpacity className="cursor-pointer p-2 w-full" onPress={() => setPercentage(1)}><View className="flex flex-row items-center" ><View className={`w-4 h-4 mr-2 bg-[${sliceColor2[0]}]`}></View><Text className="text-gray-500 text-[14px]">Attendance less than 60% : {lowAttStudents}</Text></View></TouchableOpacity>
              <TouchableOpacity className="cursor-pointer p-2 w-full" onPress={() => setPercentage(2)}><View className="flex flex-row items-center" ><View className={`w-4 h-4 mr-2 bg-[${sliceColor2[1]}]`}></View><Text className="text-gray-500 text-[14px]">Attendance between 60% & 75%: {lowAttStudents1}</Text></View></TouchableOpacity>
              <TouchableOpacity className="cursor-pointer p-2 w-full" onPress={() => setPercentage(3)}><View className="flex flex-row items-center"><View className={`w-4 h-4 mr-2 bg-[${sliceColor2[2]}]`}></View><Text className="text-gray-500 text-[14px]">Attendance more than 75% : {lowAttStudents2}</Text></View></TouchableOpacity>
            </View>
          </View> */}

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
            {route.params.recordG
              ?.filter(
                item => (item.noDaysP * 100) / route.params.totG <= thresPerc,
              )
              .map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.rollNumber}</Text>
                  <Text style={styles.tableCell1}>{item.name}</Text>
                  <Text style={styles.tableCell2}>
                    {((item.noDaysP * 100) / route.params.totG).toFixed(2)}%
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
                          // cc: ['kraniket123654@gmail.com', 'aniketedits123654@gmail.com'],
                          // bcc: 'mee@mee.com',
                          subject: 'Short Attendance Notice',
                          body: `Dear Student,

I hope this email finds you well. This is to inform you that your current attendance is below ${50}%. Regular attendance is crucial for your continued success, so we encourage you to prioritize attending your scheduled classes/activities.

Please take necessary steps to improve your attendance to meet the required threshold.

Best regards,
[Your Name]
[Your Position/Role]
[Your Contact Information]`,
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

        {/* Daily Statistics */}
        <View style={styles.section}>
          <Text style={styles.subHeader}>Daily Attendance Statistics:</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText1}>Date</Text>
              <Text style={styles.tableHeaderText2}>Present</Text>
              <Text style={styles.tableHeaderText2}>Absent</Text>
            </View>
            {route.params.recordG2?.map((dayStat, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell1}>
                  {new Date(dayStat.date).toISOString().split('T')[0]}
                </Text>
                <Text style={styles.tableCell2}>{dayStat.presentCount}</Text>
                <Text style={styles.tableCell2}>{dayStat.absentCount}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
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
