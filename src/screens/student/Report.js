import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, StatusBar, SafeAreaView } from 'react-native';
import { ActivityIndicator, ProgressBar } from 'react-native-paper';
import { theme } from '../../theme';
import { ArrowDownTrayIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PieChart from 'react-native-pie-chart'
import { useAuth } from '../../utils/auth';
import axios from 'axios';

const StudentReport = () => {
  const [lowAttendanceSubjects, setLowAttendanceSubjects] = useState([]);
  const { rollNumberG, studentNameG, loading, setLoading } = useAuth();
  const [data, setData] = useState();

  const getStudentReport = async () => {
    setLoading(true);
    try {
      // Await the axios post request to set attendance
      const response = await axios.get(`https://attendancetrackerbackend.onrender.com/api/student/attendance/${rollNumberG}`);
      console.log(response.data);
      setData(response.data);

    } catch (error) {
      // Catch any errors and handle them
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudentReport();
  }, [])

  useEffect(() => generateAttendanceReport(), [data]);

  const generateAttendanceReport = () => {
    // Find subjects with attendance less than 75%
    const lowAttendance = data?.filter((subject) => (((subject.numberOfDatesP * 100) / (subject.numberOfDatesP + subject.numberOfDatesA))?.toFixed(2)) < 75);
    setLowAttendanceSubjects(lowAttendance);
  };

  const series = [123, 321, 123, 789, 537]
  const sliceColor = ['#01818C', '#01808c7a', '#01808c2e', '#01808cb9', '#01808c37']

  const generateHTML = () => {
    // Build HTML content for the report
    let html = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: ${theme.maincolor}; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          table, th, td { border: 1px solid #ddd; }
          th, td { padding: 8px; text-align: left; }
          th { background-color: ${theme.maincolor}; color: white; }
          .attendance-section { margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>${studentNameG} (${rollNumberG}) Attendance Report</h1>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Total Classes</th>
              <th>Classes Attended</th>
              <th>Classes Missed</th>
              <th>Attendance (%)</th>
            </tr>
          </thead>
          <tbody>`;

    data.forEach(subject => {
      const attendancePercentage = ((subject.numberOfDatesP * 100) / (subject.numberOfDatesP + subject.numberOfDatesA)).toFixed(2);
      html += `
        <tr>
          <td>${subject.class_name}</td>
          <td>${subject.numberOfDatesP + subject.numberOfDatesA}</td>
          <td>${subject.numberOfDatesP}</td>
          <td>${subject.numberOfDatesA}</td>
          <td>${attendancePercentage}%</td>
        </tr>`;
    });

    html += `
          </tbody>
        </table>
        
        <div class="attendance-section">
          <h2>Subjects with Attendance Less Than 75%</h2>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Attendance (%)</th>
              </tr>
            </thead>
            <tbody>`;

    lowAttendanceSubjects.forEach(subject => {
      const attendancePercentage = ((subject.numberOfDatesP * 100) / (subject.numberOfDatesP + subject.numberOfDatesA)).toFixed(2);
      html += `
        <tr>
          <td>${subject.class_name}</td>
          <td>${attendancePercentage}%</td>
        </tr>`;
    });

    html += `
            </tbody>
          </table>
        </div>
      </body>
      </html>`;

    return html;
  };

  const downloadStudentReport = async () => {
    const options = {
      html: generateHTML(),
      fileName: `Student_Report_${rollNumberG}`,
      directory: 'Download',
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      const newPath = `${RNFS.DownloadDirectoryPath}/Student_Report_${rollNumberG}.pdf`;

      // Move file to download directory
      await RNFS.moveFile(file.filePath, newPath);

      Alert.alert('Report Downloaded', `The report has been moved to: ${newPath}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to download the report.');
    }
  };

  return (
 <>
      <StatusBar
        backgroundColor={theme.maincolor}
        barStyle={"light-content"}
        hidden={false}
      />

      <View style={{ backgroundColor: theme.maincolor, width: wp(100), height: hp(8), justifyContent: 'space-between', alignItems: 'center', display: 'flex', flexDirection: 'row', paddingHorizontal: wp(8) }} >
        <Text style={{ color: 'white', fontSize: wp(5), fontWeight: 500 }} >Students' Report</Text>
        <TouchableOpacity
          onPress={downloadStudentReport}
          style={{ backgroundColor: 'white' }} className="flex justify-center items-center rounded-lg p-3 px-3" >
          <View className="flex flex-row justify-center items-center">
            <ArrowDownTrayIcon color={'#01818C'} size={20} />
            <Text style={{ color: '#01818C', fontSize: wp(3.2), fontWeight: '500', marginLeft: 5 }}>Download Report</Text>
          </View>
        </TouchableOpacity>
      </View>

      {loading && <View className="z-10 w-full p-2 top-[50%] absolute ">
          <ActivityIndicator animating={true} color={'#01808c7a'} size={wp(10)} />
        </View>}

      <ScrollView style={styles.container} className={`opacity-${loading?50:100}`}>
        {/* 
      <View className="m-2 mt-4 rounded-md border-[#01808c7a] border-2">
        <View className="flex flex-row w-full justify-around items-center p-4">
          <PieChart widthAndHeight={150} series={series} sliceColor={sliceColor} />
          <View className="flex flex-col gap-y-2">
            <View className="flex flex-row items-center"><View className={`w-4 h-4 mr-2 bg-[${sliceColor[0]}]`}></View><Text className="text-gray-500">Mathematics : {series[0]}</Text></View>
            <View className="flex flex-row items-center"><View className={`w-4 h-4 mr-2 bg-[#01808c62]`}></View><Text className="text-gray-500">Physics : {series[1]}</Text></View>
            <View className="flex flex-row items-center"><View className={`w-4 h-4 mr-2 bg-[${sliceColor[2]}]`}></View><Text className="text-gray-500">Chemistry : {series[2]}</Text></View>
            <View className="flex flex-row items-center"><View className={`w-4 h-4 mr-2 bg-[${sliceColor[3]}]`}></View><Text className="text-gray-500">Biology : {series[3]}</Text></View>
            <View className="flex flex-row items-center"><View className={`w-4 h-4 mr-2 bg-[#01808c62]`}></View><Text className="text-gray-500">English : {series[4]}</Text></View>
          </View>
        </View>
      </View> */}


        {data?.map((subject, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.subHeader}>{subject.class_name}</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Total Classes:</Text>
              <Text style={styles.value}>{subject.numberOfDatesA + subject.numberOfDatesP}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Classes Attended:</Text>
              <Text style={styles.value}>{subject.numberOfDatesP}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Classes Unattended:</Text>
              <Text style={styles.value}>{subject.numberOfDatesA}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Attendance Percentage:</Text>
              <Text style={styles.value}>{((subject.numberOfDatesP * 100) / (subject.numberOfDatesP + subject.numberOfDatesA))?.toFixed(2)}%</Text>
            </View>

            <ProgressBar progress={((subject.numberOfDatesP) / (subject.numberOfDatesP + subject.numberOfDatesA))} color={theme.maincolor} style={styles.progressBar} />
          </View>
        ))}

        {/* Subjects with attendance less than 75% */}
       {data && <View style={styles.lowAttendanceSection}>
          <Text style={styles.subHeader}>Subjects with Attendance Less Than 75%</Text>
          {lowAttendanceSubjects?.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Subject Name</Text>
                <Text style={styles.tableHeaderText}>Attendance (%)</Text>
              </View>
              {lowAttendanceSubjects?.map((subject, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{subject.class_name}</Text>
                  <Text style={styles.tableCell}>{((subject.numberOfDatesP * 100) / (subject.numberOfDatesP + subject.numberOfDatesA))?.toFixed(2)}%</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noLowAttendanceText}>All subjects have attendance above 75%.</Text>
          )}
        </View>}

      </ScrollView>
    </>
  );
};

export default StudentReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginBottom: 80,
  },
  headerSection: {
    padding: 16,
    backgroundColor: theme.maincolor,
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    margin: 8,
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.maincolor,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'semibold',
  },
  progressBar: {
    marginTop: 8,
    height: 10,
    borderRadius: 5,
  },
  lowAttendanceSection: {
    backgroundColor: '#fff',
    margin: 8,
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  table: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: theme.maincolor,
    padding: 8,
  },
  tableHeaderText: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
  noLowAttendanceText: {
    fontSize: 16,
    color: '#555',
    marginTop: 8,
  },
});
