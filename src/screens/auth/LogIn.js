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
} from 'react-native';
import React, {useState} from 'react';
import SignUp from './SignUp';
import {useAuth} from '../../utils/auth';
import {theme} from '../../theme';
import {ActivityIndicator} from 'react-native-paper';
import {BASE_URL} from '../../constants/constants';
import SInfo from 'react-native-encrypted-storage';
import ForgotPassword from '../../components/ForgotPassword';

const LogIn = () => {
  const [isStudent, setIsStudent] = useState(true);
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [otpToken, setOtpToken] = useState(null);
  const [dialog, setDialog] = useState(false);

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
    setInterest,
    setEduQualification,
    setTelephone,
    setBranch,
    setSemester,
    setPass,
    setEnroll,
    setPhone
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
      SInfo.setItem(
        'token',
        JSON.stringify({type: 'teacher', data: data.token, email: data.email, name: data.fullName, department: data.department, id: data.id}),
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
      setInterest(data.interest);
      setEduQualification(data.eduQualification);
      setTelephone(data.telephone);
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
      ToastAndroid.show(
        `Login Successful. Welcome ${data.fullName} !`,
        ToastAndroid.LONG,
      );

      SInfo.setItem(
        'token',
        JSON.stringify({type: 'student', data: data.token, roll: data.rollNumber, name: data.fullName, email: data.email, id: data.id}),
      );
      setRollNumberG(data.rollNumber);
      setIndex('2'); // Set index for student
      setStudentidG(data.id);
      setStudentNameG(data.fullName);
      setStudentEmailG(data.email);
      setBranch(data.branch);
      setSemester(data.semester);
      setPass(data.batch);
      setEnroll(data.enroll);
      setPhone(data.phone);
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

  const handleSendOtp = async (type, id) => {
    console.log('Sending OTP:', type, id);
    try {
      setLoading(true);
      if (!id) {
        ToastAndroid.show('Email or Rollnumber is required', ToastAndroid.LONG);
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/api/${type}/otp-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:
          type == 'student'
            ? JSON.stringify({
                rollNumber: id,
              })
            : JSON.stringify({
                email: id,
              }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('response', response.status);
        ToastAndroid.show('OTP sent to your email', ToastAndroid.LONG);
        setDialog(true);

        // Store the OTP token (if returned by the backend)
        if (data.otpToken) {
          setOtpToken(data.otpToken); // Store the OTP token
          console.log('OTP Token:', data.otpToken);
        }
      } else {
        ToastAndroid.show(
          data.error || 'Failed to send OTP',
          ToastAndroid.LONG,
        );
      }
    } catch (error) {
      console.log(error);
      if (
        error.name === 'TypeError' &&
        error.message.includes('Network request failed')
      ) {
        ToastAndroid.show(
          'Network error. Please check your connection.',
          ToastAndroid.LONG,
        );
      } else {
        ToastAndroid.show(
          'Failed to send OTP. Please try again.',
          ToastAndroid.LONG,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = close => {
    setDialog(close);
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
            {dialog &&
              (isStudent ? (
                <ForgotPassword
                  closeDialog={handleClose}
                  type={'student'}
                  id={rollNumber}
                  otpToken={otpToken}
                />
              ) : (
                <ForgotPassword
                  closeDialog={handleClose}
                  type={'teacher'}
                  id={email}
                  otpToken={otpToken}
                />
              ))}
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
              <TouchableOpacity
                onPress={() => {
                  isStudent
                    ? handleSendOtp('student', rollNumber)
                    : handleSendOtp('teacher', email);
                }}>
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LogIn;
