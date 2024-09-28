// This is for login

import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    BackHandler,
  } from "react-native";
  
  // navigation import
  import { createNativeStackNavigator } from '@react-navigation/native-stack';
  import { NavigationContainer } from "@react-navigation/native";
  
  const Stack = createNativeStackNavigator();
  
  // Bottom Tabs
//   import BottomTabs from './BottomTabs'
  import Login from '../screens/auth/LogIn'
  import SignUp from '../screens/auth/SignUp'
  
  
  
  function Home() {
    return (
      <View>
        <Text>index</Text>
      </View>
    )
  }
  
  export default function AppNavigation3() {
    return (
  
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            contentStyle: {
              backgroundColor: "red",
            },
            headerShown: false,
          }}
          initialRouteName={Login}
        >
          <Stack.Screen name="LogIn" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
      </NavigationContainer>
  
    )
  }