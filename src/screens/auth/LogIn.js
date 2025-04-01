// import {
//   KeyboardAvoidingView,
//   ScrollView,
//   StatusBar,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   ToastAndroid,
//   Image,
// } from 'react-native';
// import React from 'react';
// import SignUp from './SignUp';
// import {useAuth} from '../../utils/auth';
// import {theme} from '../../theme';
// import {ActivityIndicator} from 'react-native-paper';
// import {BASE_URL} from '../../constants/constants';
// import SInfo from 'react-native-encrypted-storage';

// const LogIn = () => {
//   const [isStudent, setIsStudent] = React.useState(true);
//   const [email, setEmail] = React.useState('');
//   const [rollNumber, setRollNumber] = React.useState('');
//   const [password, setPassword] = React.useState('');
//   const [isSignUp, setIsSignUp] = React.useState(false);

//   const {
//     setIndex,
//     setClasses,
//     setTeacheridG,
//     setDepartmentG,
//     loading,
//     setLoading,
//     setRollNumberG,
//     setTeacherNameG,
//     setTeacherEmailG,
//     setStudentidG,
//     setStudentNameG,
//     setStudentEmailG,
//     setRefreshing,
//   } = useAuth();

//   const handleTeacherLogin = async () => {
//     try {
//       setLoading(true);
//       if (!email || !password) {
//         ToastAndroid.show('Fields Should Not Be Empty', ToastAndroid.LONG);
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(`${BASE_URL}/api/teacher/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email: email,
//           password: password,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Login failed');
//       }

//       const data = await response.json();
//       ToastAndroid.show(
//         `Login Successful. Welcome ${data.fullName} !`,
//         ToastAndroid.LONG,
//       );
//       console.log('Login Successful:', data);

//       SInfo.setItem(
//         'token',
//         JSON.stringify({type: 'teacher', data: data.token}),
//       );
//       setClasses(
//         data.coursesId.map(classItem => ({
//           id: classItem._id,
//         })),
//       );
//       setTeacheridG(data.id);
//       setDepartmentG(data.department);
//       setTeacherNameG(data.fullName);
//       setTeacherEmailG(data.email);
//       setIndex('1'); // Set index for teacher
//       setRefreshing(true);
//       setLoading(false);
//     } catch (error) {
//       console.log(error);
//       ToastAndroid.show(
//         `Login failed: ${error.message || 'Unknown error'}`,
//         ToastAndroid.LONG,
//       );
//       setLoading(false);
//     }
//   };

//   const handleStudentLogin = async () => {
//     try {
//       setLoading(true);
//       if (!rollNumber || !password) {
//         ToastAndroid.show('Fields Should Not Be Empty', ToastAndroid.LONG);
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(`${BASE_URL}/api/student/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           rollNumber: rollNumber,
//           password: password,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Login failed');
//       }

//       const data = await response.json();
//       console.log('Login successful:', data);
//       ToastAndroid.show(
//         `Login Successful. Welcome ${data.fullName} !`,
//         ToastAndroid.LONG,
//       );

//       SInfo.setItem(
//         'token',
//         JSON.stringify({type: 'student', data: data.token}),
//       );
//       setRollNumberG(data.rollNumber);
//       setIndex('2'); // Set index for student
//       setStudentidG(data.id);
//       setStudentNameG(data.fullName);
//       setStudentEmailG(data.email);
//       setLoading(false);
//     } catch (error) {
//       console.log(error);
//       ToastAndroid.show(
//         `Login failed: ${error.message || 'Unknown error'}`,
//         ToastAndroid.LONG,
//       );
//       setLoading(false);
//     }
//   };

//   const forgotPassword = async (type, id) => {
//     if (!id) {
//       ToastAndroid.show('Roll Number or Email Should Not Be Empty', ToastAndroid.LONG);
//       return;
//     }
//     try {
//       console.log('Forgot password request:', type, id);
//       const response = await fetch(`${BASE_URL}/api/${type}/forgot`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body:
//           type == 'student'
//             ? JSON.stringify({
//                 rollNumber: id,
//               })
//             : JSON.stringify({
//                 email: id,
//               }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Request failed');
//       }

//       const data = await response.json();
//       console.log('Password resetted:', data);
//       ToastAndroid.show(
//         `Password reset please register again using your registered ${id}`,
//         ToastAndroid.LONG,
//       );
//     } catch (error) {
//       console.log(error);
//       ToastAndroid.show(
//         `Request failed: ${error.message || 'Unknown error'}`,
//         ToastAndroid.LONG,
//       );
//     }
//   };

//   return (
//     <KeyboardAvoidingView>
//       <StatusBar
//         backgroundColor={theme.maincolor}
//         barStyle={'light-content'}
//         hidden={false}
//       />
//       <ScrollView>
//         {isSignUp ? (
//           <SignUp setIsSignUp={setIsSignUp} setIsStudent={setIsStudent} />
//         ) : (
//           <View className="h-screen flex justify-center items-center gap-y-4 relative">
//             <View className="h-28 w-28 bg-[#01818C] absolute top-0 left-0 rounded-br-full"></View>
//             <View className="h-36 w-36 bg-[#01808c87] absolute top-0 left-0 rounded-br-full"></View>
//             <View className="h-20 w-20 bg-[#01808c87] absolute bottom-0 right-0 rounded-tl-full"></View>
//             <Image
//               style={{width: 100, height: 100}}
//               source={{
//                 uri: isStudent
//                   ? 'https://icons.veryicon.com/png/o/avatar/character-series/student-10.png'
//                   : 'https://icons.veryicon.com/png/o/miscellaneous/wisdom-training/teacher-27.png',
//               }}
//             />
//             <View>
//               <Text className="text-3xl font-bold text-[#2e2e2e]">
//                 {isStudent ? 'Student Login' : 'Teacher Login'}
//               </Text>
//             </View>
//             <View>
//               <Text className="text-sm text-gray-500">
//                 Not a member yet?{' '}
//                 <Text
//                   className="text-[#01818C] underline"
//                   onPress={() => setIsSignUp(true)}>
//                   Sign up!
//                 </Text>
//               </Text>
//             </View>
//             <View className="flex flex-row justify-around w-[80%]">
//               <TouchableOpacity
//                 onPress={() => setIsStudent(true)}
//                 className={`${
//                   isStudent ? 'bg-[#01818C]' : 'bg-white'
//                 } border-[#01818C] border-2 w-[50%] py-2 flex justify-center items-center rounded-l-lg`}>
//                 <Text
//                   className={`${
//                     isStudent ? 'text-white' : 'text-[#01818C]'
//                   } text-[13px] font-medium`}>
//                   Student
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => setIsStudent(false)}
//                 className={`${
//                   isStudent ? 'bg-[#ffffff]' : 'bg-[#01818C]'
//                 } border-[#01818C] border-2 w-[50%] py-2 flex justify-center items-center rounded-r-lg`}>
//                 <Text
//                   className={`${
//                     isStudent ? 'text-[#01818C]' : 'text-white'
//                   } text-[13px] font-medium`}>
//                   Teacher
//                 </Text>
//               </TouchableOpacity>
//             </View>
//             <View className="border-2 border-gray-300 flex justify-center items-center gap-y-4 w-[80%] pb-4 rounded-2xl">
//               {!isStudent && (
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     borderWidth: 2,
//                     borderColor: 'gray',
//                     borderRadius: 10,
//                     paddingHorizontal: 10,
//                     width: '90%',
//                   }}>
//                   <TextInput
//                     onChangeText={setEmail}
//                     value={email}
//                     placeholderTextColor={'gray'}
//                     placeholder="Enter Email ID..."
//                     style={{
//                       flex: 1,
//                       paddingLeft: 10,
//                       height: 40,
//                       color: 'gray',
//                     }}
//                   />
//                 </View>
//               )}
//               {isStudent && (
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     borderWidth: 2,
//                     borderColor: 'gray',
//                     borderRadius: 10,
//                     paddingHorizontal: 10,
//                     width: '90%',
//                   }}>
//                   <TextInput
//                     onChangeText={setRollNumber}
//                     placeholderTextColor={'gray'}
//                     value={rollNumber}
//                     placeholder="Enter Roll Number..."
//                     style={{
//                       flex: 1,
//                       paddingLeft: 10,
//                       height: 40,
//                       color: 'gray',
//                     }}
//                   />
//                 </View>
//               )}
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   borderWidth: 2,
//                   borderColor: 'gray',
//                   borderRadius: 10,
//                   paddingHorizontal: 10,
//                   width: '90%',
//                 }}>
//                 <TextInput
//                   onChangeText={setPassword}
//                   placeholderTextColor={'gray'}
//                   value={password}
//                   placeholder="Enter Password..."
//                   style={{flex: 1, paddingLeft: 10, height: 40, color: 'gray'}}
//                   secureTextEntry={true}
//                 />
//               </View>
//             </View>
//             <View className="flex flex-row justify-between w-[70%]">
//               <Text className="text-sm">Remember me</Text>
//               <TouchableOpacity
//                 onPress={
//                   () => {
//                     isStudent
//                       ? forgotPassword('student', rollNumber)
//                       : forgotPassword('teacher', email)
//                   }
//                 }>
//                 <Text className="text-[#01818C] underline">
//                   Forgot Password?
//                 </Text>
//               </TouchableOpacity>
//             </View>
//             <TouchableOpacity
//               onPress={isStudent ? handleStudentLogin : handleTeacherLogin}
//               className="bg-[#01818C] w-[70%] py-3 flex justify-center items-center rounded-lg">
//               <Text className="text-white text-[16px] font-bold">
//                 {loading ? (
//                   <ActivityIndicator animating={true} color={'white'} />
//                 ) : (
//                   'Login'
//                 )}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default LogIn;





/// 2nd try

import {
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import React from 'react';
import SignUp from './SignUp';
import {useAuth} from '../../utils/auth';
import {theme} from '../../theme';
import {ActivityIndicator} from 'react-native-paper';
import {BASE_URL} from '../../constants/constants';
import SInfo from 'react-native-encrypted-storage';

const LogIn = () => {
  const [isStudent, setIsStudent] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [rollNumber, setRollNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [showOTPModal, setShowOTPModal] = React.useState(false);
  const [otp, setOtp] = React.useState('');
  const [resetEmail, setResetEmail] = React.useState('');
  const [resetRollNumber, setResetRollNumber] = React.useState('');

  const {
    setIndex,
    setClasses,
    setTeacheridG,
    setDepartmentG,
    loading,
    setLoading,
    setRollNumberG,
    setTeacherNameG,
    setTeacherEmailG,
    setStudentidG,
    setStudentNameG,
    setStudentEmailG,
    setRefreshing,
  } = useAuth();

  const handleTeacherLogin = async () => {
    try {
      setLoading(true);
      if (!email || !password) {
        ToastAndroid.show('Fields Should Not Be Empty', ToastAndroid.LONG);
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/api/teacher/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      ToastAndroid.show(
        `Login Successful. Welcome ${data.fullName} !`,
        ToastAndroid.LONG,
      );
      console.log('Login Successful:', data);

      SInfo.setItem(
        'token',
        JSON.stringify({type: 'teacher', data: data.token}),
      );
      setClasses(
        data.coursesId.map(classItem => ({
          id: classItem._id,
        })),
      );
      setTeacheridG(data.id);
      setDepartmentG(data.department);
      setTeacherNameG(data.fullName);
      setTeacherEmailG(data.email);
      setIndex('1'); // Set index for teacher
      setRefreshing(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        `Login failed: ${error.message || 'Unknown error'}`,
        ToastAndroid.LONG,
      );
      setLoading(false);
    }
  };

  const handleStudentLogin = async () => {
    try {
      setLoading(true);
      if (!rollNumber || !password) {
        ToastAndroid.show('Fields Should Not Be Empty', ToastAndroid.LONG);
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/api/student/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rollNumber: rollNumber,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      ToastAndroid.show(
        `Login Successful. Welcome ${data.fullName} !`,
        ToastAndroid.LONG,
      );

      SInfo.setItem(
        'token',
        JSON.stringify({type: 'student', data: data.token}),
      );
      setRollNumberG(data.rollNumber);
      setIndex('2'); // Set index for student
      setStudentidG(data.id);
      setStudentNameG(data.fullName);
      setStudentEmailG(data.email);
      setLoading(false);
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        `Login failed: ${error.message || 'Unknown error'}`,
        ToastAndroid.LONG,
      );
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (isStudent) {
      if (!rollNumber) {
        ToastAndroid.show('Please enter your roll number first', ToastAndroid.LONG);
        return;
      }
      setResetRollNumber(rollNumber);
    } else {
      if (!email) {
        ToastAndroid.show('Please enter your email first', ToastAndroid.LONG);
        return;
      }
      setResetEmail(email);
    }
    sendOTP();
    setShowOTPModal(true);
  };

  const sendOTP = async () => {
    try {
      setLoading(true);
      const type = isStudent ? 'student' : 'teacher';
      const id = isStudent ? resetRollNumber : resetEmail;
      
      const response = await fetch(`${BASE_URL}/api/${type}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [isStudent ? 'rollNumber' : 'email']: id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send OTP');
      }

      const data = await response.json();
      ToastAndroid.show('OTP sent successfully!', ToastAndroid.LONG);
      setLoading(false);
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        `Failed to send OTP: ${error.message || 'Unknown error'}`,
        ToastAndroid.LONG,
      );
      setLoading(false);
    }
  };

  const verifyOTPAndReset = async () => {
    try {
      if (!otp) {
        ToastAndroid.show('Please enter OTP', ToastAndroid.LONG);
        return;
      }

      setLoading(true);
      const type = isStudent ? 'student' : 'teacher';
      const id = isStudent ? resetRollNumber : resetEmail;
      
      const response = await fetch(`${BASE_URL}/api/${type}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [isStudent ? 'rollNumber' : 'email']: id,
          otp: otp
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'OTP verification failed');
      }

      const data = await response.json();
      
      // Now reset the password
      const resetResponse = await fetch(`${BASE_URL}/api/${type}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [isStudent ? 'rollNumber' : 'email']: id
        }),
      });

      if (!resetResponse.ok) {
        const errorData = await resetResponse.json();
        throw new Error(errorData.error || 'Password reset failed');
      }

      ToastAndroid.show(
        'Password reset successful. Please sign up again with your new password.',
        ToastAndroid.LONG,
      );
      
      setShowOTPModal(false);
      setOtp('');
      setLoading(false);
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        `Error: ${error.message || 'Unknown error'}`,
        ToastAndroid.LONG,
      );
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView>
      <StatusBar
        backgroundColor={theme.maincolor}
        barStyle={'light-content'}
        hidden={false}
      />
      <ScrollView>
        {isSignUp ? (
          <SignUp setIsSignUp={setIsSignUp} setIsStudent={setIsStudent} />
        ) : (
          <View className="h-screen flex justify-center items-center gap-y-4 relative">
            <View className="h-28 w-28 bg-[#01818C] absolute top-0 left-0 rounded-br-full"></View>
            <View className="h-36 w-36 bg-[#01808c87] absolute top-0 left-0 rounded-br-full"></View>
            <View className="h-20 w-20 bg-[#01808c87] absolute bottom-0 right-0 rounded-tl-full"></View>
            <Image
              style={{width: 100, height: 100}}
              source={{
                uri: isStudent
                  ? 'https://icons.veryicon.com/png/o/avatar/character-series/student-10.png'
                  : 'https://icons.veryicon.com/png/o/miscellaneous/wisdom-training/teacher-27.png',
              }}
            />
            <View>
              <Text className="text-3xl font-bold text-[#2e2e2e]">
                {isStudent ? 'Student Login' : 'Teacher Login'}
              </Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500">
                Not a member yet?{' '}
                <Text
                  className="text-[#01818C] underline"
                  onPress={() => setIsSignUp(true)}>
                  Sign up!
                </Text>
              </Text>
            </View>
            <View className="flex flex-row justify-around w-[80%]">
              <TouchableOpacity
                onPress={() => setIsStudent(true)}
                className={`${
                  isStudent ? 'bg-[#01818C]' : 'bg-white'
                } border-[#01818C] border-2 w-[50%] py-2 flex justify-center items-center rounded-l-lg`}>
                <Text
                  className={`${
                    isStudent ? 'text-white' : 'text-[#01818C]'
                  } text-[13px] font-medium`}>
                  Student
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsStudent(false)}
                className={`${
                  isStudent ? 'bg-[#ffffff]' : 'bg-[#01818C]'
                } border-[#01818C] border-2 w-[50%] py-2 flex justify-center items-center rounded-r-lg`}>
                <Text
                  className={`${
                    isStudent ? 'text-[#01818C]' : 'text-white'
                  } text-[13px] font-medium`}>
                  Teacher
                </Text>
              </TouchableOpacity>
            </View>
            <View className="border-2 border-gray-300 flex justify-center items-center gap-y-4 w-[80%] pb-4 rounded-2xl">
              {!isStudent && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: 'gray',
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    width: '90%',
                  }}>
                  <TextInput
                    onChangeText={setEmail}
                    value={email}
                    placeholderTextColor={'gray'}
                    placeholder="Enter Email ID..."
                    style={{
                      flex: 1,
                      paddingLeft: 10,
                      height: 40,
                      color: 'gray',
                    }}
                  />
                </View>
              )}
              {isStudent && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: 'gray',
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    width: '90%',
                  }}>
                  <TextInput
                    onChangeText={setRollNumber}
                    placeholderTextColor={'gray'}
                    value={rollNumber}
                    placeholder="Enter Roll Number..."
                    style={{
                      flex: 1,
                      paddingLeft: 10,
                      height: 40,
                      color: 'gray',
                    }}
                  />
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: 'gray',
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  width: '90%',
                }}>
                <TextInput
                  onChangeText={setPassword}
                  placeholderTextColor={'gray'}
                  value={password}
                  placeholder="Enter Password..."
                  style={{flex: 1, paddingLeft: 10, height: 40, color: 'gray'}}
                  secureTextEntry={true}
                />
              </View>
            </View>
            <View className="flex flex-row justify-between w-[70%]">
              <Text className="text-sm">Remember me</Text>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text className="text-[#01818C] underline">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={isStudent ? handleStudentLogin : handleTeacherLogin}
              className="bg-[#01818C] w-[70%] py-3 flex justify-center items-center rounded-lg">
              <Text className="text-white text-[16px] font-bold">
                {loading ? (
                  <ActivityIndicator animating={true} color={'white'} />
                ) : (
                  'Login'
                )}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* OTP Verification Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showOTPModal}
          onRequestClose={() => {
            setShowOTPModal(false);
          }}>
          <View className="flex-1 justify-center items-center bg-[#00000080]">
            <View className="bg-white rounded-lg p-5 w-80">
              <Text className="text-lg font-bold mb-4 text-center">
                OTP Verification
              </Text>
              <Text className="text-sm mb-4 text-center">
                We've sent an OTP to your {isStudent ? 'registered email' : 'email'}. 
                Please enter it below to reset your password.
              </Text>
              
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: 'gray',
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  marginBottom: 20,
                }}>
                <TextInput
                  onChangeText={setOtp}
                  value={otp}
                  placeholderTextColor={'gray'}
                  placeholder="Enter OTP"
                  keyboardType="numeric"
                  style={{
                    flex: 1,
                    paddingLeft: 10,
                    height: 40,
                    color: 'gray',
                  }}
                />
              </View>

              <View className="flex flex-row justify-between">
                <TouchableOpacity
                  onPress={() => {
                    setShowOTPModal(false);
                    setOtp('');
                  }}
                  className="bg-gray-300 px-6 py-2 rounded-lg">
                  <Text className="text-black">Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={verifyOTPAndReset}
                  className="bg-[#01818C] px-6 py-2 rounded-lg">
                  <Text className="text-white">
                    {loading ? (
                      <ActivityIndicator animating={true} color={'white'} />
                    ) : (
                      'Reset Password'
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LogIn;