import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { GlobalStyles } from 'constants/GlobalStyles'

const CustomCard = ({ isLightText, text, textColor, secondRowText, icon }) => {
  return (
    <View style={[GlobalStyles.lightGrayCard, styles.container]}>
      <View style={styles.iconContainer}>
        <Image style={styles.mapIcon} source={require('images/map.png')}/>
      </View>
      <View>
      <Text style={[isLightText ? { color: 'rgba(0,0,0,0.5)' } : { color: textColor? textColor : 'black' }, styles.text]}>{text}</Text>
        {secondRowText && <Text style={styles.secondRowText}>{secondRowText}</Text>}
      </View>
    </View>
  )
}

export default CustomCard

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(240, 244, 246, 1)',
    padding: 6,
    flexDirection: 'row',
    gap: 8,
  },
  iconContainer: {
      backgroundColor: 'rgba(104, 141, 168, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      height: 26,
      width: 26,
      borderRadius: 4,
  },
  mapIcon: {
    width: 14,
    height: 14,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  secondRowText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgb(104, 141, 168)',
    textTransform: 'capitalize',
  }
})