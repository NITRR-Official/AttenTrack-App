import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from "react-native";


import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
const Stack = createNativeStackNavigator();


import React from 'react'



function Home() {
  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default function AppNavigation() {
  return (

    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>

  )
}