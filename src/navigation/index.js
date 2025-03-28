// navigation import
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

// Bottom Tabs
import BottomTabs from './BottomTabs'
import CreateClass from "../screens/teacher/CreateClass";
import Sheet from "../screens/teacher/Sheet";
import Report from "../screens/teacher/Report";
import MarkAttendance from "../screens/student/MarkAttendance";

export default function AppNavigation() {
  return (

    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          contentStyle: {
            backgroundColor: "#fff",
          },
          headerShown: false,
        }}
        initialRouteName={BottomTabs}
      >
      {/* <Stack.Screen name="LogIn" component={Login} /> */}
        <Stack.Screen name="BottomTabs" component={BottomTabs} />
        <Stack.Screen name="CreateClass" component={CreateClass} />
        <Stack.Screen name="Sheet" component={Sheet} />
        <Stack.Screen name="Report" component={Report} />
        <Stack.Screen name="MarkAttendance" component={MarkAttendance} />
      </Stack.Navigator>
    </NavigationContainer>

  )
}