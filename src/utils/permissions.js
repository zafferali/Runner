import { PermissionsAndroid, Alert } from 'react-native'
import messaging from '@react-native-firebase/messaging';

export const requestCallPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      {
        title: "Call Permission",
        message:
          "This app needs access to your phone so you can make direct calls from the app.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      Alert.alert('Permission Required', 'Call permission is required to make phone calls');
      return false;
    }
  } catch (err) {
    Alert.alert('Permission Error', 'Failed to request call permission');
    return false;
  }
};

export const requestNotificationPermission = async () => {
  try {
    const authorizationStatus = await messaging().hasPermission();
    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('Notification permissions are enabled');
      return true;
    } else {
      console.log('Notification permissions are not enabled');
      return false;
    }
  } catch (error) {
    console.error('Failed to check notification permissions', error);
    return false;
  }
}
