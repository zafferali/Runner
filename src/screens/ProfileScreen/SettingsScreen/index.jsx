import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import colors from 'constants/colors';
import Layout from 'common/Layout';
import { toggleLoading } from 'slices/uiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from 'slices/userSlice';
import UploadImageModal from 'utils/UploadImageModal';
import uploadImageToFirebase from 'utils/uploadImage';
import firestore from '@react-native-firebase/firestore';
import CustomButton from 'common/CustomButton';

const SettingsScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const runnerId = useSelector(state => state.authentication.runnerId);
  const [imageUrl, setImageUrl] = useState(null);
  const isLoading = useSelector(state => state.ui.loading);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setImageUrl(user.photoUrl);
    }
  }, [user]);

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleSave = async () => {
    dispatch(toggleLoading());
    try {
      const userRef = firestore().collection('runners').doc(runnerId);
      const updatedUserInfo = { name, photoUrl: imageUrl };
      await userRef.update(updatedUserInfo);
      dispatch(updateUser({ ...user, ...updatedUserInfo }));
      navigation.goBack()
    } catch (error) {
      Alert.alert('Failed to update profile', error.message);
    } finally {
      dispatch(toggleLoading());
    }
  };

  const handleUploadImage = async (fromCamera) => {
    dispatch(toggleLoading());
    try { 
      const url = await uploadImageToFirebase(fromCamera);
      setImageUrl(url);
      setModalVisible(false);
    } catch (error) {
      console.log(error)
    } finally {
      dispatch(toggleLoading());
    }
  };

  return (
    <>
    <Layout
      backTitle='Settings'
      navigation={navigation}
    >
      <View style={styles.container}>
        <TouchableOpacity style={[styles.imageUploadContainer, imageUrl && {borderWidth: 0}]} onPress={() => setModalVisible(true)}>
          { imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.profileImage} />
          ) : null
          // (<Image style={styles.uploadIcon} source={require('images/upload.png')} />)
          }
        </TouchableOpacity>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={handleNameChange}
        />

        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.phoneNum}>
          <Text style={styles.phoneNumText}>{user?.mobile}</Text>
        </View>
        <CustomButton title='Save Changes' onPress={handleSave} style={{ width: '100%', marginTop: 20}} />
      </View>
      {!isLoading &&
      <UploadImageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onTakePicture={() => handleUploadImage(true)}
        onUploadFromGallery={() => handleUploadImage(false)}
      />}
    </Layout>
     {isLoading ? (
      <View style={styles.overlayStyle}>
        <ActivityIndicator size='large' color={colors.theme} />
      </View>) : null}
      </>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
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
