import React, { useState } from 'react';
import { View, Image, Text, TextInput, ImageBackground, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';


const LoginScreen = ({ navigation }) => {
  const [vendorCode, setVendorCode] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigation.navigate('OrderListScreen')
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
            placeholder="Vendor code"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={vendorCode}
            onChangeText={setVendorCode}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            secureTextEntry
            value={password}
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
    maxWidth: 334,
    maxHeight: 106,
    resizeMode: 'contain',
  },
  input: {
    marginHorizontal: 20,
    marginVertical: 5,
    backgroundColor: '#00000060',
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
});

export default LoginScreen;
