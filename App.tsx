import React from 'react';
import {PaperProvider} from 'react-native-paper';
import {useAuth, AuthProvider} from './src/utils/auth';
import AppNavigation from './src/navigation';
import AppNavigation2 from './src/navigation/index2';
import AppNavigation3 from './src/navigation/index3';

const AppContent = () => {
  const {index} = useAuth();

  return (
    <>
      {index === 0 && <AppNavigation3 />}
      {index === 1 && <AppNavigation />}
      {index === 2 && <AppNavigation2 />}
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <AppContent />
      </PaperProvider>
    </AuthProvider>
  );
}
