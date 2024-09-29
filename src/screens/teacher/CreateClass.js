import React from 'react'
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
import { XMarkIcon } from 'react-native-heroicons/outline';
import { useNavigation } from "@react-navigation/native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { theme } from '../../theme';
const CreateClass = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }} >
            <View className="w-full flex flex-row justify-between items-center p-4">
        <TouchableOpacity>
            <XMarkIcon size={wp(8)} color={theme.maincolor} onPress={() => navigation.goBack()}/>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: theme.maincolor}} className="flex justify-center items-center rounded-lg p-3 px-5" >
            <Text style={{ color: '#fff', fontSizeq: wp(6), fontWeight: '700' }} >Save</Text>
        </TouchableOpacity>
    </View>

            <TextInput
                placeholder="Class Name"
                style={{ borderWidth: 1, borderColor: theme.maincolor, width: wp(90), height: hp(7), borderRadius: wp(2), paddingHorizontal: wp(4), marginTop: wp(8), color: theme.maincolor }}
            />

            <ScrollView
                scrollEventThrottle={1}
                contentContainerStyle={{ flexGrow: 1 }}
                style={{ backgroundColor: '#fff', height: hp(100) }}
            >

            </ScrollView>


        </SafeAreaView>
    )
}

export default CreateClass

const styles = StyleSheet.create({})