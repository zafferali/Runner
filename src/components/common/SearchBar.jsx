import React, { useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import colors from 'constants/colors'

const SearchBar = ({ placeholder, onSearch }) => {
  const inputRef = useRef(null);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => inputRef.current.focus()}
        style={styles.iconContainer}
      >
        <Image
          source={require('images/search.png')} // Replace with your search icon
          style={styles.icon}
        />
      </TouchableOpacity>
      <TextInput
        ref={inputRef}
        onChangeText={onSearch}
        placeholderTextColor='#666666'
        placeholder={placeholder}
        style={styles.input}
        clearButtonMode="while-editing" // iOS only
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingLeft: 10,
    borderColor: colors.border,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
});

export default SearchBar;
