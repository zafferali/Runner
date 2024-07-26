import 'react-native-gesture-handler';
import React from 'react'; // Import React
import { AppRegistry, LogBox } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

LogBox.ignoreLogs([
  'ReactImageView: Image source "null" doesn\'t exist',
  'componentWillReceiveProps has been renamed, and is not recommended for use.'
]);

// Create a root component that wraps App with Provider
const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root); // Register Root instead of App
