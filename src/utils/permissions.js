import {PermissionsAndroid, Alert, Linking, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export const requestCallPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      {
        title: 'Call Permission',
        message:
          'This app needs access to your phone so you can make direct calls from the app.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      Alert.alert(
        'Permission Required',
        'Call permission is required to make phone calls',
      );
      return false;
    }
  } catch (err) {
    Alert.alert('Permission Error', 'Failed to request call permission');
    return false;
  }
};

export const requestNotificationPermission = async () => {
  try {
    const currentStatus = await messaging().hasPermission();

    if (currentStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('Notification permissions are enabled');
      return true;
    } else if (currentStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
      // Request permission if not determined
      const permissionResult = await request(PERMISSIONS.ANDROID.NOTIFICATIONS);

      if (permissionResult === RESULTS.GRANTED) {
        console.log('Notification permissions granted');
        return true;
      } else {
        console.log('Notification permissions not granted');
        return false;
      }
    } else {
      console.log('Notification permissions are not enabled');
      return false;
    }
  } catch (error) {
    console.error('Failed to check notification permissions', error);
    return false;
  }
};

// Function to redirect user to app settings if permissions are not enabled
export const promptForSettings = () => {
  Alert.alert(
    'Notification Permission',
    'Notifications are disabled. Please enable them in settings to receive updates.',
    [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Open Settings',
        onPress: () => {
          if (Platform.OS === 'android') {
            Linking.openSettings();
          }
        },
      },
    ],
  );
};

const showSettingsAlert = () => {
  Alert.alert(
    'Location Permission Required',
    'This app needs access to your location. Please enable it in your device settings.',
    [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Open Settings', onPress: () => Linking.openSettings()},
    ],
  );
};

const checkLocationPermission = async permissionType => {
  try {
    const result = await PermissionsAndroid.check(permissionType);
    return result;
  } catch (error) {
    console.warn('Error checking permission:', error);
    return false;
  }
};

export const requestLocationPermission = async () => {
  try {
    const alreadyGranted = await checkLocationPermission(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (alreadyGranted) {
      console.log('Location permission already granted');
      return true;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location permission granted');
      return true;
    } else {
      console.log('Location permission denied');
      showSettingsAlert();
      return false;
    }
  } catch (err) {
    console.warn('Error requesting location permission:', err);
    return false;
  }
};

export const requestBackgroundLocationPermission = async () => {
  try {
    const alreadyGranted = await checkLocationPermission(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );
    if (alreadyGranted) {
      console.log('Background location permission already granted');
      return true;
    }

    // Check if the user has granted fine location permission first
    const fineLocationGranted = await checkLocationPermission(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (!fineLocationGranted) {
      console.log('Fine location permission not granted');
      showSettingsAlert();
      return false;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      {
        title: 'Background Location Permission',
        message: 'This app needs access to your location in the background.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Background location permission granted');
      return true;
    } else {
      console.log('Background location permission denied');
      showSettingsAlert();
      return false;
    }
  } catch (err) {
    console.warn('Error requesting background location permission:', err);
    return false;
  }
};
