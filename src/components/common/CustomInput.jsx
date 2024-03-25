import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const CustomInput = ({ placeholder, value, onChangeText, style }) => (
  <TextInput
    placeholder={placeholder}
    value={value}
    onChangeText={onChangeText}
    style={[styles.input, style]}
  />
);

const styles = StyleSheet.create({
  input: {
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginVertical: 5,
    fontSize: 16,
  },
});

export default CustomInput;