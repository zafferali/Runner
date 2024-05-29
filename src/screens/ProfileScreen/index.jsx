import { StyleSheet, Text, View, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useEffect, useState} from 'react'
import Layout from 'common/Layout'
import colors from 'constants/colors'
import { GlobalStyles } from 'constants/GlobalStyles'
import AvailabilityToggle from 'common/AvailabilityToggle'
import { logout } from 'slices/authenticationSlice'
import { useDispatch, useSelector } from 'react-redux'
import auth from '@react-native-firebase/auth';
import { makeCall } from 'utils/makeCall'
import firestore from '@react-native-firebase/firestore';
import { toggleLoading } from 'slices/uiSlice'
import { updateUser } from 'slices/userSlice'
import { removeDeviceToken } from '../../notification/notification'

const ProfileScreen = ({navigation}) => {
  const isAvailable = useSelector(state => state.availability.available);
  const isLoading = useSelector(state => state.ui.loading)
  const dispatch = useDispatch()
  const runnerId = useSelector(state => state.authentication.runnerId)
  const [runner, setRunner] = useState(null)
  const user = useSelector(state => state.user)

  useEffect(() => {
    const fetchRunner = async () => {
      dispatch(toggleLoading())
      try {
        const runnerDoc = await firestore().collection('runners').doc(runnerId).get()
        if (runnerDoc.exists) {
          setRunner(runnerDoc.data())
        } else {
          console.log('Runner not found')
        }
      } catch (error) {
        console.log('Error fetching runner:', error)
      } finally {
        dispatch(toggleLoading())
      }
    }
    if (runnerId) {
      fetchRunner()
    }
  }, [])

  // const handleToggleAvailability = async (isActive) => {
  //   if (isActive) {
  //     Alert.alert(
  //       'Go Offline',
  //       'Are you sure you want to go offline?',
  //       [
  //         {
  //           text: 'Cancel',
  //           onPress: () => console.log('Cancel Pressed'),
  //           style: 'cancel',
  //         },
  //         {
  //           text: 'Yes',
  //           onPress: async () => {
  //             dispatch(toggleLoading())
  //             try {
  //               await firestore().collection('runners').doc(runnerId).update({
  //                 isActive: false
  //               })
  //               setRunner((prevRunner) => ({
  //                 ...prevRunner,
  //                 isActive: false
  //               }))
  //             } catch (error) {
  //               console.log('Error updating availability:', error)
  //             } finally {
  //               dispatch(toggleLoading())
  //             }
  //           },
  //         },
  //       ]
  //     )
  //   } else {
  //     try {
  //       await firestore().collection('runners').doc(runnerId).update({
  //         isActive: true
  //       })
  //       setRunner((prevRunner) => ({
  //         ...prevRunner,
  //         isActive: true
  //       }))
  //     } catch (error) {
  //       console.log('Error updating availability:', error)
  //     }
  //   }
  // }

  const handleToggleAvailability = async (isActive) => {
    dispatch(toggleLoading())
    try {
      await firestore().collection('runners').doc(runnerId).update({
        isActive: !isActive
      })
      setRunner((prevRunner) => ({
        ...prevRunner,
        isActive: !isActive
      }))
      dispatch(updateUser({ ...user, isActive: !isActive }))
    } catch (error) {
      console.log('Error updating availability:', error)
    } finally {
      dispatch(toggleLoading())
    }
  } 

  const handleSettingsPress = () => {
    navigation.navigate('SettingsScreen')
  };

  const handleCallCustomerCarePress = () => {
    makeCall()
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            await removeDeviceToken(runnerId);
            await auth().signOut();
            console.log('logged out');
            dispatch(logout());
          } catch (e) {
            console.log('hi', runnerId)
            Alert.alert('Failed to logout', e.message);
          }
        },
      },
    ]);
  };
 

  return (
    <Layout
      navigation={navigation}
    >
      <View contentContainerStyle={styles.container}>
        <Image source={require('images/logo-black.png')} style={styles.logo} />
        <Image source={user.photoUrl? { uri: user.photoUrl }: require('images/user-thumbnail.png')} style={styles.userImage} />
        <Text style={styles.userName}>{user?.name}</Text>
        {isLoading? <ActivityIndicator size='small' color={colors.theme} /> 
        :<TouchableOpacity style={[GlobalStyles.lightBorder, styles.availability]} onPress={() => console.log('pressed')}>
          <Text style={[styles.buttonText, , !(runner?.isActive) && {color: colors.danger}]}>Availability Status</Text>
          <AvailabilityToggle isActive={user?.isActive} onToggle={handleToggleAvailability}/>
        </TouchableOpacity>}
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.button, styles.topButton]} onPress={handleSettingsPress}>
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleCallCustomerCarePress}>
            <Text style={styles.buttonText}>Call customer care</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[GlobalStyles.lightBorder, { alignSelf: 'stretch', paddingLeft: 15 }]} onPress={handleLogout}>
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