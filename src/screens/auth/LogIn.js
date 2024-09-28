import { KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';
import ReportIcon from '../../components/ReportIcon';
import SignUp from './SignUp';
import Icon from 'react-native-vector-icons/FontAwesome';


const LogIn = () => {
  const [isStudent, setIsStudent] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [rollNumber, setRollNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [isSignUp, setIsSignUp] = React.useState(false);
  return (
    <>
          <KeyboardAvoidingView>
      <ScrollView >
       {isSignUp ? (
        <SignUp setIsSignUp={setIsSignUp}/>  // Show the SignUp component if isSignUp is true
      ) : (
        <>
        <View className="h-screen flex justify-center items-center gap-y-4 relative">
      <View className="h-28 w-28 bg-[#01818C] absolute top-0 left-0 rounded-br-full"></View>
      <View className="h-36 w-36 bg-[#01808c87] absolute top-0 left-0 rounded-br-full"></View>
      <View className="h-20 w-20 bg-[#01808c87] absolute bottom-0 right-0 rounded-tl-full"></View>
      <View><ReportIcon color={'#01818C'} size={30}/></View>
      <View><Text className="text-3xl font-bold text-[#2e2e2e]">{isStudent?'Student Login':'Teacher Login'}</Text></View>
      <View><Text className="text-sm">Not a member yet? <Text className="text-[#01818C] underline" onPress={() => setIsSignUp(true)}>Sign up!</Text></Text></View>
      <View className="flex flex-row justify-around w-[80%]">
        
      <TouchableOpacity onPress={()=>setIsStudent(true)} className={`${isStudent?'bg-[#01818C]':'bg-white'} border-[#01818C] border-2 w-[50%] py-2 flex justify-center items-center rounded-l-lg`}><Text className={`${isStudent?'text-white':'text-[#01818C]'} text-[13px] font-medium`}>Student</Text></TouchableOpacity>
        
      <TouchableOpacity onPress={()=>setIsStudent(false)} className={`${isStudent?'bg-[#ffffff]':'bg-[#01818C]'} border-[#01818C] border-2 w-[50%] py-2 flex justify-center items-center rounded-r-lg`}><Text className={`${isStudent?'text-[#01818C]':'text-white'} text-[13px] font-medium`}>Teacher</Text></TouchableOpacity>
        
        </View>
      <View className="border-2 border-gray-300 flex justify-center items-center gap-y-4 w-[80%] pb-4 rounded-2xl">
      <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, width: '90%' }}>
        <TextInput
          onChangeText={setEmail}
          value={email}
          placeholder="Enter Email ID..."
          style={{ flex: 1, paddingLeft: 10, height: 40, color: 'gray' }}
        />
      </View>
      {isStudent&&<View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, width: '90%' }}>
        <TextInput
          onChangeText={setRollNumber}
          value={rollNumber}
          placeholder="Enter Roll Number..."
          style={{ flex: 1, paddingLeft: 10, height: 40, color: 'gray' }}
        />
      </View>}
      {!isStudent&&<View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, width: '90%' }}>
        <TextInput
          onChangeText={setDepartment}
          value={department}
          placeholder="Enter Department..."
          style={{ flex: 1, paddingLeft: 10, height: 40, color: 'gray' }}
        />
      </View>}
      <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderRadius: 10, paddingHorizontal: 10, width: '90%' }}>
        <TextInput
          onChangeText={setPassword}
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
      <TouchableOpacity className="bg-[#01818C] w-[70%] py-3 flex justify-center items-center rounded-lg"><Text className="text-white text-[16px] font-bold">Login</Text></TouchableOpacity>
      </View>
      </>
      )}
            </ScrollView>
            </KeyboardAvoidingView>
      </>
  );
};

export default LogIn;