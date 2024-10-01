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
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { theme } from '../../theme'
import {
  PlusCircleIcon,
} from "react-native-heroicons/outline";

import * as React from 'react';
import RNFS from 'react-native-fs';

import { useNavigation } from "@react-navigation/native";


const folderName = 'StudentsDataFolder';
const folderPath = `${RNFS.DownloadDirectoryPath}/${folderName}`;
const filePath = `${folderPath}/studentsData.json`;

const Home = () => {



  React.useEffect(() => { 
    const readDataFromFile = async () => {
      try {
        const content = await RNFS.readFile(filePath, 'utf8');
      //   setFileContent(content); // Update state with file content

      const data = JSON.parse(content);

        // setJsonData(data.data);
      //   console.log('File read successfully!', content);
        console.log('File read successfully! state fri', data);
      } catch (error) {
        console.log('Error reading file:', error);
      }
    };

    readDataFromFile();

  }, []);



  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <StatusBar
        backgroundColor={theme.maincolor}
        barStyle={"light-content"}
        hidden={false}
      />

      <View style={{ backgroundColor: theme.maincolor, width: wp(100), height: hp(10), justifyContent: 'space-between', alignItems: 'center', display: 'flex', flexDirection: 'row', paddingHorizontal: wp(8) }} >
        <Text style={{ color: 'white', fontSize: wp(6) }} >Classes</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('CreateClass')}>
          <PlusCircleIcon size={wp(10)} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        scrollEventThrottle={1}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: '#fff', height: hp(100) }}
      >

      </ScrollView>


    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({})