// This is For Teachers
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
import BottomTabs from './BottomTabs'



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
      <Stack.Navigator
        screenOptions={{
          contentStyle: {
            backgroundColor: "#FFF",
          },
          headerShown: false,
        }}
        initialRouteName={BottomTabs}
      >
        <Stack.Screen name="BottomTabs" component={BottomTabs} />
      </Stack.Navigator>
    </NavigationContainer>

  )
}