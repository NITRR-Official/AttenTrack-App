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
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { theme } from '../../theme';
const CreateClass = () => {
    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }} >
            <View style={{ backgroundColor: '#fff', width: wp(100), height: hp(6), display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(8) }} >
                <TouchableOpacity>
                    <XMarkIcon size={wp(8)} color={theme.maincolor} />
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: theme.maincolor, width: wp(14), height: wp(8), borderRadius: wp(2), justifyContent: 'center', alignItems: 'center' }} >
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