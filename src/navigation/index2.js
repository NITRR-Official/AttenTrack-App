// This is for Students

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
  import BottomTabs2 from './BottomTabs2'
  
  
  
  function Home() {
    return (
      <View>
        <Text>index</Text>
      </View>
    )
  }
  
  export default function AppNavigation2() {
    return (
  
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            contentStyle: {
              backgroundColor: "#FFF",
            },
            headerShown: false,
          }}
          initialRouteName={BottomTabs2}
        >
          <Stack.Screen name="BottomTabs2" component={BottomTabs2} />
        </Stack.Navigator>
      </NavigationContainer>
  
    )
  }