import React, { useState } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {AuthStackNavigator} from './navigation/AuthStackNavigator';
import BottomTabNavigator from './navigation/BottomTabNavigator';
// import { setCustomText } from 'react-native-global-props';
import { SafeAreaView } from 'react-native-safe-area-context';


// const customTextProps = {
//   style: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 28,
//     color: 'black',
//     fontWeight: '600',
//   }
// };
// setCustomText(customTextProps);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <>
    <SafeAreaView style={{flex: 1}}>
      {/* <StatusBar backgroundColor="transparent" translucent={true} /> */}
        <NavigationContainer>
          {isAuthenticated ? <BottomTabNavigator /> : <AuthStackNavigator />}
        </NavigationContainer>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({

});

export default App;

