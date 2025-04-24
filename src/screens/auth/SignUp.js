import React, {useState, useEffect} from 'react';
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
import {BASE_URL} from '../../constants/constants';
import PropTypes from 'prop-types';

const SignUp = props => {
  const {loading, setLoading} = useAuth();
  const navigation = useNavigation();

  const [isStudent, setIsStudent] = useState(true);
  const [mul, setMul] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showOtpFields, setShowOtpFields] = useState(false);
  const [otpToken, setOtpToken] = useState(null); // State to store OTP token
  const [counter, setCounter] = useState(30); // State to manage countdown timer

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

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('response', response.status);
        ToastAndroid.show('OTP sent to your email', ToastAndroid.LONG);
        setShowOtpFields(true); // Show OTP and password fields
        setMul(mul + 1);
        setCounter(mul * 30);

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (counter == 0) clearInterval(interval);
      else setCounter(counter - 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [counter]);

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
        `${BASE_URL}${endpoint}`,
        {
          email,
          otp: otp2, // Send the parsed integer OTP
          password,
        },
        {
          headers: {
            // Include the OTP token in the Authorization header
            Authorization: `Bearer ${otpToken}`,
          },
        },
      );

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

        {showOtpFields ? (
          counter > 0 ? (
            <Text className="text-sm text-[#01818C]">
              Resend OTP in{' '}
              {Math.floor(counter / 60)
                .toString()
                .padStart(2, '0')}
              :{(counter % 60).toString().padStart(2, '0')} seconds
            </Text>
          ) : (
            <TouchableOpacity
              disabled={counter > 0}
              onPress={() => {
                // Reset seconds to 30 when resent OTP is clicked
                handleSendOtp();
              }}>
              <Text className="text-sm text-[#01818C] underline">
                Resend OTP
              </Text>
            </TouchableOpacity>
          )
        ) : (
          <></>
        )}

        <TouchableOpacity
          onPress={() => {
            if (!showOtpFields) {
              handleSendOtp();
            } else {
              handleVerifyOtpAndRegister();
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
  );
};

SignUp.propTypes = {
  setIsSignUp: PropTypes.func.isRequired, // Add prop validation for setIsSignUp
};

export default SignUp;
