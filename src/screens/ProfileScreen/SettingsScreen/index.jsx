import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import colors from '../../../constants/colors';

const ProfileEditScreen = () => {
  const [name, setName] = useState('Kanchana Naidu'); // Initial name
  const [profileImage, setProfileImage] = useState(null); // Initial image state

  // Function to handle name change
  const handleNameChange = (text) => {
    setName(text);
  };

  // Function to handle profile image upload
  const handleProfileImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setProfileImage(imageUri);
      }
    });
  };

  // Function to save the updated name and image
  const handleSave = () => {
    // Implement save functionality
    console.log('Name:', name);
    if (profileImage) {
      console.log('Profile image has been set');
      // Implement functionality to upload the image to the server
    }
    // Display a success message or navigate the user away from the profile edit screen
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageUploadContainer} onPress={handleProfileImagePick}>
        {profileImage ? (
          <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />
        ) : (
          <Image style={styles.uploadIcon} source={require('images/upload.png')} />
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={handleNameChange}
      />

      <Text style={styles.label}>Phone Number</Text>
      <View style={styles.phoneNum}>
        <Text style={styles.phoneNumText}>9894565342</Text>
      </View>

      {/* <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
    backgroundColor: 'white',
  },
  imageUploadContainer: {
    width: 134,
    height: 134,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.theme,
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  uploadIcon: {
    width: 42,
    height: 42,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    color: colors.text,
    fontWeight: '600',
    fontSize: 15,
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderRadius: 5,
    borderColor: colors.theme,
    padding: 8,
    paddingLeft: 14,
    marginBottom: 20,
    color: colors.theme,
    fontSize: 14,
    fontWeight: '600',
  },
  phoneNum: {
    width: '100%',
    padding: 16,
    paddingLeft: 14,
    backgroundColor: colors.lightGray,
    borderRadius: 5,
    marginBottom: 10,
  },
  phoneNumText: {
    color: colors.theme,
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});

export default ProfileEditScreen;
