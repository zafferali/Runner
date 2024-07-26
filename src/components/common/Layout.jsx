import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Image, StatusBar } from 'react-native';
import colors from 'constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const Layout = ({ children, navigation, backTitle, title, dynamicTitle, headerRightIcon }) => {
  changeNavigationBarColor('#FAFAFA', true);
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          {backTitle ?
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image style={styles.backBtn} source={require('images/back.png')} />
              </TouchableOpacity>
              <View style={styles.backTitleContainer}>
                <Text style={styles.backTitle}>{backTitle}</Text>
                {dynamicTitle && <Text style={styles.dynamicTitle}>{dynamicTitle}</Text> }
              </View>
            </View> :
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
            </View>
          }
          {headerRightIcon && 
          <TouchableOpacity onPress={ () => navigation.goBack()} style={styles.closeIconContainer}>
            <Image style={styles.closeIcon} source={require('images/x.png')} />
          </TouchableOpacity>
          }
        </View>
        {children}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  closeIconContainer: {
    borderRadius: 100,
    backgroundColor: '#DEDEDE',
    padding: 4,
  },
  closeIcon:  {
    tintColor: 'black',
    width: 24,
    height: 24,
  },
  orderNum: {
    color: colors.theme,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
  },
  backTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  backTitleContainer: {
    flexDirection: 'row',
  },
  dynamicTitle :{
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.theme,
  },
  titleContainer: {
    flexDirection: 'column'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  content: {
    flex: 1,
  },
});

export default Layout;
