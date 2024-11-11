
import { KeyboardAvoidingView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View, SafeAreaView, ToastAndroid } from 'react-native';
import React from 'react';
import ReportIcon from '../../components/ReportIcon';
import SignUp from './SignUp';

import { useAuth } from '../../utils/auth';
import { theme } from '../../theme';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';


const LogIn = () => {

  const [isStudent, setIsStudent] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [rollNumber, setRollNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [isSignUp, setIsSignUp] = React.useState(false);

  const { setIndex, setClasses, setTeacherid, setDepartmentG, loading, setLoading } = useAuth();

  const handleTeacherLogin = async () => {
    try {
      setLoading(true);
      if(!email || !department || !password) {
        ToastAndroid.show('Fields Should Not Be Empty',ToastAndroid.LONG);
        return;
      }
        const response = await axios.post('https://attendancetrackerbackend.onrender.com/api/teacher/login', {
            email: email,
            department: department,
            password: password,
        });
        ToastAndroid.show(`Login Successful. Welcome ${response.data.fullName} !`, ToastAndroid.LONG);
        console.log('Login Successful:', response.data);
        setClasses(response.data.classes);
        setTeacherid(response.data._id);
        setDepartmentG(response.data.department);
        setIndex(1);
        setLoading(false);
    } catch (error) {
      ToastAndroid.show(`Login failed: ${error.response.data.error}`, ToastAndroid.LONG);
      setLoading(false);
    }
};

  const handleStudentLogin = async () => {
    try {
      setLoading(true);
      if(!email || !rollNumber || !password) {
        ToastAndroid.show('Fields Should Not Be Empty',ToastAndroid.LONG);
        return;
      }
        const response = await axios.post('https://attendancetrackerbackend.onrender.com/api/student/login', {
            email: email,
            rollNumber: rollNumber,
            password: password,
        });
        console.log('Login successful:', response.data);
        ToastAndroid.show(`Login Successful. Welcome ${response.data.fullName} !`, ToastAndroid.LONG);
        setIndex(2);
        setLoading(false);
    } catch (error) {
      ToastAndroid.show(`Login failed: ${error.response.data.error}`, ToastAndroid.LONG);
      setLoading(false);
    }
};

  return (
    <>
      <KeyboardAvoidingView>
      <StatusBar
        backgroundColor={theme.maincolor}
        barStyle={"light-content"}
        hidden={false}
      />
      <ScrollView >
       {isSignUp ? (
        <SignUp setIsSignUp={setIsSignUp} setIsStudent={setIsStudent}/>  // Show the SignUp component if isSignUp is true
      ) : (
        <>
        <View className="h-screen flex justify-center items-center gap-y-4 relative">
      <View className="h-28 w-28 bg-[#01818C] absolute top-0 left-0 rounded-br-full"></View>
      <View className="h-36 w-36 bg-[#01808c87] absolute top-0 left-0 rounded-br-full"></View>
      <View className="h-20 w-20 bg-[#01808c87] absolute bottom-0 right-0 rounded-tl-full"></View>
      <View><ReportIcon color={'#01818C'} size={30}/></View>
      <View><Text className="text-3xl font-bold text-[#2e2e2e]">{isStudent?'Student Login':'Teacher Login'}</Text></View>
      <View><Text className="text-sm text-gray-500">Not a member yet? <Text className="text-[#01818C] underline" onPress={() => setIsSignUp(true)}>Sign up!</Text></Text></View>
      <View className="flex flex-row justify-around w-[80%]">
        
      <TouchableOpacity onPress={()=>setIsStudent(true)} className={`${isStudent?'bg-[#01818C]':'bg-white'} border-[#01818C] border-2 w-[50%] py-2 flex justify-center items-center rounded-l-lg`}><Text className={`${isStudent?'text-white':'text-[#01818C]'} text-[13px] font-medium`}>Student</Text></TouchableOpacity>
        
      <TouchableOpacity onPress={()=>setIsStudent(false)} className={`${isStudent?'bg-[#ffffff]':'bg-[#01818C]'} border-[#01818C] border-2 w-[50%] py-2 flex justify-center items-center rounded-r-lg`}><Text className={`${isStudent?'text-[#01818C]':'text-white'} text-[13px] font-medium`}>Teacher</Text></TouchableOpacity>
        
        </View>
      <View className="border-2 border-gray-300 flex justify-center items-center gap-y-4 w-[80%] pb-4 rounded-2xl">
      <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, width: '90%' }}>
        <TextInput
          onChangeText={setEmail}
          value={email}
          placeholderTextColor={'gray'}
          placeholder="Enter Email ID..."
          style={{ flex: 1, paddingLeft: 10, height: 40, color: 'gray' }}
        />
      </View>
      {isStudent&&<View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, width: '90%' }}>
        <TextInput
          onChangeText={setRollNumber}
          placeholderTextColor={'gray'}
          value={rollNumber}
          placeholder="Enter Roll Number..."
          style={{ flex: 1, paddingLeft: 10, height: 40, color: 'gray' }}
        />
      </View>}
      {!isStudent&&<View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, width: '90%' }}>
        <TextInput
          onChangeText={setDepartment}
          placeholderTextColor={'gray'}
          value={department}
          placeholder="Enter Department..."
          style={{ flex: 1, paddingLeft: 10, height: 40, color: 'gray' }}
        />
      </View>}
      <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, width: '90%' }}>
        <TextInput
          onChangeText={setPassword}
          placeholderTextColor={'gray'}
          value={password}
          placeholder="Enter Password..."
          style={{ flex: 1, paddingLeft: 10, height: 40, color: 'gray' }}
          secureTextEntry={true}
        />
      </View>
      </View>

      <View className="flex flex-row justify-between w-[70%]">
        <Text className="text-sm">Remember me</Text>
        <Text className="text-[#01818C] underline">Forgot Password?</Text>
      </View>
      <TouchableOpacity onPress={()=>isStudent?handleStudentLogin():handleTeacherLogin()} className="bg-[#01818C] w-[70%] py-3 flex justify-center items-center rounded-lg"><Text className="text-white text-[16px] font-bold">{loading?<ActivityIndicator animating={true} color={'white'} />:'Login'}</Text></TouchableOpacity>
      </View>
      </>
      )}
            </ScrollView>
            </KeyboardAvoidingView>
      </>
  );
};

export default LogIn;