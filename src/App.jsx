import React, { useState } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {AuthStackNavigator} from './navigation/AuthStackNavigator';
import BottomTabNavigator from './navigation/BottomTabNavigator';
// import { setCustomText } from 'react-native-global-props';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';


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
  const isAuthenticated = useSelector(state => state.authentication.isAuthenticated)

  return (
    <>
     <StatusBar backgroundColor="transparent" translucent={true}/>
        <NavigationContainer>
          {isAuthenticated ? <BottomTabNavigator /> : <AuthStackNavigator />}
        </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({

});

export default App;

