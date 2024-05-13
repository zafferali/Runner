import React, { useState } from 'react';
import { View, Image, Text, TextInput, Alert, ImageBackground, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { login } from '../../redux/slices/authenticationSlice';
import colors from 'constants/colors'; 
import { useSelector, useDispatch } from 'react-redux'
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { toggleLoading } from 'slices/uiSlice';
import firestore from '@react-native-firebase/firestore';
import { updateUser } from 'slices/userSlice';




const LoginScreen = ({ navigation }) => {
  changeNavigationBarColor(colors.theme, true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch()
  const isLoading = useSelector(state => state.ui.loading)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter all fields');
      return;
    }
    dispatch(toggleLoading())
    try {
      console.log('ep', email, password)
      let response = await auth().signInWithEmailAndPassword(email, password);
      if (response && response.user) {
        console.log('log', response.user.uid)
        const runnerDoc = await firestore().collection('runners').doc(response.user.uid).get()
        if (runnerDoc.exists) { 
        const runnerData = runnerDoc.data()
        dispatch(login(response.user.uid))
        dispatch(updateUser({
          name: runnerData.name,
          email: runnerData.email,
          mobile: runnerData.mobile,
          photoUrl: runnerData.photoUrl,
          isActive: runnerData.isActive,
        }))
      }}
    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        Alert.alert('Error', 'No user found for this email');
      } else if (e.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Wrong password provided');
      } else {
        Alert.alert('Error', e.message);
      }
    } finally {
      dispatch(toggleLoading())
    }
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ImageBackground
        source={require('images/main.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.topSection}>
          <Image
            source={require('images/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.subtitle}>Partner companion</Text>
        </View>
        <View style={styles.form}>
        <TextInput
            placeholder="Email"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            secureTextEntry
            value={password}
            onSubmitEditing={handleLogin}
            returnKeyType="go"
            onChangeText={setPassword}
            style={styles.input}
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <View style={styles.terms}>
            <Text style={styles.text}>
              By signing up, you agree to the
            </Text>
            <View style={styles.linkContainer}>
              <Text style={styles.linkText} onPress={() => { /* TODO: Navigate to Terms */ }}>
                Terms & Policy
              </Text>
              <Text style={styles.text}> & </Text>
              <Text style={styles.linkText} onPress={() => { /* TODO: Navigate to Privacy Policy */ }}>
                Privacy Policy
              </Text>
            </View>
          </View>
        </View>
        {isLoading ? (
          <View style={styles.overlayStyle}>
            <ActivityIndicator size='large' color={colors.theme} />
          </View>) : null}
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover'
  },
  topSection: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 150,
  },
  subtitle: {
    fontSize: 20,
    color: '#C2C2C2',
    alignSelf: 'center',
    marginBottom: 40,
  },
  form: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  logo: {
    maxWidth: 300,
    maxHeight: 90,
    resizeMode: 'contain',
  },
  input: {
    marginHorizontal: 20,
    marginVertical: 5,
    backgroundColor: '#00000060',
    color: 'white',
    borderRadius: 8,
    height: 54,
    padding: 10,
    marginVertical: 5,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: 'black',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  terms: {
    alignSelf: 'center',
    marginTop: 40,
  },
  text: {
    color: 'white',
    opacity: 0.5,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  linkText: {
    color: 'white',
    textDecorationLine: 'underline',
    fontWeight: '600',
    fontSize: 14,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  overlayStyle: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});

export default LoginScreen;
