import React from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleAvailability, selectIsAvailable } from '../../redux/slices/availability';
import colors from 'constants/colors';

const AvailabilityToggle = () => {
  const dispatch = useDispatch();
  const isAvailable = useSelector(selectIsAvailable);

  return (
      <Switch
        trackColor={{ false: '#767577', true: colors.theme }}
        thumbColor={isAvailable ? colors.lightGray : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => dispatch(toggleAvailability())}
        value={isAvailable}
      />
  );
};

const styles = StyleSheet.create({
  
});

export default AvailabilityToggle;
