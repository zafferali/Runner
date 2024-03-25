import { StyleSheet } from 'react-native';
import colors from './colors';

export const GlobalStyles = StyleSheet.create({
    lightBorder: {
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderColor: colors.border,
        borderWidth: 1,
    },
    lightGrayCard: {
        backgroundColor: colors.lightGray,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 12,
        width: 160,
    }
});
