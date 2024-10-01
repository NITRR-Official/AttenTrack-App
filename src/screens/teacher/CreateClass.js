import React, { useRef, useState } from 'react'
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
    Alert,
    ScrollView,
} from 'react-native';

import { ArrowUpTrayIcon,XMarkIcon } from 'react-native-heroicons/outline';
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

import { useNavigation } from "@react-navigation/native";


const folderName = 'StudentsDataFolder';
const folderPath = `${RNFS.DownloadDirectoryPath}/${folderName}`;
const filePath = `${folderPath}/studentsData.json`;


const CreateClass = () => {


    const navigation = useNavigation();

    const [number, onChangeNumber] = React.useState('');
    const { readString } = usePapaParse();
    const [jsonData, setJsonData] = useState([]);

    const showAlert = (show) => {
        Alert.alert(
            "Error",
            show,
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
        );
    };

    const handleOnFileLoad = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });

            console.log(res);

            const filetype = res[0].type;

            if (filetype !== 'text/comma-separated-values') {
                showAlert("Please select a comma-separated-values file");
                throw new Error('Please select a comma-separated-values file');
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
                console.log('User canceled the picker');
            } else {
                console.error('Unknown error: ', err);
            }
        }
    };


    const parseCSV = (csvData) => {
        const json = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
        });

        // const data 

        setJsonData(json.data);
        console.log('json.data', typeof(json));
        console.log('json.datakjjkjkjk', typeof(json.data));
        console.log('json.data', json);
        console.log('json.data only data', json.data);
    };

    const saveDataToFile = async () => {

        const curTime = new Date().toISOString();

        if(number === '') {
            showAlert('Please enter class name');
            return;
        }

        const store = {
            className : number,
            time : curTime,
            data : jsonData
        }

        console.log('store', store);

        const Data = JSON.stringify(store);
    
        try {
          await RNFS.mkdir(folderPath); // Create folder if it doesn't exist
          await RNFS.writeFile(filePath, Data, 'utf8'); // Save file
          console.log('File written successfully!', Data);

          showAlert('Data saved successfully!');
          navigation.goBack();

        } catch (error) {
          console.log('Error writing file:', error);
        }
      };

      const [fileContent, setFileContent] = useState([]);
    
      // Function to read the data
      const readDataFromFile = async () => {
        try {
          const content = await RNFS.readFile(filePath, 'utf8');
        //   setFileContent(content); // Update state with file content

        const data = JSON.parse(content);

          setJsonData(data.data);
        //   console.log('File read successfully!', content);
          console.log('File read successfully! state fri', fileContent);
        } catch (error) {
          console.log('Error reading file:', error);
        }
      };
    

  

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }} >

            <View style={{ backgroundColor: '#fff', width: wp(100), height: hp(6), display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(8) }} >
                <TouchableOpacity onPress={() => navigation.goBack()} >
                    <XMarkIcon size={wp(8)} color={theme.maincolor} />
                </TouchableOpacity>
                <TouchableOpacity onPress={saveDataToFile} style={{ backgroundColor: theme.maincolor, width: wp(14), height: wp(8), borderRadius: wp(2), justifyContent: 'center', alignItems: 'center' }} >
                    <Text style={{ color: '#fff', fontSizeq: wp(6), fontWeight: '700' }} >Save</Text>
                </TouchableOpacity>
            </View>


            <TextInput
                placeholder="Class Name"
                placeholderTextColor='#909090'
                onChangeText={onChangeNumber}
                value={number}
                keyboardType="text"
                style={{ borderWidth: 1, borderColor: theme.maincolor, width: wp(90), height: hp(7), borderRadius: wp(2), paddingHorizontal: wp(4), marginTop: wp(8), color: theme.maincolor, fontSize: wp(5), fontWeight: '500' }}
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

                {jsonData.map((student, index) => (
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