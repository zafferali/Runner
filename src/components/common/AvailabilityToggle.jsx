import React from 'react'
import { Switch, StyleSheet } from 'react-native'
import colors from 'constants/colors'

const AvailabilityToggle = ({ isActive, onToggle }) => {
  return (
    <Switch
      trackColor={{ false: colors.warning, true: colors.theme }}
      thumbColor={isActive ? colors.lightGray : colors.danger}
      ios_backgroundColor="#3e3e3e"
      onValueChange={() => onToggle(isActive)}
      value={isActive}
    />
  )
}

const styles = StyleSheet.create({})

export default AvailabilityToggle
