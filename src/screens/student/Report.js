import React, {useEffect, useState, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  StatusBar
} from 'react-native';
import {ActivityIndicator, ProgressBar} from 'react-native-paper';
import {theme} from '../../theme';
import {ArrowDownTrayIcon} from 'react-native-heroicons/outline';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useAuth} from '../../utils/auth';
import axios from 'axios';
import {BASE_URL} from '../../constants/constants';
import PTRView from 'react-native-pull-to-refresh';

const StudentReport = () => {
  const [lowAttendanceSubjects, setLowAttendanceSubjects] = useState([]);
  const {rollNumberG, studentNameG, loading, setLoading, studentClass} =
    useAuth();
  const [data, setData] = useState([]);

  const finalData = useMemo(() => {
    return data;
  }, [data]);

  const getStudentReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/student/attendance/${rollNumberG}`,
      );

      setData(
        Object.entries(response.data).map(([key, value]) => {
          const meta = studentClass.find(cls => cls.class_id === key);
          return {
            id: key,
            ...value,
            classname: meta?.classname || 'Unknown',
          };
        }),
      );

      setLowAttendanceSubjects(
        finalData?.filter(item => (item.attended * 100) / item.total_days < 75),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudentReport();
  }, []);

  useEffect(() => {
    setLowAttendanceSubjects(
      finalData?.filter(item => (item.attended * 100) / item.total_days < 75),
    );
  }, [finalData]);

  console.log('After memo service: ', finalData, lowAttendanceSubjects);

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

    finalData?.forEach(subject => {
      const attendancePercentage = (
        (subject.attended * 100) /
        subject.total_days
      ).toFixed(2);
      html += `
        <tr>
          <td>${subject.classname}</td>
          <td>${subject.total_days}</td>
          <td>${subject.attended}</td>
          <td>${subject.total_days - subject.attended}</td>
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
      const attendancePercentage = (
        (subject.attended * 100) /
        subject.total_days
      ).toFixed(2);
      html += `
        <tr>
          <td>${subject.classname}</td>
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

  const refresh = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        getStudentReport();
        resolve();
      }, 2000);
    });
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

      Alert.alert(
        'Report Downloaded',
        `The report has been moved to: ${newPath}`,
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to download the report.');
    }
  };

  return (
    <>
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
          Student's Report
        </Text>
        <TouchableOpacity
          onPress={downloadStudentReport}
          style={{backgroundColor: 'white'}}
          className="flex justify-center items-center rounded-lg p-3 px-3">
          <View className="flex flex-row justify-center items-center">
            <ArrowDownTrayIcon color={'#01818C'} size={20} />
            <Text
              style={{
                color: '#01818C',
                fontSize: wp(3.2),
                fontWeight: '500',
                marginLeft: 5,
              }}>
              Download Report
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {loading && (
        <View className="z-10 w-full p-2 top-[50%] absolute ">
          <ActivityIndicator
            animating={true}
            color={'#01808c7a'}
            size={wp(10)}
          />
        </View>
      )}

      <PTRView
        onRefresh={refresh}
        className={`opacity-${loading ? 50 : 100}`}>
        {data?.map((subject, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.subHeader}>{subject.classname}</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Total Classes:</Text>
              <Text style={styles.value}>{subject.total_days}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Classes Attended:</Text>
              <Text style={styles.value}>{subject.attended}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Classes Unattended:</Text>
              <Text style={styles.value}>
                {subject.total_days - subject.attended}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Attendance Percentage:</Text>
              <Text style={styles.value}>
                {((subject.attended * 100) / subject.total_days).toFixed(2)}%
              </Text>
            </View>

            <ProgressBar
              progress={
                subject.total_days > 0
                  ? subject.attended / subject.total_days
                  : 0
              }
              color={theme.maincolor}
              style={styles.progressBar}
            />
          </View>
        ))}

        {/* Subjects with attendance less than 75% */}
        {data && (
          <View style={styles.lowAttendanceSection}>
            <Text style={styles.subHeader}>
              Classes with Attendance Less Than 75%
            </Text>
            {lowAttendanceSubjects?.length > 0 ? (
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>Subject Name</Text>
                  <Text style={styles.tableHeaderText}>Attendance (%)</Text>
                </View>
                {lowAttendanceSubjects?.map((subject, index) => (
                  <View key={subject} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{subject.classname}</Text>
                    <Text style={styles.tableCell}>
                      {((subject.attended * 100) / subject.total_days)?.toFixed(
                        2,
                      )}
                      %
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noLowAttendanceText}>
                All classes have attendance above 75%.
              </Text>
            )}
          </View>
        )}
      </PTRView>
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
