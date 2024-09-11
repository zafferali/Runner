import BackgroundGeolocation from 'react-native-background-geolocation';
import firestore from '@react-native-firebase/firestore';
import {
  requestLocationPermission,
  requestBackgroundLocationPermission,
} from '../utils/permissions';

class LocationTracker {
  constructor() {
    this.runnerId = null;
    this.updateRunnerLocation = this.updateRunnerLocation.bind(this);
    this.ordersUnsubscribe = null;
    this.isTracking = false;
  }

  async requestPermissions() {
    const foregroundPermission = await requestLocationPermission();
    if (!foregroundPermission) {
      return false;
    }

    const backgroundPermission = await requestBackgroundLocationPermission();
    if (!backgroundPermission) {
      return false;
    }

    return true;
  }

  async updateRunnerLocation(latitude, longitude) {
    if (!this.runnerId) {
      return;
    }
    try {
      await firestore().collection('runners').doc(this.runnerId).update({
        geo: {latitude, longitude},
      });
      console.log('location updated');
    } catch (error) {
      console.log(error.message);
    }
  }

  async configureBackgroundGeolocation(runnerId) {
    this.runnerId = runnerId;
    const permissionsGranted = await this.requestPermissions();
    if (!permissionsGranted) {
      return;
    }

    BackgroundGeolocation.onLocation(
      location => {
        if (this.isTracking) {
          const {latitude, longitude} = location.coords;
          console.log('updated location is', location.coords);
          this.updateRunnerLocation(latitude, longitude);
        }
      },
      error => {
        console.log(error.message);
      },
    );

    BackgroundGeolocation.ready(
      {
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 10, // Update every 10 meters
        stopOnTerminate: false,
        startOnBoot: true,
        foregroundService: true,
        debug: true,
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        notification: {
          title: 'Location Tracking',
          text: 'Enabled',
        },
      },
      state => {
        console.log('BackgroundGeolocation is configured and ready:', state);
        this.monitorRunnerOrders();
      },
    );
  }

  monitorRunnerOrders() {
    if (!this.runnerId) {
      return;
    }

    const runnerRef = firestore().collection('runners').doc(this.runnerId);
    const ordersQuery = firestore()
      .collection('orders')
      .where('runner', '==', runnerRef);

    this.ordersUnsubscribe = ordersQuery.onSnapshot(snapshot => {
      let hasActivePickedOrder = false;

      snapshot.forEach(doc => {
        const orderData = doc.data();
        if (orderData.orderStatus === 'picked') {
          hasActivePickedOrder = true;
          console.log('Found an order with "picked" status');
          return false; // Exit the loop early
        }
      });

      console.log('Has active picked order:', hasActivePickedOrder);
      console.log('Is currently tracking:', this.isTracking);

      if (hasActivePickedOrder && !this.isTracking) {
        console.log('Starting tracking...');
        this.startTracking();
      } else if (!hasActivePickedOrder && this.isTracking) {
        console.log('Stopping tracking...');
        this.stopTracking();
      } else {
        console.log('No change in tracking state needed');
      }
    });
  }

  startTracking() {
    this.isTracking = true;
    BackgroundGeolocation.start(() => {
      console.log('BackgroundGeolocation started successfully');
    });
  }

  stopTracking() {
    this.isTracking = false;
    BackgroundGeolocation.stop(() => {
      console.log('BackgroundGeolocation stopped');
    });
  }

  cleanup() {
    if (this.ordersUnsubscribe) {
      this.ordersUnsubscribe();
    }
    this.stopTracking();
  }
}

export default new LocationTracker();
