import { Alert, Modal, PermissionsAndroid, Pressable, SafeAreaView, StyleSheet, Switch, Text, TextInput, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { BookOpenIcon, CpuChipIcon, PencilSquareIcon, PlusCircleIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { theme } from '../../theme';
import { ScrollView } from 'react-native';
// import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, ProgressBar, RadioButton } from 'react-native-paper';
import axios from 'axios';
import { useAuth } from '../../utils/auth';
import GetLocation from 'react-native-get-location';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import { BASE_URL } from '../../constants/constants';


const Sheet = ({ navigation, route }) => {
  // const navigation = useNavigation();

  const {  loading, setLoading } = useAuth();

  const [student, setStudent] = useState();
  const [range, setRange] = useState(3000);

  useEffect(()=>setStudent(route.params.jsonGlobalData),[]);
  console.log(route.params);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (student) {
      setRecords(student.map((s) => ({ rollNumber: s.rollNumber, is_present: false })));
    }
  }, [student]);
  
  useEffect(() => {
    if (records && records.length > 0) {
      calculateAttendance();
    }
  }, [records]);
  
  // Calculate present and absent students
  const calculateAttendance = () => {
    if (records && records.length > 0) {
      const present = records.filter(record => record.is_present).length;
      const absent = records.length - present;
      setPresentCount(present);
      setAbsentCount(absent);
    } else {
      setPresentCount(0);
      setAbsentCount(0);
    }
  };
  

  const [presentCount, setPresentCount] = useState(0);  // Count for present students
  const [absentCount, setAbsentCount] = useState(0);    // Count for absent students

  const [modalVisible0, setModalVisible0] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  const [otp, setOtp] = useState('');
  const [time, setTime] = useState(0);
  const [finalTime, setFinalTime] = useState(0);

  useEffect(() => {
    socket = new WebSocket('wss://attendancetrackerbackend.onrender.com');
    console.log('Socket from teacher side connected!');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Listen for attendance updates
      if (data.type === 'attendance2') {
        const updatedRollNumber = data.rollNumber;

        setRecords(prevRecords =>
          prevRecords.map(record =>
            record.rollNumber === updatedRollNumber 
              ? { ...record, is_present: true } 
              : record
          )
        );

        // Increment the present count
        setPresentCount(prevCount => prevCount + 1);
      }
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  const handleSetAttendance = async (val) => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);

    try {
      await axios.post(`${BASE_URL}/setAttendance`, {
        otp: generatedOtp,
        time: val
      });
    } catch (error) {
      console.error('Error sending OTP and time to server:', error);
      ToastAndroid.show('Failed to set attendance. Please try again.', ToastAndroid.LONG);
    }
  };

  const handleSetAttendance2 = () => {
    let interval;

    socket.send(JSON.stringify({ type: 'first_call' }));

    interval = setInterval(() => {
      setTime(prev => {
        if (prev <= 0) {
          setModalVisible2(false);
          clearInterval(interval);
          setTime(0);
          setFinalTime(0);

          // Send final time update to WebSocket before closing
          // console.log('Sending final time update:', 0);
          socket.send(JSON.stringify({ type: 'time_update', time: 0 }));
          return 0;
        }

        // Send time updates in real-time via WebSocket
        // console.log('Sending real-time time update:', prev-1);
        socket.send(JSON.stringify({ type: 'time_update', time: prev - 1 }));

        return prev - 1;
      });
    }, 1000);

    socket.onerror = (error) => {
      console.log('WebSocket Error:', error);
      ToastAndroid.show('Error with WebSocket connection', ToastAndroid.LONG);
      clearInterval(interval);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };
  };

  const createAttendance = async () => {
    try {
        setLoading(true);
        const response = await axios.post(`${BASE_URL}/api/attendance/createAttendance`, {
            class_id: route.params.id,
            date: new Date(),
            records: records
        });

        ToastAndroid.show(`Attendance Added Successfully !`, ToastAndroid.LONG);
        console.log('Attendance Added Successful:', response.data);
        downloadReport();
        navigation.goBack();
        setLoading(false);
    } catch (error) {
    //   ToastAndroid.show(`Login failed: ${error}`, ToastAndroid.LONG);
    console.error(error);
    setLoading(false);
    }
};

// Function to mark all students as present
const markAllPresent = () => {
  setRecords(prevRecords =>
    prevRecords.map(record => ({ ...record, is_present: true }))
  );
};


  // Function to mark all students as absent
  const markAllAbsent = () => {
    setRecords(prevRecords =>
      prevRecords.map(record => ({ ...record, is_present: false }))
    );
  };

  const requestLocationPermission = async () => {
    if(Platform.OS === "android"){
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log("You can access location");
        getCurrentLocation();  // Call your function to get the location
      } else {
        // console.log("Location permission denied");
        ToastAndroid.show('Location permission denied !', ToastAndroid.LONG);
        // setTimeout(()=>{setModalVisible2(false)},2000);
      }
    } catch (err) {
      console.warn(err);
    }}
  };

  const getCurrentLocation = () => {
    GetLocation.getCurrentPosition({enableHighAccuracy: true, timeout: 60000})
    .then(location => {
      socket.send(JSON.stringify({type: 'teacherLoc', location:location, range:range }));
      setModalVisible0(false);
      setModalVisible1(true);
    })
    .catch(error => {
      const { code, message } = error;
      console.warn(code, message);
    });
  };
  
  const generateHTML = () => {
    if (!records) return '';
  
    // Main styles for the PDF
    let html = `
    <h1>${new Date().toISOString().split('T')[0]} : Attendance Report</h1>
    <table border="1" style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="padding: 8px;">Roll Number</th>
          <th style="padding: 8px;">Name</th>
          <th style="padding: 8px;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${records.map(record => `
          <tr>
            <td style="padding: 8px;">${record.rollNumber}</td>
            <td style="padding: 8px;">${student.find(s => s.rollNumber === record.rollNumber)?.name || 'N/A'}</td>
            <td style="padding: 8px;">${record.is_present ? 'Present' : 'Absent'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
    return html;
  };
  
    // Function to generate and download the PDF
    const downloadReport = async () => {
      const options = {
        html: generateHTML(),
        fileName: `${new Date().toISOString().split('T')[0]}_Attendance_Report`,
        directory: 'Download',
      };
  
      try {
        const file = await RNHTMLtoPDF.convert(options);
        const newPath = `${RNFS.DownloadDirectoryPath}/${new Date().toISOString().split('T')[0]}_Attendance_Report.pdf`;
  
        // Move file to download directory
        await RNFS.moveFile(file.filePath, newPath);
  
        Alert.alert('Report Downloaded', `The report has been moved to: ${newPath}`);
      } catch (error) {
        console.log(error);
        ToastAndroid.show('Failed to download the report.', ToastAndroid.LONG);
      }
    };

  return (
    <SafeAreaView style={{ alignItems: 'center' }} >
      <View className="w-full flex flex-row justify-between items-center p-4 pb-0">
        <TouchableOpacity>
          <XMarkIcon size={wp(8)} color={theme.maincolor} onPress={() => navigation.goBack()} />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>createAttendance()} style={{ backgroundColor: theme.maincolor }} className="flex justify-center items-center rounded-lg p-3 px-5" >
          <Text style={{ color: '#fff', fontSize: wp(3.5), fontWeight: '700' }} >{loading?<ActivityIndicator animating={true} color={'white'} />:'Save'}</Text>
        </TouchableOpacity>
      </View>

      <View className="w-[95%] bg-[#01808c2e] p-2 px-3 rounded-md border-[#01808c7a] border-2 m-4 mb-3 flex flex-row justify-between items-end">
        <View>
          <View className="flex flex-row flex-wrap"><CpuChipIcon size={wp(8)} fill={theme.maincolor} color={theme.maincolor} />
          <Text className="text-2xl text-[#01808cb9] font-medium ml-1">
            {route.params.classname.length > 10 ? route.params.classname.substring(0, 10) + "..." : route.params.classname}
            </Text></View>
          <Text className="text-gray-600">
            {route.params.teacherName.length > 25 ? route.params.teacherName.substring(0, 25) + "..." : route.params.teacherName}

          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setModalVisible0(true);
          }}
          className="flex flex-col justify-center items-center bg-[#01808cb9] p-2 rounded-md border-[#01808c7a] border-2">
          <PencilSquareIcon size={wp(6)} color="white" />
          <Text className="text-white text-[15px] font-medium">Take Attendance</Text>
        </TouchableOpacity>
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

                <View className="bg-white m-[20px] rounded-lg p-[35px] shadow-2xl shadow-black flex items-center gap-y-3">
                  <Text className="text-black">Select Range :</Text>
                  <RadioButton.Group onValueChange={value => {
                    setRange(parseInt(value));
                    requestLocationPermission();
                  }}>
                    <RadioButton.Item labelStyle={{ color: "#6a6a6a" }} label="5m" value="5" />
                    <RadioButton.Item labelStyle={{ color: "#6a6a6a" }} label="10m" value="10" />
                    <RadioButton.Item labelStyle={{ color: "#6a6a6a" }} label="20m" value="20" />
                    <RadioButton.Item labelStyle={{ color: "#6a6a6a" }} label="30m" value="30" />
                    <RadioButton.Item labelStyle={{ color: "#6a6a6a" }} label="40m" value="40" />
                    <RadioButton.Item labelStyle={{ color: "#6a6a6a" }} label="50m" value="50" />
                    <RadioButton.Item labelStyle={{ color: "#6a6a6a" }} label="100m" value="100" />
                    <RadioButton.Item labelStyle={{ color: "#6a6a6a" }} label="500m" value="500" />
                    <RadioButton.Item labelStyle={{ color: "#6a6a6a" }} label="1000m" value="1000" />
                  </RadioButton.Group>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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

                <View className="bg-white m-[20px] rounded-lg p-[35px] shadow-2xl shadow-black flex items-center gap-y-3">
                  <RadioButton.Group onValueChange={value => {
                    setFinalTime(parseInt(value));
                    setTime(parseInt(value));
                    setModalVisible2(true);
                    setModalVisible1(false);
                    handleSetAttendance(parseInt(value));
                    handleSetAttendance2();
                  }}>
                    <RadioButton.Item labelStyle={{ color: "#6a6a6a" }} label="10 Seconds" value="10" />
                    <RadioButton.Item labelStyle={{ color: "#6a6a6a" }} label="20 Seconds" value="20" />
                    <RadioButton.Item labelStyle={{ color: "#6a6a6a" }} label="30 Seconds" value="30" />
                    <RadioButton.Item labelStyle={{ color: "#6a6a6a" }} label="1 Minute" value="60" />
                    <RadioButton.Item labelStyle={{ color: "#6a6a6a" }} label="2 Minutes" value="120" />
                  </RadioButton.Group>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible2}
          onRequestClose={() => {
            setModalVisible2(!modalVisible2);
            setTime(0);
            setFinalTime(0);
          }}>
          <TouchableWithoutFeedback onPress={() => {
            setModalVisible2(false);
            setTime(0);
            setFinalTime(0);
          }}>
            <View className="w-full flex-1 bg-[#00000050] flex justify-center">
              <TouchableWithoutFeedback>

                <View className="bg-white m-[20px] rounded-lg p-[35px] shadow-2xl shadow-black flex items-center gap-y-3">
                  <Text className="text-lg font-bold text-gray-400">OTP : {otp}</Text>
                  <View className="w-full">
                    <Text className="pb-3 text-gray-500">Time Remaining: {time} seconds</Text>
                    <ProgressBar progress={time / finalTime} color={'#01818C'} />
                  </View>
                  <Pressable
                    className="bg-[#01818C] px-2 py-3 w-[100px] rounded-2xl"
                    onPress={() => {
                      setModalVisible2(false);
                      setTime(0);
                      setFinalTime(0);
                    }}>
                    <Text className="text-white text-center font-medium">Cancel</Text>
                  </Pressable>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>

      {/* Add buttons for marking all present/absent */}
      <View className="flex flex-row justify-between w-full mb-3 px-3">
        <TouchableOpacity
          onPress={markAllPresent}
          className="flex-1 bg-[#258a4ac4] py-2 rounded-md mr-4 items-center">
          <Text className="text-white font-semibold">Mark All Present</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={markAllAbsent}
          className="flex-1 bg-[#c41111c4] py-2 rounded-md ml-4 items-center">
          <Text className="text-white font-semibold">Mark All Absent</Text>
        </TouchableOpacity>
      </View>

      {/* Display present and absent count */}
      <View className="w-full flex flex-row justify-between px-4 mb-2">
        <Text className="text-sm text-gray-400 ">Total Students : {presentCount + absentCount}</Text>
        <View><Text className="text-sm text-gray-400 text-right">Present : {presentCount}</Text>
          <Text className="text-sm text-gray-400 text-right">Absent : {absentCount}</Text></View>
      </View>

      <View style={{ width: wp(95) }} className="bg-[#01808c2e] p-2 rounded-t-md border-[#01808c7a] border-t-2 border-r-2 border-l-2 ">
        <View className="flex flex-row justify-between">
          <Text className="w-1/4  text-[#7c7c7c] ">Roll Number</Text>
          <Text className="w-1/2 text-[#7c7c7c] text-center">Name</Text>
          <Text className="w-1/4 text-[#7c7c7c] text-right">Attendance</Text>
        </View>
      </View>
      <ScrollView
        scrollEventThrottle={1}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: '#fff', height: hp(60) }}
        className="border-b-2 border-[#01808c7a] rounded-b-md"
      >
        <View style={{ width: wp(95) }} className="p-2 rounded-b-md border-[#01808c7a] border-b-2 border-r-2 border-l-2 flex gap-y-3">

          {student&&records?student.map((item, id) => (
            <View className="flex flex-row justify-between" key={id}>
              <Text className={`w-1/4 text-[${theme.maincolor}]`}>{item.rollNumber}</Text>
              <Text className={`w-1/2 text-[${theme.maincolor}]`}>{item.name}</Text>
              <View className="w-1/4 flex flex-row justify-end items-center">
                <Switch
                  thumbColor={records[id]?.is_present ? '#258a4ac4' : '#c41111c4'}
                  trackColor={{ false: '#ffaaaac4', true: '#8bdca8c4' }}
                  onValueChange={() => {
                    setRecords(prevRecords => {
                      if (id >= prevRecords.length) return prevRecords; // Prevents out-of-range access
                
                      // Ensure you're not mutating the original state
                      const updatedRecords = [...prevRecords];
                      updatedRecords[id] = {
                        ...updatedRecords[id],
                        is_present: !updatedRecords[id].is_present,
                      };
                      return updatedRecords;
                    });
                  }}
                  value={records[id]?.is_present} />
                <Text className={`text-gray-400 font-semibold`}>{records[id]?.is_present ? 'P' : 'A'}</Text>
              </View>
            </View>
          )):<Text>Student Data is Empty !</Text>}

        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default Sheet;

const styles = StyleSheet.create({
  // Add any custom styles if needed
});









































// // // 2nd try 


// import React, { useEffect, useState, useRef } from 'react';
// import {
//   Alert,
//   Modal,
//   PermissionsAndroid,
//   Pressable,
//   SafeAreaView,
//   StyleSheet,
//   Switch,
//   Text,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
//   ToastAndroid,
//   ActivityIndicator,
//   ScrollView,
//   Platform
// } from 'react-native';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { CpuChipIcon, PencilSquareIcon, XMarkIcon } from 'react-native-heroicons/outline';
// import { theme } from '../../theme';
// import { ProgressBar, RadioButton } from 'react-native-paper';
// import axios from 'axios';
// import { useAuth } from '../../utils/auth';
// import GetLocation from 'react-native-get-location';
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
// import RNFS from 'react-native-fs';
// import { BASE_URL } from '../../constants/constants';

// const AttendanceSheet = ({ navigation, route }) => {
//   // State management
//   const { loading, setLoading } = useAuth();
//   const [studentData, setStudentData] = useState([]);
//   const [attendanceRecords, setAttendanceRecords] = useState([]);
//   const [presentCount, setPresentCount] = useState(0);
//   const [absentCount, setAbsentCount] = useState(0);
//   const [range, setRange] = useState(3000);
  
//   // Modal states
//   const [showRangeModal, setShowRangeModal] = useState(false);
//   const [showTimeModal, setShowTimeModal] = useState(false);
//   const [showOTPModal, setShowOTPModal] = useState(false);
  
//   // Attendance session states
//   const [otp, setOtp] = useState('');
//   const [timeRemaining, setTimeRemaining] = useState(0);
//   const [sessionDuration, setSessionDuration] = useState(0);
  
//   // WebSocket reference
//   const socketRef = useRef(null);

//   // Initialize student data
//   useEffect(() => {
//     if (route.params?.jsonGlobalData) {
//       setStudentData(route.params.jsonGlobalData);
//     }
//   }, [route.params]);

//   // Initialize attendance records
//   useEffect(() => {
//     if (studentData.length > 0) {
//       const initialRecords = studentData.map(student => ({
//         rollNumber: student.rollNumber,
//         is_present: false
//       }));
//       setAttendanceRecords(initialRecords);
//     }
//   }, [studentData]);

//   // Calculate attendance stats
//   useEffect(() => {
//     const present = attendanceRecords.filter(record => record.is_present).length;
//     setPresentCount(present);
//     setAbsentCount(attendanceRecords.length - present);
//   }, [attendanceRecords]);

//   // WebSocket management
//   useEffect(() => {
//     // Initialize WebSocket connection
//     socketRef.current = new WebSocket('wss://attendancetrackerbackend.onrender.com');

//     socketRef.current.onopen = () => {
//       console.log('WebSocket connected');
//     };

//     socketRef.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
      
//       if (data.type === 'attendance2') {
//         // Update attendance when student marks themselves present
//         setAttendanceRecords(prevRecords =>
//           prevRecords.map(record =>
//             record.rollNumber === data.rollNumber 
//               ? { ...record, is_present: true } 
//               : record
//           )
//         );
//       }
//     };

//     socketRef.current.onerror = (error) => {
//       console.log('WebSocket error:', error);
//     };

//     socketRef.current.onclose = () => {
//       console.log('WebSocket disconnected');
//     };

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.close();
//       }
//     };
//   }, []);

//   // Handle attendance submission
//   const submitAttendance = async () => {
//     try {
//       setLoading(true);
      
//       const response = await axios.post(`${BASE_URL}/api/attendance/createAttendance`, {
//         class_id: route.params.id,
//         date: new Date().toISOString().split('T')[0],
//         records: attendanceRecords
//       });

//       ToastAndroid.show('Attendance saved successfully!', ToastAndroid.LONG);
//       generateReport();
//       navigation.goBack();
//     } catch (error) {
//       console.error('Attendance submission error:', error);
//       ToastAndroid.show('Failed to save attendance', ToastAndroid.LONG);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Start attendance session
//   const startAttendanceSession = async (duration) => {
//     const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
//     setOtp(generatedOTP);
//     setSessionDuration(duration);
//     setTimeRemaining(duration);
//     setShowTimeModal(false);
//     setShowOTPModal(true);

//     try {
//       // Send OTP to server
//       await axios.post(`${BASE_URL}/setAttendance`, {
//         otp: generatedOTP,
//         time: duration
//       });

//       // Start session timer
//       startSessionTimer(duration);
//     } catch (error) {
//       console.error('Error starting session:', error);
//       ToastAndroid.show('Failed to start attendance session', ToastAndroid.LONG);
//     }
//   };

//   // Session timer
//   const startSessionTimer = (duration) => {
//     let timer = duration;
//     const interval = setInterval(() => {
//       timer -= 1;
//       setTimeRemaining(timer);

//       // Send time updates to students
//       if (socketRef.current?.readyState === WebSocket.OPEN) {
//         socketRef.current.send(JSON.stringify({ 
//           type: 'time_update', 
//           time: timer 
//         }));
//       }

//       if (timer <= 0) {
//         clearInterval(interval);
//         setShowOTPModal(false);
//       }
//     }, 1000);
//   };

//   // Location permission handling
//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: "Location Permission",
//             message: "This app needs access to your location",
//             buttonPositive: "OK"
//           }
//         );
        
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           getTeacherLocation();
//         } else {
//           ToastAndroid.show('Location permission denied', ToastAndroid.LONG);
//         }
//       } catch (err) {
//         console.warn('Location permission error:', err);
//       }
//     } else {
//       getTeacherLocation();
//     }
//   };

//   // Get teacher location
//   const getTeacherLocation = () => {
//     GetLocation.getCurrentPosition({
//       enableHighAccuracy: true,
//       timeout: 15000
//     })
//     .then(location => {
//       if (socketRef.current?.readyState === WebSocket.OPEN) {
//         socketRef.current.send(JSON.stringify({
//           type: 'teacherLoc',
//           location: location,
//           range: range
//         }));
//       }
//       setShowRangeModal(false);
//       setShowTimeModal(true);
//     })
//     .catch(error => {
//       console.warn('Location error:', error);
//       ToastAndroid.show('Failed to get location', ToastAndroid.LONG);
//     });
//   };

//   // Mark all students present/absent
//   const markAllStudents = (status) => {
//     setAttendanceRecords(prevRecords =>
//       prevRecords.map(record => ({ ...record, is_present: status }))
//     );
//   };

//   // Generate attendance report
//   const generateReport = async () => {
//     const htmlContent = `
//       <h1>Attendance Report - ${new Date().toISOString().split('T')[0]}</h1>
//       <h2>Class: ${route.params.classname}</h2>
//       <table border="1" style="width:100%; border-collapse:collapse;">
//         <thead>
//           <tr>
//             <th style="padding:8px;">Roll Number</th>
//             <th style="padding:8px;">Name</th>
//             <th style="padding:8px;">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${attendanceRecords.map(record => `
//             <tr>
//               <td style="padding:8px;">${record.rollNumber}</td>
//               <td style="padding:8px;">
//                 ${studentData.find(s => s.rollNumber === record.rollNumber)?.name || 'N/A'}
//               </td>
//               <td style="padding:8px;color:${record.is_present ? 'green' : 'red'}">
//                 ${record.is_present ? 'Present' : 'Absent'}
//               </td>
//             </tr>
//           `).join('')}
//         </tbody>
//       </table>
//       <p>Total Present: ${presentCount} | Total Absent: ${absentCount}</p>
//     `;

//     try {
//       const options = {
//         html: htmlContent,
//         fileName: `Attendance_${route.params.classname}_${new Date().toISOString().split('T')[0]}`,
//         directory: 'Documents',
//       };

//       const file = await RNHTMLtoPDF.convert(options);
//       Alert.alert(
//         'Report Generated',
//         `Attendance report saved to: ${file.filePath}`,
//         [{ text: 'OK' }]
//       );
//     } catch (error) {
//       console.error('Report generation error:', error);
//       ToastAndroid.show('Failed to generate report', ToastAndroid.LONG);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <XMarkIcon size={wp(8)} color={theme.maincolor} />
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.saveButton}
//           onPress={submitAttendance}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="white" />
//           ) : (
//             <Text style={styles.saveButtonText}>Save</Text>
//           )}
//         </TouchableOpacity>
//       </View>

//       {/* Class Info */}
//       <View style={styles.classInfo}>
//         <View style={styles.classHeader}>
//           <CpuChipIcon size={wp(8)} fill={theme.maincolor} color={theme.maincolor} />
//           <Text style={styles.className}>
//             {route.params.classname?.length > 10 
//               ? `${route.params.classname.substring(0, 10)}...` 
//               : route.params.classname}
//           </Text>
//         </View>
//         <Text style={styles.teacherName}>
//           {route.params.teacherName?.length > 25 
//             ? `${route.params.teacherName.substring(0, 25)}...` 
//             : route.params.teacherName}
//         </Text>
//         <TouchableOpacity
//           style={styles.attendanceButton}
//           onPress={() => setShowRangeModal(true)}
//         >
//           <PencilSquareIcon size={wp(6)} color="white" />
//           <Text style={styles.attendanceButtonText}>Take Attendance</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Quick Actions */}
//       <View style={styles.quickActions}>
//         <TouchableOpacity
//           style={[styles.actionButton, styles.markPresent]}
//           onPress={() => markAllStudents(true)}
//         >
//           <Text style={styles.actionButtonText}>Mark All Present</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.actionButton, styles.markAbsent]}
//           onPress={() => markAllStudents(false)}
//         >
//           <Text style={styles.actionButtonText}>Mark All Absent</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Attendance Stats */}
//       <View style={styles.statsContainer}>
//         <Text style={styles.statText}>Total Students: {presentCount + absentCount}</Text>
//         <View>
//           <Text style={styles.statText}>Present: {presentCount}</Text>
//           <Text style={styles.statText}>Absent: {absentCount}</Text>
//         </View>
//       </View>

//       {/* Student List Header */}
//       <View style={styles.listHeader}>
//         <Text style={styles.headerText}>Roll Number</Text>
//         <Text style={[styles.headerText, styles.nameHeader]}>Name</Text>
//         <Text style={styles.headerText}>Attendance</Text>
//       </View>

//       {/* Student List */}
//       <ScrollView style={styles.studentList}>
//         {studentData.length > 0 ? (
//           studentData.map((student, index) => (
//             <View key={student.rollNumber} style={styles.studentRow}>
//               <Text style={styles.rollNumber}>{student.rollNumber}</Text>
//               <Text style={styles.studentName}>{student.name}</Text>
//               <View style={styles.attendanceToggle}>
//                 <Switch
//                   value={attendanceRecords[index]?.is_present || false}
//                   onValueChange={() => {
//                     const newRecords = [...attendanceRecords];
//                     newRecords[index].is_present = !newRecords[index].is_present;
//                     setAttendanceRecords(newRecords);
//                   }}
//                   thumbColor={attendanceRecords[index]?.is_present ? '#4CAF50' : '#F44336'}
//                   trackColor={{ false: '#FFCDD2', true: '#C8E6C9' }}
//                 />
//                 <Text style={styles.attendanceStatus}>
//                   {attendanceRecords[index]?.is_present ? 'P' : 'A'}
//                 </Text>
//               </View>
//             </View>
//           ))
//         ) : (
//           <Text style={styles.emptyMessage}>No students found</Text>
//         )}
//       </ScrollView>

//       {/* Range Selection Modal */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={showRangeModal}
//         onRequestClose={() => setShowRangeModal(false)}
//       >
//         <TouchableWithoutFeedback onPress={() => setShowRangeModal(false)}>
//           <View style={styles.modalOverlay}>
//             <TouchableWithoutFeedback>
//               <View style={styles.modalContent}>
//                 <Text style={styles.modalTitle}>Select Range</Text>
//                 <RadioButton.Group
//                   onValueChange={value => {
//                     setRange(parseInt(value));
//                     requestLocationPermission();
//                   }}
//                   value={range.toString()}
//                 >
//                   {[5, 10, 20, 30, 40, 50, 100, 500, 1000].map(value => (
//                     <RadioButton.Item
//                       key={value}
//                       label={`${value}m`}
//                       value={value.toString()}
//                       labelStyle={styles.radioLabel}
//                     />
//                   ))}
//                 </RadioButton.Group>
//               </View>
//             </TouchableWithoutFeedback>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>

//       {/* Time Selection Modal */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={showTimeModal}
//         onRequestClose={() => setShowTimeModal(false)}
//       >
//         <TouchableWithoutFeedback onPress={() => setShowTimeModal(false)}>
//           <View style={styles.modalOverlay}>
//             <TouchableWithoutFeedback>
//               <View style={styles.modalContent}>
//                 <Text style={styles.modalTitle}>Select Duration</Text>
//                 <RadioButton.Group
//                   onValueChange={value => startAttendanceSession(parseInt(value))}
//                 >
//                   {[
//                     { label: '10 Seconds', value: '10' },
//                     { label: '20 Seconds', value: '20' },
//                     { label: '30 Seconds', value: '30' },
//                     { label: '1 Minute', value: '60' },
//                     { label: '2 Minutes', value: '120' }
//                   ].map(item => (
//                     <RadioButton.Item
//                       key={item.value}
//                       label={item.label}
//                       value={item.value}
//                       labelStyle={styles.radioLabel}
//                     />
//                   ))}
//                 </RadioButton.Group>
//               </View>
//             </TouchableWithoutFeedback>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>

//       {/* OTP Modal */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={showOTPModal}
//         onRequestClose={() => {
//           setShowOTPModal(false);
//           setTimeRemaining(0);
//         }}
//       >
//         <TouchableWithoutFeedback onPress={() => {
//           setShowOTPModal(false);
//           setTimeRemaining(0);
//         }}>
//           <View style={styles.modalOverlay}>
//             <TouchableWithoutFeedback>
//               <View style={styles.modalContent}>
//                 <Text style={styles.otpTitle}>Attendance Session</Text>
//                 <Text style={styles.otpCode}>OTP: {otp}</Text>
//                 <Text style={styles.timeRemaining}>
//                   Time Remaining: {timeRemaining} seconds
//                 </Text>
//                 <ProgressBar
//                   progress={timeRemaining / sessionDuration}
//                   color={theme.maincolor}
//                   style={styles.progressBar}
//                 />
//                 <Pressable
//                   style={styles.cancelButton}
//                   onPress={() => {
//                     setShowOTPModal(false);
//                     setTimeRemaining(0);
//                   }}
//                 >
//                   <Text style={styles.cancelButtonText}>End Session</Text>
//                 </Pressable>
//               </View>
//             </TouchableWithoutFeedback>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   header: {
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     paddingBottom: 0,
//   },
//   saveButton: {
//     backgroundColor: theme.maincolor,
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: wp(3.5),
//     fontWeight: '700',
//   },
//   classInfo: {
//     width: '95%',
//     backgroundColor: '#01808c2e',
//     padding: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     borderWidth: 2,
//     borderColor: '#01808c7a',
//     margin: 16,
//     marginBottom: 12,
//   },
//   classHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   className: {
//     fontSize: wp(5),
//     color: '#01808cb9',
//     fontWeight: '500',
//     marginLeft: 4,
//   },
//   teacherName: {
//     color: '#6a6a6a',
//     fontSize: wp(3.5),
//   },
//   attendanceButton: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     backgroundColor: '#01808cb9',
//     padding: 8,
//     borderRadius: 8,
//     borderWidth: 2,
//     borderColor: '#01808c7a',
//     alignSelf: 'flex-end',
//     marginTop: 8,
//   },
//   attendanceButtonText: {
//     color: 'white',
//     fontSize: wp(3.2),
//     fontWeight: '500',
//   },
//   quickActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     paddingHorizontal: 12,
//     marginBottom: 12,
//   },
//   actionButton: {
//     flex: 1,
//     paddingVertical: 8,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   markPresent: {
//     backgroundColor: '#258a4ac4',
//     marginRight: 8,
//   },
//   markAbsent: {
//     backgroundColor: '#c41111c4',
//     marginLeft: 8,
//   },
//   actionButtonText: {
//     color: 'white',
//     fontWeight: '600',
//   },
//   statsContainer: {
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     marginBottom: 8,
//   },
//   statText: {
//     fontSize: wp(3.2),
//     color: '#6a6a6a',
//   },
//   listHeader: {
//     width: '95%',
//     backgroundColor: '#01808c2e',
//     padding: 8,
//     borderTopWidth: 2,
//     borderRightWidth: 2,
//     borderLeftWidth: 2,
//     borderColor: '#01808c7a',
//     borderTopLeftRadius: 8,
//     borderTopRightRadius: 8,
//     flexDirection: 'row',
//   },
//   headerText: {
//     color: '#7c7c7c',
//     fontSize: wp(3.5),
//   },
//   nameHeader: {
//     flex: 1,
//     textAlign: 'center',
//   },
//   studentList: {
//     width: '95%',
//     borderBottomWidth: 2,
//     borderRightWidth: 2,
//     borderLeftWidth: 2,
//     borderColor: '#01808c7a',
//     borderBottomLeftRadius: 8,
//     borderBottomRightRadius: 8,
//   },
//   studentRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   rollNumber: {
//     width: '25%',
//     color: theme.maincolor,
//   },
//   studentName: {
//     width: '50%',
//     color: theme.maincolor,
//     textAlign: 'center',
//   },
//   attendanceToggle: {
//     width: '25%',
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   attendanceStatus: {
//     color: '#6a6a6a',
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   emptyMessage: {
//     textAlign: 'center',
//     padding: 16,
//     color: '#6a6a6a',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     marginHorizontal: 20,
//     borderRadius: 8,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: wp(4.5),
//     fontWeight: '600',
//     marginBottom: 16,
//     color: '#333',
//     textAlign: 'center',
//   },
//   radioLabel: {
//     color: '#6a6a6a',
//   },
//   otpTitle: {
//     fontSize: wp(5),
//     fontWeight: '600',
//     textAlign: 'center',
//     marginBottom: 8,
//     color: '#333',
//   },
//   otpCode: {
//     fontSize: wp(4),
//     textAlign: 'center',
//     marginBottom: 16,
//     color: theme.maincolor,
//     fontWeight: '600',
//   },
//   timeRemaining: {
//     fontSize: wp(3.8),
//     textAlign: 'center',
//     marginBottom: 8,
//     color: '#6a6a6a',
//   },
//   progressBar: {
//     height: 10,
//     borderRadius: 5,
//     marginVertical: 16,
//   },
//   cancelButton: {
//     backgroundColor: '#e74c3c',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: wp(4),
//   },
// });

// export default AttendanceSheet;