import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

let pendingNavigation = null;

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    console.error('Navigation ref is not ready, deferring navigation');
    pendingNavigation = { name, params };
  }
}

export function handlePendingNavigation() {
  if (navigationRef.isReady() && pendingNavigation) {
    console.log('Handling pending navigation', pendingNavigation);
    try {
      navigationRef.navigate(pendingNavigation.name, pendingNavigation.params);
    } catch (error) {
      console.error('Error navigating to pending route:', error);
    }
    pendingNavigation = null;
  } else if (!navigationRef.isReady()) {
    console.error('Navigation ref is still not ready');
  }
}

export function setNavigationReady() {
  handlePendingNavigation();
}
