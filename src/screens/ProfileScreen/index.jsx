import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Layout from 'common/Layout'
import colors from 'constants/colors'
import { GlobalStyles } from 'constants/GlobalStyles'
import AvailabilityToggle from 'common/AvailabilityToggle'

const ProfileScreen = ({navigation}) => {

  const handleSettingsPress = () => {
    navigation.navigate('SettingsScreen')
  };

  const handleCallCustomerCarePress = () => {

  };

  const handleLogoutPress = () => {
    // navigation.navigate('LoginScreen')
  };

  return (
    <Layout
      navigation={navigation}
    >
      <View contentContainerStyle={styles.container}>
        <Image source={require('images/logo-black.png')} style={styles.logo} />
        <Image source={{ uri: "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250" }} style={styles.userImage} />
        <Text style={styles.userName}>Raghav Handa</Text>
        <TouchableOpacity style={[GlobalStyles.lightBorder, styles.availability]} onPress={handleLogoutPress}>
          <Text style={styles.buttonText}>Availability Status</Text>
          <AvailabilityToggle />
        </TouchableOpacity>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.button, styles.topButton]} onPress={handleSettingsPress}>
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleCallCustomerCarePress}>
            <Text style={styles.buttonText}>Call customer care</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[GlobalStyles.lightBorder, { alignSelf: 'stretch', paddingLeft: 15 }]} onPress={handleLogoutPress}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    justifyContent: 'center'
  },
  logo: {
    maxWidth: 200,
    maxHeight: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  userImage: {
    width: 133,
    height: 133,
    borderRadius: 100,
    marginVertical: 20,
    alignSelf: 'center',
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center'
  },
  availability: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonGroup: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'stretch',
    marginVertical: 10,
  },
  button: {
    padding: 15,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  topButton: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.theme,
  },
})