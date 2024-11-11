import React, { useEffect, useRef, useState } from 'react'
import {
    View,
    Text,
    SafeAreaView,
    Image,
    StatusBar,
    StyleSheet,
    TextInput,
    Button,
    TouchableOpacity,
    BackHandler,
    ScrollView,
    ToastAndroid,
} from 'react-native';

import { ArrowUpTrayIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { useNavigation } from "@react-navigation/native";

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { theme } from '../../theme';


import { usePapaParse } from 'react-papaparse';
import Papa from 'papaparse';
import DocumentPicker from 'react-native-document-picker';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { useAuth } from '../../utils/auth';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';



const folderName = 'StudentsDataFolder';
const folderPath = `${RNFS.DownloadDirectoryPath}/${folderName}`;
const filePath = `${folderPath}/studentsData.json`;


const CreateClass = () => {

    const navigation = useNavigation();

    const [classname, setClassname] = React.useState('');
    const [batch, setBatch] = React.useState('');
    const [semester, setSemester] = React.useState('');
    const [jsonLocalData, setJsonLocalData] = useState([]);
    const [students, setStudents] = useState([]);
    const { setJsonGlobalData, setClasses, departmentG, teacherid, loading, setLoading } = useAuth();


    const handleOnFileLoad = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });

            // console.log(1,res);

            const filetype = res[0].type;

            if (filetype !== 'text/comma-separated-values') {
                ToastAndroid.show('Please select a comma-separated-values file',ToastAndroid.LONG);
                throw new Error(2,'Please select a comma-separated-values file');
            }

            const fileUri = res[0].uri;

            if (Platform.OS === 'ios') {
                // For iOS, the file needs to be copied from the temporary directory.
                const destPath = `${RNFS.TemporaryDirectoryPath}/${res[0].name}`;
                await RNFS.copyFile(res[0].uri, destPath);
                const fileContent = await RNFS.readFile(destPath, 'utf8');
                parseCSV(fileContent);
            } else {
                // Android, just read the file
                const fileContent = await RNFS.readFile(fileUri, 'utf8');
                parseCSV(fileContent);
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log(7,'User canceled the picker');
            } else {
                console.error(8,'Unknown error: ', err);
            }
        }
    };


    const parseCSV = (csvData) => {
        const json = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
        });
        
        const json2 = json.data.map((item) => ({
            ...item,
            ATTENDANCE: false,
        }));

        const transformedData = json.data.map((item) => ({
            rollNumber: item.ROLLNO,
            name: item.STUDNAME,            
        }));
        setStudents(transformedData);
        setJsonLocalData(json2);
    };

    const createClass = async () => {
        try {
            setLoading(true);
          if(!classname || !batch || !semester || !students) {
            ToastAndroid.show('Fields Should Not Be Empty',ToastAndroid.LONG);
            return;
          }
            const response = await axios.post('https://attendancetrackerbackend.onrender.com/api/class/createClass', {
                classname: classname,
                batch: batch,
                semester: semester,
                department: departmentG,
                teacherid:teacherid,
                students:students
            });
            ToastAndroid.show(`Class Added Successfully !`, ToastAndroid.LONG);
            console.log('Class Added Successful:', response.data);
            setClasses(prevClasses => [...prevClasses, {classname}]);
            navigation.goBack();
            setLoading(false);
        } catch (error) {
        //   ToastAndroid.show(`Login failed: ${error}`, ToastAndroid.LONG);
        console.error(error);
        setLoading(false);
        }
    };
    

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }} >

            <View style={{ backgroundColor: '#fff', width: wp(100), height: hp(6), display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(8) }} >
                <TouchableOpacity onPress={() => navigation.goBack()} >
                    <XMarkIcon size={wp(8)} color={theme.maincolor} />
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={() => {
                        setJsonGlobalData(jsonLocalData);
                        createClass();
                }}
                 style={{ backgroundColor: theme.maincolor, width: wp(18), height: wp(10), borderRadius: wp(2), justifyContent: 'center', alignItems: 'center', marginTop:8 }} >
                    <Text style={{ color: '#fff', fontSizeq: wp(6), fontWeight: '700' }} >
                    {loading?<ActivityIndicator animating={true} color={'white'} />:'Save'}
                    </Text>
                </TouchableOpacity>
            </View>


            <TextInput
                placeholder="Class Name"
                placeholderTextColor='#909090'
                onChangeText={setClassname}
                value={classname}
                keyboardType="text"
                style={{ borderWidth: 1, borderColor: theme.maincolor, width: wp(90), height: hp(5.5), borderRadius: wp(2), paddingHorizontal: wp(4), marginTop: wp(4), color: theme.maincolor, fontSize: wp(4), fontWeight: '500' }}
            />
            <TextInput
                placeholder="Semester"
                placeholderTextColor='#909090'
                onChangeText={setSemester}
                value={semester}
                keyboardType='numeric'
                style={{ borderWidth: 1, borderColor: theme.maincolor, width: wp(90), height: hp(5.5), borderRadius: wp(2), paddingHorizontal: wp(4), marginTop: wp(4), color: theme.maincolor, fontSize: wp(4), fontWeight: '500' }}
            />
            <TextInput
                placeholder="Batch"
                placeholderTextColor='#909090'
                onChangeText={setBatch}
                value={batch}
                keyboardType='numeric'
                style={{ borderWidth: 1, borderColor: theme.maincolor, width: wp(90), height: hp(5.5), borderRadius: wp(2), paddingHorizontal: wp(4), marginTop: wp(4), color: theme.maincolor, fontSize: wp(4), fontWeight: '500' }}
            />

            <TouchableOpacity
                onPress={handleOnFileLoad}
                style={{ height: hp(7), width: wp(44), backgroundColor: theme.maincolor, borderRadius: wp(2), justifyContent: 'space-between', alignItems: 'center', marginTop: wp(8), display: 'flex', flexDirection: 'row', paddingHorizontal: wp(4) }} >
                <Text style={{ color: "#fff", fontSize: wp(4), fontWeight: '200', width: wp(22), textAlign: 'center' }} >Upload Excel Sheet</Text>
                <ArrowUpTrayIcon size={wp(8)} color="#fff" />
            </TouchableOpacity>

            {/* <View style={{ marginTop: wp(8), backgroundColor: 'red', borderRadius: wp(2), paddingHorizontal: wp(4) }}>
                <Text >{JSON.stringify(jsonData, null, 2)}</Text>
            </View> */}
            <View style={{ marginTop: wp(2), backgroundColor: theme.maincolor, paddingHorizontal: wp(4), width: wp(95), height: hp(6), display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontWeight: '700', fontSize: wp(4), color: '#fff' }} >Roll No</Text>
                <Text style={{ fontWeight: '700', fontSize: wp(4), color: '#fff' }} >Name</Text>
            </View>
            <ScrollView
                scrollEventThrottle={1}
                contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
                style={{ backgroundColor: '#e3e3e3', height: hp(100), width: wp(98) }}
            >

                {jsonLocalData.map((student, index) => (
                    // console.log('student', student)
                    <View key={index} style={{ borderWidth: 1, borderColor: theme.maincolor, marginTop: wp(2), backgroundColor: '#fff', borderRadius: wp(2), paddingHorizontal: wp(4), width: wp(95), height: hp(6), display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: wp(4), color: '#fff', color: theme.maincolor }}>{student.ROLLNO}</Text>
                        <Text style={{ fontSize: wp(4), color: '#fff', color: theme.maincolor }}>{student.STUDNAME}</Text>
                    </View>
                ))}

            </ScrollView>

        </SafeAreaView>
    )
}

export default CreateClass

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        color: theme.maincolor
    },
});