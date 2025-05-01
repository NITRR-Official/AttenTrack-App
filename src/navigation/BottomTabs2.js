// @This is For Students

import * as React from 'react';
import {useState, useEffect} from 'react';
import {View, Text, Dimensions} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

// Navigator imports
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Screens
import Home from '../screens/student/Home';
import Report from '../screens/student/Report';
import Profile from '../screens/student/Profile';

// components
import HomeIcon from '../components/HomeIcon.js';
import ProfileIcon from '../components/ProfileIcon.js';
import ReportIcon from '../components/ReportIcon.js';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {useAuth} from '../utils/auth.js';
import OTPVerification from '../components/OTPVerification.js';

// size
const {width, height} = Dimensions.get('window');

export default function BottomTabs() {
  const Tab = createBottomTabNavigator();
  const insets = useSafeAreaInsets();
  const {tokenVerified, rollNumberG} = useAuth();
  const [tokenDialog, setTokenDialog] = useState(false);

  useEffect(() => {
    console.log('Token Verified:', tokenVerified);
    tokenVerified ? setTokenDialog(false) : setTokenDialog(true);
  }, [tokenVerified]);

  return (
    <SafeAreaProvider
      style={{
        width,
        height,
      }}>
      {tokenDialog && (
        <OTPVerification
          closeDialog={setTokenDialog}
          id={rollNumberG}
          type={'student'}
        />
      )}
      <Tab.Navigator
        initialRouteName="Home_Student"
        screenOptions={{
          contentStyle: {
            backgroundColor: '#FF0000',
          },
          headerShown: false,

          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            height: 65 + insets.bottom, // Adjust for gesture navigation
            paddingBottom: insets.bottom > 0 ? insets.bottom : 10,

            shadowOpacity: 1,
            shadowRadius: 16.0,
            elevation: 4,
            shadowColor: '#52006A',

            shadowOffset: {
              width: 0,
              height: 12,
            },
          },
        }}>
        <Tab.Screen
          name="Profile_Student"
          component={Profile}
          options={{
            tabBarIcon: ({focused}) => {
              return (
                // <TouchableOpacity>
                <View
                  style={{
                    width: wp(16),
                    top: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ProfileIcon color={focused ? '#01818C' : '#455A64'} />
                  <Text
                    style={{
                      fontFamily: 'Roboto',
                      fontWeight: '700',
                      fontSize: wp(3),
                      color: focused ? '#01818C' : '#455A64',
                    }}>
                    Profile
                  </Text>
                </View>
                //  </TouchableOpacity>
              );
            },
          }}
        />
        <Tab.Screen
          name="Home_Student"
          component={Home}
          options={{
            tabBarIcon: ({focused}) => {
              return (
                // <TouchableOpacity>
                <View
                  style={{
                    width: wp(16),
                    top: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <HomeIcon color={focused ? '#01818C' : '#455A64'} />
                  <Text
                    style={{
                      fontFamily: 'Roboto',
                      fontWeight: '700',
                      fontSize: wp(3),
                      color: focused ? '#01818C' : '#455A64',
                    }}>
                    Home
                  </Text>
                </View>
                //  </TouchableOpacity>
              );
            },
          }}
        />
        <Tab.Screen
          name="Report_Student"
          component={Report}
          options={{
            tabBarIcon: ({focused}) => {
              return (
                // <TouchableOpacity>
                <View
                  style={{
                    width: wp(16),
                    top: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ReportIcon color={focused ? '#01818C' : '#455A64'} />
                  <Text
                    style={{
                      fontFamily: 'Roboto',
                      fontWeight: '700',
                      fontSize: wp(3),
                      color: focused ? '#01818C' : '#455A64',
                    }}>
                    Report
                  </Text>
                </View>
                //  </TouchableOpacity>
              );
            },
          }}
        />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
}
