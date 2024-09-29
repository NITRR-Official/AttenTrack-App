import * as React from 'react';
import AppNavigation from './src/navigation';
import AppNavigation2 from './src/navigation/index2';
import AppNavigation3 from './src/navigation/index3';
import { PaperProvider } from 'react-native-paper';
// import {AuthProvider} from './src/utils/auth';



export default function App() {

  // const [k, setk] = React.useState(true);

  // React.useEffect(() => {
  //   setTimeout(() => {
  //     setk(false);
  //   }, 5000);
  // }, []);

  return (
    <PaperProvider>
    {/* (k) ? <AppNavigation3 /> : <AppNavigation /> */}
    <AppNavigation/>
     {/* <AppNavigation2 /> */}
      {/* <AppNavigation3 /> */}
      </PaperProvider>
  );
}
