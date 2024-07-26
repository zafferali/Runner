import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import colors from 'constants/colors'

const StatusToggle = ({ option1, option2, option3, activeStatus, onStatusChange }) => {
  const getButtonStyle = (status) => activeStatus === status ? styles.active : null

  const handleStatusChange = (status) => {
    onStatusChange(status)
  }

  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[styles.toggleButton, getButtonStyle('On the way')]}
        onPress={() => handleStatusChange('On the way')}
      >
        <Text style={[styles.toggleText, getButtonStyle('On the way')]}>{option1}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toggleButton, getButtonStyle('Picked')]}
        onPress={() => handleStatusChange('Picked')}
      >
        <Text style={[styles.toggleText, getButtonStyle('Picked')]}>{option2}</Text>
      </TouchableOpacity>
      {option3 &&
      <TouchableOpacity
        style={[styles.toggleButton, getButtonStyle('Delivered')]}
        onPress={() => handleStatusChange('Delivered')}
      >
        <Text style={[styles.toggleText, getButtonStyle('Delivered')]}>{option3}</Text>
      </TouchableOpacity>}
    </View>
  )
}

export default StatusToggle

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.lightGray,
    borderRadius: 20,
    padding: 6,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 18, 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', 
  },
  active: {
    backgroundColor: colors.theme, 
    color: 'white',
  },
  toggleText: {
    color: colors.theme,
    fontSize: 12,
    fontWeight: '600',
  },
});
