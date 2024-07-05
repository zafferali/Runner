import React, { useEffect } from 'react';
import { View, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthStackNavigator } from './navigation/AuthStackNavigator';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import { requestNotificationPermission, promptForSettings } from './utils/permissions';
import { registerDeviceToken } from './notification/notification';
import { useDispatch, useSelector } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import { navigate } from './navigation/navigationService';
import { navigationRef, setNavigationReady } from './navigation/navigationService';
import auth from '@react-native-firebase/auth';
import { setAuthenticated } from 'slices/authenticationSlice';
import { updateUser } from 'slices/userSlice';
import firestore from '@react-native-firebase/firestore';
import colors from 'constants/colors';

function NotificationHandler() {
  const { isAuthenticated } = useSelector(state => state.authentication);

  useEffect(() => {
    const initNotificationService = async () => {
      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted && isAuthenticated) {
        await registerDeviceToken();
      } else {
        promptForSettings();
        await registerDeviceToken();
      }
    };

    if (isAuthenticated) {
      initNotificationService();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    console.log('Setting up notification handlers...');

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Notification received in the foreground:', remoteMessage);
      const { screen, orderId } = remoteMessage.data;
      Alert.alert(
        'New Order Assigned',
        'You have been assigned a new order',
        [{
          text: 'View', onPress: () => {
            console.log('Navigating to:', screen, orderId);
            if (screen && orderId) {
              navigate('OrderListStackScreen', {
                screen: 'OrderListScreen',
                params: { orderId }
              });
            }
          }
        }]
      );
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background:', remoteMessage);
      const { screen, orderId } = remoteMessage.data;
      if (screen && orderId) {
        console.log('Navigating to:', screen, orderId);
        navigate('OrderListStackScreen', {
          screen: 'OrderListScreen',
          params: { orderId }
        });
      }
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage);
      const { screen, orderId } = remoteMessage.data;
      if (screen && orderId) {
        console.log('Navigating to:', screen, orderId);
        navigate('OrderListStackScreen', {
          screen: 'OrderListScreen',
          params: { orderId }
        });
      }
    });

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage);
        const { screen, orderId } = remoteMessage.data;
        if (screen && orderId) {
          console.log('Navigating to:', screen, orderId);
          navigate('OrderListStackScreen', {
            screen: 'OrderListScreen',
            params: { orderId }
          });
        }
      }
    });

    return () => {
      console.log('Cleaning up notification handlers...');
      unsubscribe(); // Clean up the foreground notification listener when the component unmounts
    };
  }, []);

  return null; // This component does not render anything
}

function App() {
  const { isAuthenticated, loading } = useSelector(state => state.authentication)
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        const runnerDoc = await firestore().collection('runners').doc(user.uid).get();
        if (runnerDoc.exists) {
          const runnerData = runnerDoc.data();
          dispatch(setAuthenticated({ runnerId: user.uid, isAuthenticated: true }));
          dispatch(updateUser({
            name: runnerData.name,
            email: runnerData.email,
            mobile: runnerData.mobile,
            photoUrl: runnerData.photoUrl,
            isActive: runnerData.isActive,
          }))
        } else {
          dispatch(setAuthenticated({ runnerId: null, isAuthenticated: false }));
        }
      } else {
        dispatch(setAuthenticated({ runnerId: null, isAuthenticated: false }));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.theme} />
      </View>
    );
  }

  return (
    <>
      {/* <StatusBar backgroundColor="white"/> */}
      {isAuthenticated ? <BottomTabNavigator /> : <AuthStackNavigator />}
    </>
  );
}

function Root() {
  return (
    <NavigationContainer
      ref={navigationRef}
      // onReady={() => {
      //   console.log('Navigation is ready');
      //   setNavigationReady();
      // }}
    >
      <App />
      <NotificationHandler />
    </NavigationContainer>
  );
}

export default Root;
