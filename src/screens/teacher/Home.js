import {
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  BackHandler,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { theme } from '../../theme'
import {
  ComputerDesktopIcon,
  CpuChipIcon,
  PhoneIcon,
  PlusCircleIcon,
  TrashIcon,
} from "react-native-heroicons/outline";

import * as React from 'react';
import RNFS from 'react-native-fs';

import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../../utils/auth';
import { Button } from 'react-native-paper';

const folderName = 'StudentsDataFolder';
const folderPath = `${RNFS.DownloadDirectoryPath}/${folderName}`;
const filePath = `${folderPath}/studentsData.json`;

const Home = () => {

  const [jsonData, setJsonData] = React.useState({});
  const [selectedClass, setSelectedClass] = React.useState(null);
  const {classes, setClasses} = useAuth();

  React.useEffect(() => {
    const readDataFromFile = async () => {
      try {
        const content = await RNFS.readFile(filePath, 'utf8');
        //   setFileContent(content); // Update state with file content

        const data = JSON.parse(content);

        setJsonData(data);
        //   console.log('File read successfully!', content);
        console.log('File read successfully! state fri', jsonData);
      } catch (error) {
        console.log('Error reading file:', error);
      }
    };

    readDataFromFile();

  }, []);



  const navigation = useNavigation();

  const [modalVisible1, setModalVisible1] = React.useState(false);

  return (
    <SafeAreaView>
      <StatusBar
        backgroundColor={theme.maincolor}
        barStyle={"light-content"}
        hidden={false}
      />

      <View style={{ backgroundColor: theme.maincolor, width: wp(100), height: hp(8), justifyContent: 'space-between', alignItems: 'center', display: 'flex', flexDirection: 'row', paddingHorizontal: wp(8) }} >
        <Text style={{ color: 'white', fontSize: wp(5), fontWeight: 500 }} >Classes</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('CreateClass')}>
          <PlusCircleIcon size={wp(8)} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView
        scrollEventThrottle={1}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: '#fff', height: hp(100) }}
      >

        {
          classes.map((item, id)=>{return(
            <TouchableOpacity key={id}
          className="flex flex-row items-center p-4 bg-[#01808c2e] m-4 mb-0 rounded-2xl border-[#01808c7a] border-2"
          onPress={() => navigation.navigate('Sheet', jsonData)}
        >
          <CpuChipIcon size={wp(8)} color="#01808cb9" />
          <Text
            className="ml-2 text-[15px] font-medium text-gray-600 flex-shrink"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item}
            
          </Text>

          <TouchableOpacity onPress={() => {
            setModalVisible1(true); setSelectedClass(item);
          }} style={{ marginLeft: 'auto' }}>
              <TrashIcon size={wp(6)} color="red" />
            </TouchableOpacity>

        </TouchableOpacity>
          )})
        }

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

                <View className="bg-white p-4 m-4 rounded-3xl">
                  <Text className="ml-2 text-[15px] font-medium text-gray-600 flex-shrink">Do You Really Want to This Class : {selectedClass}</Text>
                  <View className="flex flex-row justify-between mt-5">
                  <TouchableOpacity className="bg-red-400 p-3 w-[100px] rounded-2xl" onPress={()=>{setClasses((prevClasses) => prevClasses.filter((item2) => item2 !== selectedClass)); setModalVisible1(false)}}><Text className="text-white font-bold text-center">Yes</Text></TouchableOpacity>
                  <TouchableOpacity className="bg-[#01808cc5] p-3 w-[100px] rounded-2xl" onPress={()=>setModalVisible1(false)}><Text className="text-white font-bold text-center">Cancel</Text></TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>


      </ScrollView>


    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({})