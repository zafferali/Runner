import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import colors from 'constants/colors';

const CustomButton = ({ onPress, title, style, textStyle, icon }) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
    {icon && <Image source={require('images/edit.png')} style={styles.icon} />}
    <Text style={[styles.text, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#688DA84D',
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  text: {
    color: colors.theme,
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    width: 18,
    height: 18,
  }
});

export default CustomButton;