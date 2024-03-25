import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import colors from 'constants/colors';

const Layout = ({ children, navigation, title, backTitle }) =>

   (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          {backTitle ?
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image style={styles.backBtn} source={require('images/back.png')} />
              </TouchableOpacity>
              <Text style={styles.backTitle}>{backTitle}</Text>
            </View> :
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
            </View>
          }
        </View>
        {children}
      </View>
    </KeyboardAvoidingView>
  )

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  backBtn: {
    width: 64,
    height: 64,
  },
  backTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },
  titleContainer: {
    flexDirection: 'column'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
  },
})

export default Layout;
