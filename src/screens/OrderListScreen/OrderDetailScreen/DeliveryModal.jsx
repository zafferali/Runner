// import { useState, useEffect } from 'react';
// import { Modal, View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
// import colors from 'constants/colors';


// const DeliveryModal = ({ visible, onClose, orderNum, pickupCode, onConfirm}) => {

//     const NumberRow = ({ number }) => {
//         return (
//           <View style={styles.codeContainer}>
//             {number.split('').map((digit, index) => (
//               <View key={index} style={[styles.cell, (index == number.length-1) && {borderRightWidth: 0}]}>
//                 <Text style={styles.text}>{digit}</Text>
//               </View>
//             ))}
//           </View>
//         )
//       }

//     const confirmHandler = () => {
//         onConfirm()
//         onClose()
//     }

//     return (
//         <Modal
//             animationType="slide"
//             transparent={true}
//             visible={visible}
//             onRequestClose={onClose}
//         >
//             <View style={styles.modalContainer}>
//                 <View style={styles.modalContent}>
//                     <View>
//                         <Text style={styles.title}>Deliver Food</Text>
//                         <Text style={styles.subtitle}>You have reached the pickup point</Text>
//                     </View>
//                     <View style={styles.column}>
//                         <Text style={styles.label}>Enter the following Order Number:</Text>
//                         <NumberRow number={orderNum}/>
//                     </View>
//                     <View style={styles.column}>
//                         <Text style={styles.label}>Enter the following Pickup Code:</Text>
//                         <NumberRow number={pickupCode} />
//                     </View>
//                     <View style={styles.btnContainer}>
//                         <TouchableOpacity onPress={() => onClose()} style={[styles.button, styles.cancelButton]}>
//                             <Text style={styles.buttonText}>Cancel</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity onPress={confirmHandler} style={[styles.button, styles.confirmButton]}>
//                             <Text style={styles.buttonText}>Confirm Delivery</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </View>
//         </Modal>
//     );
// };

// export default DeliveryModal;

// const styles = StyleSheet.create({
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     },
//     modalContent: {
//         backgroundColor: '#fff',
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         paddingVertical: 30,
//         paddingHorizontal: 20,
//     },
//     title: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: colors.theme,
//         marginBottom: 2,
//     },
//     subtitle: {
//         fontSize: 16,
//         fontWeight: '500',
//         color: 'rgba(46, 94, 130, 0.75)',
//     },
//     label: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: colors.theme,
//         marginBottom: 2,
//     },
//     column: {
//         marginTop: 20,
//     },
//     codeContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         backgroundColor: 'rgba(104, 141, 168, 0.3)',
//         borderRadius: 8,
//       },
//       cell: {
//         flex: 1,
//         alignItems: 'center',
//         padding: 10,
//         borderRightWidth: 1,
//         borderRightColor: 'rgba(103, 148, 183, 0.3)',
//         paddingVertical: 20,
//       },
//       text: {
//         color: colors.theme,
//         fontSize: 32,
//         fontWeight: 'bold'
//       },
//       btnContainer: {
//         flexDirection: 'row',
//         borderRadius: 8,
//         overflow: 'hidden',
//         marginTop: 20,
//       },
//       button: {
//         flex: 1,
//         paddingVertical: 20,
//         alignItems: 'center',
//         justifyContent: 'center'
//       },
//       cancelButton: {
//         backgroundColor: '#7992A5'
//       },
//       confirmButton: {
//         backgroundColor: colors.theme
//       },
//       buttonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: '600'
//       }
// });

import React from 'react'
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import colors from 'constants/colors'

const DeliveryModal = ({ visible, onClose, orderNum, pickupCode, onConfirm }) => {

    const NumberRow = ({ number }) => {
        return (
          <View style={styles.codeContainer}>
            {number.split('').map((digit, index) => (
              <View key={index} style={[styles.cell, (index == number.length-1) && {borderRightWidth: 0}]}>
                <Text style={styles.text}>{digit}</Text>
              </View>
            ))}
          </View>
        )
      }

    const confirmHandler = () => {
        onConfirm()
        onClose()
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View>
                        <Text style={styles.title}>Deliver Food</Text>
                        <Text style={styles.subtitle}>You have reached the pickup point</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>Enter the following Order Number:</Text>
                        <NumberRow number={orderNum}/>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>Enter the following Pickup Code:</Text>
                        <NumberRow number={pickupCode} />
                    </View>
                    <View style={styles.btnContainer}>
                        <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={confirmHandler} style={[styles.button, styles.confirmButton]}>
                            <Text style={styles.buttonText}>Confirm Delivery</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default DeliveryModal

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.theme,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
        color: 'rgba(46, 94, 130, 0.75)',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.theme,
        marginBottom: 2,
    },
    column: {
        marginTop: 20,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(104, 141, 168, 0.3)',
        borderRadius: 8,
      },
      cell: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        borderRightWidth: 1,
        borderRightColor: 'rgba(103, 148, 183, 0.3)',
        paddingVertical: 20,
      },
      text: {
        color: colors.theme,
        fontSize: 32,
        fontWeight: 'bold'
      },
      btnContainer: {
        flexDirection: 'row',
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 20,
      },
      button: {
        flex: 1,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center'
      },
      cancelButton: {
        backgroundColor: '#7992A5'
      },
      confirmButton: {
        backgroundColor: colors.theme
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
      }
});
