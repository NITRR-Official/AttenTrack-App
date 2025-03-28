// This is for login
import React from 'react';

// navigation import
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

// Bottom Tabs
//   import BottomTabs from './BottomTabs'
import Login from '../screens/auth/LogIn';
import SignUp from '../screens/auth/SignUp';

export default function AppNavigation3() {
  return (

    <NavigationContainer>
      <Stack.Navigator

        screenOptions={{
          contentStyle: {
            backgroundColor: '#FFF',
          },
          headerShown: false,
        }}
        initialRouteName={SignUp}

      >
        <Stack.Screen name="LogIn" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}
