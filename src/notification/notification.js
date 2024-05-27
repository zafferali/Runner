import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging'
import auth from '@react-native-firebase/auth'

// Function to register the device token for a runner
export const registerDeviceToken = async () => {
  const token = await messaging().getToken()
  const user = auth().currentUser

  if (user) {
    const runnerRef = firestore().collection('runners').doc(user.uid)
    await runnerRef.update({
      fcmToken: token
    })
  }
}

// Function to remove the device token for a runner
export const removeDeviceToken = async () => {
  const user = auth().currentUser

  if (user) {
    const runnerRef = firestore().collection('runners').doc(user.uid)

    // Clear the token from the fcmToken field
    await runnerRef.update({
      fcmToken: firestore.FieldValue.delete()
    })
  }
}
