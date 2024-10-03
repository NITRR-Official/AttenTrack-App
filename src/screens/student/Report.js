import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { ProgressBar } from 'react-native-paper';
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

// Mock data for demonstration purposes
const subjectsData = [
  { subjectCode: 'SUBJ101', subjectName: 'Mathematics' },
  { subjectCode: 'SUBJ102', subjectName: 'Physics' },
  { subjectCode: 'SUBJ103', subjectName: 'Chemistry' },
  { subjectCode: 'SUBJ104', subjectName: 'Biology' },
  { subjectCode: 'SUBJ105', subjectName: 'English' },
];

// Sample attendance data for the student
const studentAttendanceData = [
  {
    subjectCode: 'SUBJ101',
    totalClasses: 40,
    classesAttended: 35,
  },
  {
    subjectCode: 'SUBJ102',
    totalClasses: 38,
    classesAttended: 28,
  },
  {
    subjectCode: 'SUBJ103',
    totalClasses: 42,
    classesAttended: 31,
  },
  {
    subjectCode: 'SUBJ104',
    totalClasses: 36,
    classesAttended: 27,
  },
  {
    subjectCode: 'SUBJ105',
    totalClasses: 40,
    classesAttended: 40,
  },
];

const StudentReport = () => {
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [lowAttendanceSubjects, setLowAttendanceSubjects] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    generateAttendanceReport();
  }, []);

  const generateAttendanceReport = () => {
    const report = studentAttendanceData.map((data) => {
      const subject = subjectsData.find((subj) => subj.subjectCode === data.subjectCode);
      const classesUnattended = data.totalClasses - data.classesAttended;
      const attendancePercentage = (data.classesAttended / data.totalClasses) * 100;

      return {
        ...data,
        subjectName: subject.subjectName,
        classesUnattended,
        attendancePercentage,
      };
    });

    setAttendanceReport(report);

    // Find subjects with attendance less than 75%
    const lowAttendance = report.filter((item) => item.attendancePercentage < 75);
    setLowAttendanceSubjects(lowAttendance);
  };

  // Function to generate HTML content for the student report
  const generateStudentReportHTML = () => {
    let htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h1 {
            color: ${theme.maincolor};
            text-align: center;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
          }
          th {
            background-color: ${theme.maincolor};
            color: white;
          }
          .low-attendance {
            color: #c41111c4;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h1>Student Attendance Report</h1>
        <table>
          <thead>
            <tr>
              <th>Subject Name</th>
              <th>Subject Code</th>
              <th>Total Classes</th>
              <th>Classes Attended</th>
              <th>Classes Unattended</th>
              <th>Attendance Percentage</th>
            </tr>
          </thead>
          <tbody>`;

    // Loop over each subject and append row to the table
    attendanceReport.forEach((subject) => {
      htmlContent += `
      <tr>
        <td>${subject.subjectName}</td>
        <td>${subject.subjectCode}</td>
        <td>${subject.totalClasses}</td>
        <td>${subject.classesAttended}</td>
        <td>${subject.classesUnattended}</td>
        <td>${subject.attendancePercentage.toFixed(2)}%</td>
      </tr>`;
    });

    htmlContent += `
          </tbody>
        </table>`;

    // If there are subjects with low attendance, add a section for them
    if (lowAttendanceSubjects.length > 0) {
      htmlContent += `
      <h2>Subjects with Attendance Less Than 75%</h2>
      <table>
        <thead>
          <tr>
            <th>Subject Code</th>
            <th>Subject Name</th>
            <th>Attendance (%)</th>
          </tr>
        </thead>
        <tbody>`;

      lowAttendanceSubjects.forEach((subject) => {
        htmlContent += `
        <tr class="low-attendance">
          <td>${subject.subjectCode}</td>
          <td>${subject.subjectName}</td>
          <td>${subject.attendancePercentage.toFixed(2)}%</td>
        </tr>`;
      });

      htmlContent += `
        </tbody>
      </table>`;
    } else {
      htmlContent += `<p>All subjects have attendance above 75%.</p>`;
    }

    htmlContent += `
      </body>
    </html>`;

    return htmlContent;
  };


  // Function to generate and download the student-specific PDF report
  const downloadStudentReport = async () => {
    const options = {
      html: generateStudentReportHTML(),
      fileName: `Attendance_Report`,
      directory: 'Documents',
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      const newPath = `${RNFS.DownloadDirectoryPath}/Attendance_Report.pdf`;

      // Move file to download directory
      await RNFS.moveFile(file.filePath, newPath);

      Alert.alert('Report Downloaded', `The report has been saved to: ${newPath}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to download the report.');
    }
  };

  const series = [123, 321, 123, 789, 537]
  const series2 = [300, 30]
  const sliceColor = ['#01818C', '#01808c7a', '#01808c2e', '#01808cb9', '#01808c37']
  const sliceColor2 = ['#258a4ac4', '#c41111c4']

  return (
    <>

<StatusBar
        backgroundColor={theme.maincolor}
        barStyle={"light-content"}
        hidden={false}
      />

      <View style={{ backgroundColor: theme.maincolor, width: wp(100), height: hp(8), justifyContent: 'space-between', alignItems: 'center', display: 'flex', flexDirection: 'row', paddingHorizontal: wp(8) }} >
        <Text style={{ color: 'white', fontSize: wp(5), fontWeight:500 }} >Students' Report</Text>
        <TouchableOpacity onPress={downloadStudentReport} style={{ backgroundColor: 'white' }} className="flex justify-center items-center rounded-lg p-3 px-3" >
          <View className="flex flex-row justify-center items-center">
            <ArrowDownTrayIcon color={'#01818C'} size={20} />
            <Text style={{ color: '#01818C', fontSize: wp(3.2), fontWeight: '500', marginLeft: 5 }}>Download Report</Text>
          </View>
        </TouchableOpacity>
      </View> 

      <ScrollView style={styles.container}>

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
      </View>


      {attendanceReport.map((subject, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.subHeader}>{subject.subjectName} ({subject.subjectCode})</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Total Classes:</Text>
            <Text style={styles.value}>{subject.totalClasses}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Classes Attended:</Text>
            <Text style={styles.value}>{subject.classesAttended}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Classes Unattended:</Text>
            <Text style={styles.value}>{subject.classesUnattended}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Attendance Percentage:</Text>
            <Text style={styles.value}>{subject.attendancePercentage.toFixed(2)}%</Text>
          </View>

          <ProgressBar progress={subject.attendancePercentage / 100} color={theme.maincolor} style={styles.progressBar} />
        </View>
      ))}

      {/* Subjects with attendance less than 75% */}
      <View style={styles.lowAttendanceSection}>
        <Text style={styles.subHeader}>Subjects with Attendance Less Than 75%</Text>
        {lowAttendanceSubjects.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Subject Code</Text>
              <Text style={styles.tableHeaderText}>Subject Name</Text>
              <Text style={styles.tableHeaderText}>Attendance (%)</Text>
            </View>
            {lowAttendanceSubjects.map((subject, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{subject.subjectCode}</Text>
                <Text style={styles.tableCell}>{subject.subjectName}</Text>
                <Text style={styles.tableCell}>{subject.attendancePercentage.toFixed(2)}%</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noLowAttendanceText}>All subjects have attendance above 75%.</Text>
        )}
      </View>

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
