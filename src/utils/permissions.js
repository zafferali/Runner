import { PermissionsAndroid, Alert } from 'react-native'

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
