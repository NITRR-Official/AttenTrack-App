// import { Image, KeyboardAvoidingView, StatusBar, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
// import React from 'react';
// import ReportIcon from '../../components/ReportIcon';
// import { theme } from '../../theme';
// import { useAuth } from '../../utils/auth';

// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import { ActivityIndicator } from 'react-native-paper';

// const SignUp = (props) => {

//   const { loading, setLoading } = useAuth();

//   const [isStudent, setIsStudent] = React.useState(true);
//   const [email, setEmail] = React.useState('');
//   const [fullName, setFullName] = React.useState('');
//   const [rollNumber, setRollNumber] = React.useState('');
//   const [password, setPassword] = React.useState('');
//   const [passwordConfirm, setPasswordConfirm] = React.useState('');
//   const [department, setDepartment] = React.useState('');

//   const handleTeacherSignUp = async () => {
//     try {
//       setLoading(true);
//       if(!email || !fullName || !department || !password) {
//         ToastAndroid.show('Fields Should Not Be Empty',ToastAndroid.LONG);
//         setLoading(false);
//         return;
//       }
//       if(password!==passwordConfirm){
//         ToastAndroid.show('Password Does not Match',ToastAndroid.LONG);
//         setLoading(false);
//         return;
//       }
//         const response = await axios.post('https://attendancetrackerbackend.onrender.com/api/teacher/register', {
//             email: email,
//             fullName: fullName,
//             department: department,
//             password: password,
//         });
//         console.log('Registration Successful:', response.data);
//         ToastAndroid.show('Registration Successful !', ToastAndroid.LONG);
//         props.setIsStudent(false);
//         props.setIsSignUp(false);
//         setLoading(false);
//     } catch (error) {
//       if(typeof(error.response.data.error)=="string"){
//         ToastAndroid.show(`Registration failed: ${error.response.data.error}`, ToastAndroid.LONG);
//       }else{
//         ToastAndroid.show(`Registration failed: ${error.response.data}`, ToastAndroid.LONG);
//       }
//       setLoading(false);
//     }
// };

//   const handleStudentSignUp = async () => {
//     try {
//       setLoading(true);
//       if(!email || !fullName || !rollNumber || !password) {
//         ToastAndroid.show('Fields Should Not Be Empty',ToastAndroid.LONG);
//         setLoading(false);
//         return;
//       }
//       if(password!==passwordConfirm){
//         ToastAndroid.show('Password Does not Match',ToastAndroid.LONG);
//         setLoading(false);
//         return;
//       }
//         const response = await axios.post('https://attendancetrackerbackend.onrender.com/api/student/register', {
//             email: email,
//             fullName: fullName,
//             rollNumber: rollNumber,
//             password: password,
//         });
//         console.log('Registration successful:', response.data);
//         ToastAndroid.show('Registration Successful !', ToastAndroid.LONG);
//         props.setIsStudent(true);
//         props.setIsSignUp(false);
//         setLoading(false);
//     } catch (error) {
//       ToastAndroid.show(`Registration failed: ${error.response.data}`, ToastAndroid.LONG);
//       setLoading(false);
//     }
// };

//   return (
//     <>
//       <KeyboardAvoidingView>
//         <StatusBar
//           backgroundColor={theme.maincolor}
//           barStyle={"light-content"}
//           hidden={false}
//         />
//         <View className="h-screen flex justify-center items-center gap-y-4 relative">
//           <View className="h-28 w-28 bg-[#01818C] absolute top-0 left-0 rounded-br-full"></View>
//           <View className="h-36 w-36 bg-[#01808c87] absolute top-0 left-0 rounded-br-full"></View>
//           <View className="h-20 w-20 bg-[#01808c87] absolute bottom-0 right-0 rounded-tl-full"></View>
//           {/* <View><ReportIcon color={'#01818C'} size={30} /></View> */}
//           <Image
//       style={{width:100, height:100}}
//        source={{
//         uri: isStudent?'https://icons.veryicon.com/png/o/avatar/character-series/student-10.png':'https://icons.veryicon.com/png/o/miscellaneous/wisdom-training/teacher-27.png',
//       }}
//       />
//           <View><Text className="text-3xl font-bold text-[#2e2e2e]">{isStudent ? 'Student Sign Up' : 'Teacher Sign Up'}</Text></View>
//           <View><Text className="text-sm text-gray-500">Already have an account? <Text className="text-[#01818C] underline" onPress={() => props.setIsSignUp(false)}>Log In!</Text></Text></View>
//           <View className="flex flex-row justify-around w-[80%]">

//             <TouchableOpacity onPress={() => setIsStudent(true)} className={`${isStudent ? 'bg-[#01818C]' : 'bg-white'} border-[#01818C] border-2 w-[50%] py-2 flex justify-center items-center rounded-l-lg`}><Text className={`${isStudent ? 'text-white' : 'text-[#01818C]'} text-[13px] font-medium`}>Student</Text></TouchableOpacity>

//             <TouchableOpacity onPress={() => setIsStudent(false)} className={`${isStudent ? 'bg-[#ffffff]' : 'bg-[#01818C]'} border-[#01818C] border-2 w-[50%] py-2 flex justify-center items-center rounded-r-lg`}><Text className={`${isStudent ? 'text-[#01818C]' : 'text-white'} text-[13px] font-medium`}>Teacher</Text></TouchableOpacity>

//           </View>
//           <View className="border-2 border-gray-300 flex justify-center items-center gap-y-4 w-[80%] pb-4 rounded-2xl">
//             <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, width: '90%' }}>
//               <TextInput
//                 placeholderTextColor='#909090'
//                 onChangeText={setEmail}
//                 value={email}
//                 placeholder="Enter Email ID..."
//                 style={{ flex: 1, paddingLeft: 10, height: 40, color: 'gray' }}
//               />
//             </View>
//             <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, width: '90%' }}>
//               <TextInput
//                 placeholderTextColor='#909090'
//                 onChangeText={setFullName}
//                 value={fullName}
//                 placeholder="Enter Full Name..."
//                 style={{ flex: 1, paddingLeft: 10, height: 40, color: 'gray' }}
//               />
//             </View>
//             {isStudent && <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, width: '90%' }}>
//               <TextInput
//                 placeholderTextColor='#909090'
//                 onChangeText={setRollNumber}
//                 value={rollNumber}
//                 placeholder="Enter Roll Number..."
//                 style={{ flex: 1, paddingLeft: 10, height: 40, color: 'gray' }}
//               />
//             </View>}
//             {!isStudent && <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, width: '90%' }}>
//               <TextInput
//                 placeholderTextColor='#909090'
//                 onChangeText={setDepartment}
//                 value={department}
//                 placeholder="Enter Department..."
//                 style={{ flex: 1, paddingLeft: 10, height: 40, color: 'gray' }}
//               />
//             </View>}
//             <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, width: '90%' }}>
//               <TextInput
//                 placeholderTextColor='#909090'
//                 onChangeText={setPassword}
//                 value={password}
//                 placeholder="Enter Password..."
//                 style={{ flex: 1, paddingLeft: 10, height: 40, color: 'gray' }}
//                 secureTextEntry={true}
//               />
//             </View>
//             <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, width: '90%' }}>
//               <TextInput
//                 placeholderTextColor='#909090'
//                 onChangeText={setPasswordConfirm}
//                 value={passwordConfirm}
//                 placeholder="Enter Password Again..."
//                 style={{ flex: 1, paddingLeft: 10, height: 40, color: 'gray' }}
//                 secureTextEntry={true}
//               />
//             </View>
//           </View>
//           <TouchableOpacity
//           onPress={ () => {
//             isStudent?handleStudentSignUp():handleTeacherSignUp();
//           }}
//           // onPress={() => navigation.navigate('LogIn')}
//           className="bg-[#01818C] w-[70%] py-3 flex justify-center items-center rounded-lg"><Text className="text-white text-[16px] font-bold">{loading?<ActivityIndicator animating={true} color={'white'} />:'Sign Up'}</Text></TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </>
//   );
// };

// export default SignUp;

/// 2nd try -----------------------------------

// import React from 'react';
// import { Image, KeyboardAvoidingView, StatusBar, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
// import { ActivityIndicator } from 'react-native-paper';
// import axios from 'axios';
// import { theme } from '../../theme';
// import { useAuth } from '../../utils/auth';
// import { useNavigation } from '@react-navigation/native';

// const SignUp = (props) => {
//   const { loading, setLoading } = useAuth();
//   const navigation = useNavigation();

//   const [isStudent, setIsStudent] = React.useState(true);
//   const [email, setEmail] = React.useState('');
//   const [otp, setOtp] = React.useState('');
//   const [password, setPassword] = React.useState('');
//   const [passwordConfirm, setPasswordConfirm] = React.useState('');
//   const [showOtpFields, setShowOtpFields] = React.useState(false);
//   const [otpSent, setOtpSent] = React.useState(false);

//   // Function to send OTP
//   const handleSendOtp = async () => {
//     try {
//       setLoading(true);
//       if (!email) {
//         ToastAndroid.show('Email is required', ToastAndroid.LONG);
//         setLoading(false);
//         return;
//       }

//       const endpoint = isStudent ? '/api/student/register' : '/api/teacher/register';
//       const response = await axios.post(`https://attentrackbackend-production.up.railway.app${endpoint}`, { email });

//       // Check if OTP was sent successfully
//       if (response.status === 200) {
//         ToastAndroid.show('OTP sent to your email', ToastAndroid.LONG);
//         setShowOtpFields(true); // Show OTP and password fields
//         setOtpSent(true);

//         // Store the OTP token (if returned by the backend)
//         if (response.data.otpToken) {
//           // You can store this token in state or context for later use
//           console.log('OTP Token:', response.data.otpToken);
//         }
//       } else {
//         ToastAndroid.show(response.data.error || 'Failed to send OTP', ToastAndroid.LONG);
//       }
//     } catch (error) {
//       // Handle specific error cases
//       if (error.response) {
//         if (error.response.status === 404) {
//           ToastAndroid.show('Email not found. Please contact your admin/teacher.', ToastAndroid.LONG);
//         } else if (error.response.status === 403) {
//           ToastAndroid.show('User already registered. Please login.', ToastAndroid.LONG);
//         } else {
//           ToastAndroid.show('Failed to send OTP. Please try again.', ToastAndroid.LONG);
//         }
//       } else {
//         ToastAndroid.show('Network error. Please check your connection.', ToastAndroid.LONG);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to verify OTP and register
//   const handleVerifyOtpAndRegister = async () => {
//     try {
//       setLoading(true);
//       if (!email || !otp || !password || !passwordConfirm) {
//         ToastAndroid.show('All fields are required', ToastAndroid.LONG);
//         setLoading(false);
//         return;
//       }
//       if (password !== passwordConfirm) {
//         ToastAndroid.show('Passwords do not match', ToastAndroid.LONG);
//         setLoading(false);
//         return;
//       }

//       const endpoint = isStudent ? '/api/student/verify-otp' : '/api/teacher/verify-otp';
//       const response = await axios.post(`https://attentrackbackend-production.up.railway.app${endpoint}`, {
//         email,
//         otp,
//         password,
//       }

//     );
//     console.log('response' , response);

//       if (response.status === 200 || response.status === 201) {
//         ToastAndroid.show('Registration Successful!', ToastAndroid.LONG);
//         props.setIsSignUp(false); // Close the signup modal
//         navigation.navigate('Login'); // Navigate to the login screen
//       } else {
//         ToastAndroid.show(response.data.error || 'Registration failed', ToastAndroid.LONG);
//       }
//     } catch (error) {
//       if (error.response) {
//         ToastAndroid.show(`Registration failed: ${error.response.data.error}`, ToastAndroid.LONG);
//       } else {
//         ToastAndroid.show('Network error. Please check your connection.', ToastAndroid.LONG);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <KeyboardAvoidingView>
//         <StatusBar backgroundColor={theme.maincolor} barStyle={'light-content'} hidden={false} />
//         <View className="h-screen flex justify-center items-center gap-y-4 relative">
//           <View className="h-28 w-28 bg-[#01818C] absolute top-0 left-0 rounded-br-full"></View>
//           <View className="h-36 w-36 bg-[#01808c87] absolute top-0 left-0 rounded-br-full"></View>
//           <View className="h-20 w-20 bg-[#01808c87] absolute bottom-0 right-0 rounded-tl-full"></View>

//           <Image
//             style={{ width: 100, height: 100 }}
//             source={{
//               uri: isStudent
//                 ? 'https://icons.veryicon.com/png/o/avatar/character-series/student-10.png'
//                 : 'https://icons.veryicon.com/png/o/miscellaneous/wisdom-training/teacher-27.png',
//             }}
//           />

//           <View>
//             <Text className="text-3xl font-bold text-[#2e2e2e]">{isStudent ? 'Student Sign Up' : 'Teacher Sign Up'}</Text>
//           </View>

//           <View>
//             <Text className="text-sm text-gray-500">
//               Already have an account?{' '}
//               <Text className="text-[#01818C] underline" onPress={() => props.setIsSignUp(false)}>
//                 Log In!
//               </Text>
//             </Text>
//           </View>

//           <View className="flex flex-row justify-around w-[80%]">
//             <TouchableOpacity
//               onPress={() => setIsStudent(true)}
//               className={`${isStudent ? 'bg-[#01818C]' : 'bg-white'} border-[#01818C] border-2 w-[50%] py-2 flex justify-center items-center rounded-l-lg`}
//             >
//               <Text className={`${isStudent ? 'text-white' : 'text-[#01818C]'} text-[13px] font-medium`}>Student</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => setIsStudent(false)}
//               className={`${isStudent ? 'bg-white' : 'bg-[#01818C]'} border-[#01818C] border-2 w-[50%] py-2 flex justify-center items-center rounded-r-lg`}
//             >
//               <Text className={`${isStudent ? 'text-[#01818C]' : 'text-white'} text-[13px] font-medium`}>Teacher</Text>
//             </TouchableOpacity>
//           </View>

//           <View className="border-2 border-gray-300 flex justify-center items-center gap-y-4 w-[80%] pb-4 rounded-2xl">
//             {/* Email Field */}
//             <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, width: '90%' }}>
//               <TextInput
//                 placeholderTextColor="#909090"
//                 onChangeText={setEmail}
//                 value={email}
//                 placeholder="Enter Email ID..."
//                 style={{ flex: 1, paddingLeft: 10, height: 40, color: 'gray' }}
//               />
//             </View>

//             {/* OTP and Password Fields (Conditional Rendering) */}
//             {showOtpFields && (
//               <>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, width: '90%' }}>
//                   <TextInput
//                     placeholderTextColor="#909090"
//                     onChangeText={setOtp}
//                     value={otp}
//                     placeholder="Enter OTP..."
//                     style={{ flex: 1, paddingLeft: 10, height: 40, color: 'gray' }}
//                   />
//                 </View>

//                 <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, width: '90%' }}>
//                   <TextInput
//                     placeholderTextColor="#909090"
//                     onChangeText={setPassword}
//                     value={password}
//                     placeholder="Enter Password..."
//                     style={{ flex: 1, paddingLeft: 10, height: 40, color: 'gray' }}
//                     secureTextEntry={true}
//                   />
//                 </View>

//                 <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, width: '90%' }}>
//                   <TextInput
//                     placeholderTextColor="#909090"
//                     onChangeText={setPasswordConfirm}
//                     value={passwordConfirm}
//                     placeholder="Enter Password Again..."
//                     style={{ flex: 1, paddingLeft: 10, height: 40, color: 'gray' }}
//                     secureTextEntry={true}
//                   />
//                 </View>
//               </>
//             )}
//           </View>

//           <TouchableOpacity
//             onPress={() => {
//               if (!showOtpFields) {
//                 handleSendOtp(); // Step 1: Send OTP
//               } else {
//                 handleVerifyOtpAndRegister(); // Step 2: Verify OTP and Register
//               }
//             }}
//             className="bg-[#01818C] w-[70%] py-3 flex justify-center items-center rounded-lg"
//           >
//             <Text className="text-white text-[16px] font-bold">
//               {loading ? <ActivityIndicator animating={true} color={'white'} /> : showOtpFields ? 'Verify OTP and Register' : 'Send OTP'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </>
//   );
// };

// export default SignUp;









// // 3rd try
import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  StatusBar,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import axios from 'axios';
import {theme} from '../../theme';
import {useAuth} from '../../utils/auth';
import {useNavigation} from '@react-navigation/native';

const SignUp = props => {
  const {loading, setLoading} = useAuth();
  const navigation = useNavigation();

  const [isStudent, setIsStudent] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordConfirm, setPasswordConfirm] = React.useState('');
  const [showOtpFields, setShowOtpFields] = React.useState(false);
  const [otpSent, setOtpSent] = React.useState(false);
  const [otpToken, setOtpToken] = React.useState(null); // State to store OTP token

  // Function to send OTP
  const handleSendOtp = async () => {
    try {
      setLoading(true);
      if (!email) {
        ToastAndroid.show('Email is required', ToastAndroid.LONG);
        setLoading(false);
        return;
      }
  
      const endpoint = isStudent
        ? '/api/student/register'
        : '/api/teacher/register';
  
      const response = await fetch(
        `https://attentrackbackend-production.up.railway.app${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('response', response.status);
        ToastAndroid.show('OTP sent to your email', ToastAndroid.LONG);
        setShowOtpFields(true); // Show OTP and password fields
        setOtpSent(true);
  
        // Store the OTP token (if returned by the backend)
        if (data.otpToken) {
          setOtpToken(data.otpToken); // Store the OTP token
          console.log('OTP Token:', data.otpToken);
        }
      } else {
        ToastAndroid.show(
          data.error || 'Failed to send OTP',
          ToastAndroid.LONG
        );
      }
    } catch (error) {
      console.log(error);
      if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
        ToastAndroid.show(
          'Network error. Please check your connection.',
          ToastAndroid.LONG
        );
      } else {
        ToastAndroid.show(
          'Failed to send OTP. Please try again.',
          ToastAndroid.LONG
        );
      }
    } finally {
      setLoading(false);
    }
  };
  // Function to verify OTP and register
  const handleVerifyOtpAndRegister = async () => {
    try {
      setLoading(true);
      console.log(typeof parse);
      if (!email || !otp || !password || !passwordConfirm) {
        ToastAndroid.show('All fields are required', ToastAndroid.LONG);
        setLoading(false);
        return;
      }
      if (password !== passwordConfirm) {
        ToastAndroid.show('Passwords do not match', ToastAndroid.LONG);
        setLoading(false);
        return;
      }
      const otp2 = Number.parseInt(otp, 10); // Ensure radix is 10 for decimal parsing
const endpoint = isStudent
  ? '/api/student/verify-otp'
  : '/api/teacher/verify-otp';

const response = await axios.post(
  `https://attentrackbackend-production.up.railway.app${endpoint}`,
  {
    email,
    otp: otp2, // Send the parsed integer OTP
    password,
  },
  {
    headers: {
      // Include the OTP token in the Authorization header
      Authorization: `Bearer ${otpToken}`
    },
  },
);

      console.log('Response:', response); // Log the full response

      if (response.status === 200 || response.status === 201) {
        ToastAndroid.show('Registration Successful!', ToastAndroid.LONG);
        props.setIsSignUp(false); // Close the signup modal
        navigation.navigate('LogIn'); // Navigate to the login screen
      } else {
        ToastAndroid.show(
          response.data.error || 'Registration failed',
          ToastAndroid.LONG,
        );
      }
    } catch (error) {
      console.error('Error during registration:', error); // Log the full error
      if (error.response) {
        console.info('Response data:', error.response.data); // Log response data
        console.info('Response status:', error.response.status); // Log status code
        ToastAndroid.show(
          `Registration failed: ${error.response.data.error}`,
          ToastAndroid.LONG,
        );
      } else {
        ToastAndroid.show(
          'Network error. Please check your connection.',
          ToastAndroid.LONG,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <KeyboardAvoidingView>
        <StatusBar
          backgroundColor={theme.maincolor}
          barStyle={'light-content'}
          hidden={false}
        />
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
              {isStudent ? 'Student Sign Up' : 'Teacher Sign Up'}
            </Text>
          </View>

          <View>
            <Text className="text-sm text-gray-500">
              Already have an account?{' '}
              <Text
                className="text-[#01818C] underline"
                onPress={() => props.setIsSignUp(false)}>
                Log In!
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
                isStudent ? 'bg-white' : 'bg-[#01818C]'
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
            {/* Email Field */}
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
                placeholderTextColor="#909090"
                onChangeText={setEmail}
                value={email}
                placeholder="Enter Email ID..."
                style={{flex: 1, paddingLeft: 10, height: 40, color: 'gray'}}
              />
            </View>

            {/* OTP and Password Fields (Conditional Rendering) */}
            {showOtpFields && (
              <>
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
                    placeholderTextColor="#909090"
                    onChangeText={setOtp}
                    value={otp}
                    placeholder="Enter OTP..."
                    style={{
                      flex: 1,
                      paddingLeft: 10,
                      height: 40,
                      color: 'gray',
                    }}
                  />
                </View>

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
                    placeholderTextColor="#909090"
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Enter Password..."
                    style={{
                      flex: 1,
                      paddingLeft: 10,
                      height: 40,
                      color: 'gray',
                    }}
                    secureTextEntry={true}
                  />
                </View>

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
                    placeholderTextColor="#909090"
                    onChangeText={setPasswordConfirm}
                    value={passwordConfirm}
                    placeholder="Enter Password Again..."
                    style={{
                      flex: 1,
                      paddingLeft: 10,
                      height: 40,
                      color: 'gray',
                    }}
                    secureTextEntry={true}
                  />
                </View>
              </>
            )}
          </View>

          <TouchableOpacity
            onPress={() => {
              if (!showOtpFields) {
                handleSendOtp(); // Step 1: Send OTP
              } else {
                handleVerifyOtpAndRegister(); // Step 2: Verify OTP and Register
              }
            }}
            className="bg-[#01818C] w-[70%] py-3 flex justify-center items-center rounded-lg">
            <Text className="text-white text-[16px] font-bold">
              {loading ? (
                <ActivityIndicator animating={true} color={'white'} />
              ) : showOtpFields ? (
                'Verify OTP and Register'
              ) : (
                'Send OTP'
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignUp;
