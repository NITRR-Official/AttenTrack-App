import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity, SafeAreaView, Modal, TouchableWithoutFeedback, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import { studentsData } from './studentsData'; // Assuming the studentsData is imported from this file
import { theme } from '../../theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ArrowDownTrayIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Button, ProgressBar, TextInput } from 'react-native-paper';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs'; // For managing files
import PieChart from 'react-native-pie-chart';
import email from 'react-native-email';

const Report = () => {
  const [report, setReport] = useState(null);

  const [percent, setPercentage] = useState(0);
  const [lowAttStudents, setLowAttStudents] = useState(0);
  const [lowAttStudents1, setLowAttStudents1] = useState(0);
  const [lowAttStudents2, setLowAttStudents2] = useState(0);
  const sliceColor2 = ['#c41111c4', '#01808cb9', '#258a4ac4'];

  const navigation = useNavigation();

  const [modalVisible1, setModalVisible1] = React.useState(false);

  const [subject, setSubject] = React.useState('');
  const [body, setBody] = React.useState(
    `Dear Student,

I hope this email finds you well. This is to inform you that your current attendance is below ${50}%. Regular attendance is crucial for your continued success, so we encourage you to prioritize attending your scheduled classes/activities.

Please take necessary steps to improve your attendance to meet the required threshold.`);

  // Helper function to format dates as "1st August, 2024"
  const formatDate = (date) => {
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3) ? 0 : (day % 100 - day % 10 !== 10) * day % 10];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}${suffix} ${month}, ${year}`;
  };

  // Function to generate random attendance for the month starting from a given date
  const generateMonthlyAttendance = (startDate, numDays = 30) => {
    const monthAttendance = [];
    const currentDate = new Date(startDate);

    for (let day = 1; day <= numDays; day++) {
      const dailyAttendance = studentsData.map(student => ({
        ...student,
        ATTENDANCE: Math.random() < 0.7 // 70% chance a student is present
      }));
      monthAttendance.push({ date: new Date(currentDate), attendance: dailyAttendance });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return monthAttendance;
  };

  // Function to calculate statistics and generate the monthly report
  const generateMonthlyReport = (monthlyAttendance, attendanceThreshold = 0.75) => {
    const totalDays = monthlyAttendance.length;
    const totalStudents = studentsData.length;

    const dailyStats = monthlyAttendance.map(dayData => {
      const presentCount = dayData.attendance.filter(student => student.ATTENDANCE).length;
      const absentCount = totalStudents - presentCount;

      return {
        date: formatDate(dayData.date),
        presentCount,
        absentCount
      };
    });

    const studentAttendanceCount = studentsData.map(student => {
      const presentDays = monthlyAttendance.filter(dayData =>
        dayData.attendance.find(s => s.rollNumber === student.rollNumber)?.ATTENDANCE
      ).length;

      return {
        ...student,
        attendancePercentage: (presentDays / totalDays) * 100,
        presentDays,
        absentDays: totalDays - presentDays
      };
    });

    // const lowAttendanceStudents = studentAttendanceCount.filter(student => student.attendancePercentage < 60);
    const lowAttendanceStudents = studentAttendanceCount.filter(student => parseInt(student.ROLLNO) < 21117030);
    setLowAttStudents(lowAttendanceStudents.length)
    // const lowAttendanceStudents1 = studentAttendanceCount.filter(student => student.attendancePercentage < 75 && student.attendancePercentage > 60);
    const lowAttendanceStudents1 = studentAttendanceCount.filter(student => parseInt(student.ROLLNO) >= 21117060 && parseInt(student.ROLLNO) < 21117090);
    setLowAttStudents1(lowAttendanceStudents1.length)
    // const lowAttendanceStudents2 = studentAttendanceCount.filter(student => student.attendancePercentage > 75);
    const lowAttendanceStudents2 = studentAttendanceCount.filter(student => parseInt(student.ROLLNO) >= 21117090);
    setLowAttStudents2(lowAttendanceStudents2.length)

    // Sort students by attendance for top 10 and bottom 10
    const sortedStudents = [...studentAttendanceCount].sort((a, b) => b.attendancePercentage - a.attendancePercentage);
    const top10Students = sortedStudents.slice(0, 10);
    const bottom10Students = sortedStudents.slice(-10);

    const dayWithMostAttendance = dailyStats.reduce((max, day) => day.presentCount > max.presentCount ? day : max, dailyStats[0]);
    const dayWithLeastAttendance = dailyStats.reduce((min, day) => day.presentCount < min.presentCount ? day : min, dailyStats[0]);

    const overallClassAttendance = dailyStats.reduce((total, day) => total + day.presentCount, 0) / (totalDays * totalStudents) * 100;

    return {
      dailyStats,
      studentAttendanceCount,
      lowAttendanceStudents,
      lowAttendanceStudents1,
      lowAttendanceStudents2,
      top10Students,
      bottom10Students,
      dayWithMostAttendance,
      dayWithLeastAttendance,
      overallClassAttendance
    };
  };

  // UseEffect to generate the report when the component mounts
  useEffect(() => {
    const startDate = new Date(2024, 7, 1); // August 1st, 2024
    const monthlyAttendance = generateMonthlyAttendance(startDate, 30);
    const generatedReport = generateMonthlyReport(monthlyAttendance, 0.75); // 75% threshold
    setReport(generatedReport);
  }, []);

  // Function to convert the report to HTML for PDF generation
  const generateHTML = () => {
    if (!report) return '';

    // Main styles for the PDF
    let html = `
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 16px;
          color: #333;
        }
        h1 {
          text-align: center;
          color: ${theme.maincolor};
          font-size: 24px;
        }
        h2, h3 {
          color: ${theme.maincolor};
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
        }
        th {
          background-color: ${theme.maincolor};
          color: white;
          font-weight: bold;
        }
        .section {
          margin-bottom: 24px;
        }
        .progress-bar {
          width: 100%;
          background-color: #f3f3f3;
          height: 20px;
          border-radius: 5px;
          margin-bottom: 16px;
        }
        .progress-bar-fill {
          height: 100%;
          background-color: ${theme.maincolor};
          width: ${report.overallClassAttendance.toFixed(0)}%;
          border-radius: 5px;
        }
        .low-attendance, .top-students, .bottom-students, .all-students {
          margin-top: 16px;
        }
        .count {
          color: #e74c3c;
          font-weight: bold;
        }
      </style>
  
      <h1>Class Attendance Report</h1>
  
      <div class="section">
        <h2>Overall Class Attendance: ${report.overallClassAttendance.toFixed(2)}%</h2>
        <div class="progress-bar">
          <div class="progress-bar-fill"></div>
        </div>
      </div>
  
      <div class="section">
        <h3>Daily Attendance Statistics:</h3>
        <table>
          <tr>
            <th>Date</th>
            <th>Present</th>
            <th>Absent</th>
          </tr>`;

    // Adding Daily Attendance Stats
    report.dailyStats.forEach(dayStat => {
      html += `
        <tr>
          <td>${dayStat.date}</td>
          <td>${dayStat.presentCount}</td>
          <td>${dayStat.absentCount}</td>
        </tr>`;
    });

    html += `
        </table>
      </div>
  
      <div class="low-attendance section">
        <h3>Students with Attendance Less Than 75%:</h3>
        <p class="count">Number of students: ${report.lowAttendanceStudents.length}</p>
        <table>
          <tr>
            <th>Roll Number</th>
            <th>Name</th>
            <th>Attendance (%)</th>
          </tr>`;

    report.lowAttendanceStudents.forEach(student => {
      html += `
        <tr>
          <td>${student.ROLLNO}</td>
          <td>${student.STUDNAME}</td>
          <td>${student.attendancePercentage.toFixed(2)}%</td>
        </tr>`;
    });

    html += `
        </table>
      </div>
  
      <div class="top-students section">
        <h3>Top 10 Students by Attendance:</h3>
        <table>
          <tr>
            <th>Roll Number</th>
            <th>Name</th>
            <th>Attendance (%)</th>
          </tr>`;

    report.top10Students.forEach(student => {
      html += `
        <tr>
          <td>${student.ROLLNO}</td>
          <td>${student.STUDNAME}</td>
          <td>${student.attendancePercentage.toFixed(2)}%</td>
        </tr>`;
    });

    html += `
        </table>
      </div>
  
      <div class="bottom-students section">
        <h3>Bottom 10 Students by Attendance:</h3>
        <table>
          <tr>
            <th>Roll Number</th>
            <th>Name</th>
            <th>Attendance (%)</th>
          </tr>`;

    report.bottom10Students.forEach(student => {
      html += `
        <tr>
          <td>${student.ROLLNO}</td>
          <td>${student.STUDNAME}</td>
          <td>${student.attendancePercentage.toFixed(2)}%</td>
        </tr>`;
    });

    html += `
        </table>
      </div>
  
      <div class="all-students section">
        <h3>All Students' Attendance:</h3>
        <table>
          <tr>
            <th>Roll Number</th>
            <th>Name</th>
            <th>Present</th>
            <th>Absent</th>
          </tr>`;

    report.studentAttendanceCount.forEach(student => {
      html += `
        <tr>
          <td>${student.ROLLNO}</td>
          <td>${student.STUDNAME}</td>
          <td>${student.presentDays}</td>
          <td>${student.absentDays}</td>
        </tr>`;
    });

    html += `
        </table>
      </div>`;

    return html;
  };

  // Function to generate and download the PDF
  const downloadReport = async () => {
    const options = {
      html: generateHTML(),
      fileName: 'Class_Attendance_Report',
      directory: 'Documents',
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      const newPath = `${RNFS.DownloadDirectoryPath}/Class_Attendance_Report.pdf`;

      // Move file to download directory
      await RNFS.moveFile(file.filePath, newPath);

      Alert.alert('Report Downloaded', `The report has been moved to: ${newPath}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to download the report.');
    }
  };


  if (!report) {
    return <View className="flex justify-center items-center h-screen">
      {/* <ActivityIndicator animating={true} color={'black'} /> */}
      <Text className="text-lg text-gray-500 ">Loading report...</Text></View>;
  }

  return (
    <>
      <View className="w-full flex flex-row justify-between items-center p-4">
        <TouchableOpacity>
          <XMarkIcon size={wp(8)} color={theme.maincolor} onPress={() => navigation.goBack()} />
        </TouchableOpacity>
        <TouchableOpacity onPress={downloadReport} style={{ backgroundColor: theme.maincolor }} className="flex justify-center items-center rounded-lg p-3 px-4" >
          <View className="flex flex-row justify-center items-center">
            <ArrowDownTrayIcon color={'white'} size={20} />
            <Text style={{ color: '#fff', fontSize: wp(3.2), fontWeight: '700', marginLeft: 5 }}>Download Report</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView>

        <View style={styles.container}>
          {/* Overall Class Attendance */}
          <View style={styles.section}>
            <Text style={styles.subHeader}>Overall Class Attendance: {report.overallClassAttendance.toFixed(2)}%</Text>
          </View>
          <ProgressBar progress={report.overallClassAttendance.toFixed(0) / 100} color={theme.maincolor} className="mb-4" />

          <View className="rounded-md border-[#01808c7a] border-2 my-2">
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
          </View>

          {/* Daily Statistics */}
          {/* <View style={styles.section}>
            <Text style={styles.subHeader}>Daily Attendance Statistics:</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText1}>Date</Text>
                <Text style={styles.tableHeaderText2}>Present</Text>
                <Text style={styles.tableHeaderText2}>Absent</Text>
              </View>
              {report.dailyStats.map((dayStat, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell1}>{dayStat.date}</Text>
                  <Text style={styles.tableCell2}>{dayStat.presentCount}</Text>
                  <Text style={styles.tableCell2}>{dayStat.absentCount}</Text>
                </View>
              ))}
            </View>
          </View> */}


          {/* Low Attendance Students */}
          {percent == 1 && <View style={styles.section}>
            <Text style={styles.subHeader}>Students with Attendance Less Than 60% :</Text>
            <View className="flex flex-row justify-between items-center mb-1">
              <Text style={styles.count}>
                Number of students: <Text style={{ fontWeight: 'bold' }}>{report.lowAttendanceStudents.length}</Text>
              </Text>
              <TouchableOpacity onPress={() =>{
                // setModalVisible1(true);
                email(['kraniket123654@gmail.com', 'aniketedits123654@gmail.com'], {
                  // cc: ['kraniket123654@gmail.com', 'aniketedits123654@gmail.com'],
                  // bcc: 'mee@mee.com',
                  subject: 'Short Attendance Notice',
                  body: body,
                  checkCanOpen: false // Call Linking.canOpenURL prior to Linking.openURL
                }).catch(console.error);
              }} className="bg-[#01808ce0] w-[100px] p-2 rounded-lg "><Text className="text-white font-extrabold text-center">Send Email</Text></TouchableOpacity>
            </View>
            {report.lowAttendanceStudents.length > 0 ? (
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>Roll Number</Text>
                  <Text style={styles.tableHeaderText}>Name</Text>
                  <Text style={styles.tableHeaderText}>Attendance (%)</Text>
                </View>
                {report.lowAttendanceStudents.map((student, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{student.ROLLNO}</Text>
                    <Text style={styles.tableCell1}>{student.STUDNAME}</Text>
                    <Text style={styles.tableCell2}>{student.attendancePercentage.toFixed(2)}%</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.studentText}>All students have more than 75% attendance.</Text>
            )}
          </View>}
          {percent == 2 && <View style={styles.section}>
            <Text style={styles.subHeader}>Students with Attendance Between Than 60% and 75% :</Text>
            <View className="flex flex-row justify-between items-center mb-1">
              <Text style={styles.count}>
                Number of students: <Text style={{ fontWeight: 'bold' }}>{report.lowAttendanceStudents1.length}</Text>
              </Text>
              <TouchableOpacity onPress={() => {
                // setModalVisible1(true);
                email(['kraniket123654@gmail.com', 'aniketedits123654@gmail.com'], {
                  // cc: ['kraniket123654@gmail.com', 'aniketedits123654@gmail.com'],
                  // bcc: 'mee@mee.com',
                  subject: 'Short Attendance Notice',
                  body: body,
                  checkCanOpen: false // Call Linking.canOpenURL prior to Linking.openURL
                }).catch(console.error);
              }} className="bg-[#01808ce0] w-[100px] p-2 rounded-lg"><Text className="text-white font-extrabold text-center">Send Email</Text></TouchableOpacity>
            </View>
            {report.lowAttendanceStudents1.length > 0 ? (
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>Roll Number</Text>
                  <Text style={styles.tableHeaderText}>Name</Text>
                  <Text style={styles.tableHeaderText}>Attendance (%)</Text>
                </View>
                {report.lowAttendanceStudents1.map((student, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{student.ROLLNO}</Text>
                    <Text style={styles.tableCell1}>{student.STUDNAME}</Text>
                    <Text style={styles.tableCell2}>{student.attendancePercentage.toFixed(2)}%</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.studentText}>All students have more than 75% attendance.</Text>
            )}
          </View>}
          {percent == 3 && <View style={styles.section}>
            <Text style={styles.subHeader}>Students with Attendance More Than 75%:</Text>
            <View className="flex flex-row justify-between items-center mb-1">
              <Text style={styles.count}>
                Number of students: <Text style={{ fontWeight: 'bold' }}>{report.lowAttendanceStudents2.length}</Text>
              </Text>
              <TouchableOpacity onPress={() => {
                // setModalVisible1(true);
                email(['kraniket123654@gmail.com', 'aniketedits123654@gmail.com'], {
                  // cc: ['kraniket123654@gmail.com', 'aniketedits123654@gmail.com'],
                  // bcc: 'mee@mee.com',
                  subject: 'Short Attendance Notice',
                  body: body,
                  checkCanOpen: false // Call Linking.canOpenURL prior to Linking.openURL
                }).catch(console.error);
              }} className="bg-[#01808ce0] w-[100px] p-2 rounded-lg"><Text className="text-white font-extrabold text-center">Send Email</Text></TouchableOpacity>
            </View>
            {report.lowAttendanceStudents2.length > 0 ? (
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>Roll Number</Text>
                  <Text style={styles.tableHeaderText}>Name</Text>
                  <Text style={styles.tableHeaderText}>Attendance (%)</Text>
                </View>
                {report.lowAttendanceStudents2.map((student, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{student.ROLLNO}</Text>
                    <Text style={styles.tableCell1}>{student.STUDNAME}</Text>
                    <Text style={styles.tableCell2}>{student.attendancePercentage.toFixed(2)}%</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.studentText}>All students have more than 75% attendance.</Text>
            )}
          </View>}

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
                      style={{ textAlignVertical: 'top' }} // Ensures the text starts at the top
                    />
                    <View className="flex flex-row justify-between mt-5">
                      <TouchableOpacity className=" bg-red-400  p-3 w-[100px] rounded-2xl " onPress={() => setModalVisible1(false)}><Text className="text-white font-bold text-center">Cancel</Text></TouchableOpacity>
                      <TouchableOpacity className="bg-[#01808cc5] p-3 w-[100px] rounded-2xl " onPress={() => {
                        email(['kraniket123654@gmail.com', 'aniketedits123654@gmail.com'], {
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
                          checkCanOpen: false // Call Linking.canOpenURL prior to Linking.openURL
                        }).catch(console.error);
                      }}><Text className="text-white font-bold text-center">Send</Text></TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>


          {/* Top 10 Students */}
          {/* <View style={styles.section}>
            <Text style={styles.subHeader}>Top 10 Students by Attendance:</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Roll Number</Text>
                <Text style={styles.tableHeaderText}>Name</Text>
                <Text style={styles.tableHeaderText}>Attendance (%)</Text>
              </View>
              {report.top10Students.map((student, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{student.ROLLNO}</Text>
                  <Text style={styles.tableCell1}>{student.STUDNAME}</Text>
                  <Text style={styles.tableCell2}>{student.attendancePercentage.toFixed(2)}%</Text>
                </View>
              ))}
            </View>
          </View> */}

          {/* Bottom 10 Students */}
          {/* <View style={styles.section}>
            <Text style={styles.subHeader}>Bottom 10 Students by Attendance:</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Roll Number</Text>
                <Text style={styles.tableHeaderText}>Name</Text>
                <Text style={styles.tableHeaderText}>Attendance (%)</Text>
              </View>
              {report.bottom10Students.map((student, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell3}>{student.ROLLNO}</Text>
                  <Text style={styles.tableCell1}>{student.STUDNAME}</Text>
                  <Text style={styles.tableCell2}>{student.attendancePercentage.toFixed(2)}%</Text>
                </View>
              ))}
            </View>
          </View> */}


          {/* List of All Students */}
          <View style={styles.section}>
            <Text style={styles.subHeader}>All Students' Attendance:</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText3}>Roll Number</Text>
                <Text style={styles.tableHeaderText1}>Name</Text>
                <Text style={styles.tableHeaderText2}>Present</Text>
                <Text style={styles.tableHeaderText2}>Absent</Text>
              </View>
              {report.studentAttendanceCount.map((student, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell3}>{student.ROLLNO}</Text>
                  <Text style={styles.tableCell1}>{student.STUDNAME}</Text>
                  <Text style={styles.tableCell2}>{student.presentDays}</Text>
                  <Text style={styles.tableCell2}>{student.absentDays}</Text>
                </View>
              ))}
            </View>
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
    marginBottom: 80,
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
