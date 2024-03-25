import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import OrderListScreen from 'screens/OrderListScreen';
import ProfileScreen from 'screens/ProfileScreen';
import SettingsScreen from 'screens/ProfileScreen/SettingsScreen';

const OrderListStack = createStackNavigator();
const ProfileStack = createStackNavigator();


export const OrderListStackScreen = () => (

    <OrderListStack.Navigator
        screenOptions={{
            headerTitleStyle: styles.headerTitle,
            headerBackTitleVisible: false, // Hides the back title next to the back button (iOS)
            gestureEnabled: true, // Enable gesture navigation
            ...TransitionPresets.SlideFromRightIOS,
            headerShown: false,
        }}
    >
        <OrderListStack.Screen
            name="OrderListScreen"
            component={OrderListScreen}
            options={{ title: 'Orders' }}
        />
    </OrderListStack.Navigator>
);


export const ProfileStackScreen = () => (
    <ProfileStack.Navigator
        screenOptions={{
            headerTitleStyle: styles.headerTitle,
            gestureEnabled: true, // Enable gesture navigation
            ...TransitionPresets.SlideFromRightIOS,
        }}
    >
        <ProfileStack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{ headerShown: false }}
        />
        <ProfileStack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{ title: 'Settings', headerTitleStyle: styles.headerSmallTitle }}
        />
    </ProfileStack.Navigator>
);


const styles = StyleSheet.create({
    headerTitle: {
        fontSize: 38,
        fontWeight: 'bold',
    },
    headerSmallTitle: {
        fontSize: 32,
        fontWeight: 'bold',
    }
})
