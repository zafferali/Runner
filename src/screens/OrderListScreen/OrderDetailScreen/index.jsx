import { StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import Layout from 'common/Layout'
import StatusToggle from 'common/StatusToggle'
import colors from 'constants/colors'
import { GlobalStyles } from 'constants/GlobalStyles'
import CustomCard from 'common/CustomCard'
import ColouredButton from 'common/ColouredButton'
import { makeCall } from 'utils/makeCall'
import DeliveryModal from './DeliveryModal'
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ScrollView } from 'react-native-gesture-handler'

const mapFirebaseStatusToUI = (firebaseStatus) => {
    switch (firebaseStatus) {
        case 'on the way':
            return 'On the way'
        case 'ready':
            return 'Ready'
        case 'picked':
            return 'Picked'
        case 'delivered':
            return 'Delivered'
        default:
            return firebaseStatus
    }
}

const mapUIStatusToFirebase = (uiStatus) => {
    switch (uiStatus) {
        case 'On the way':
            return 'on the way'
        case 'Picked':
            return 'picked'
        case 'Delivered':
            return 'delivered'
        default:
            return uiStatus
    }
}

const ItemWithQty = ({ itemName, itemQty }) => {
    return (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{itemName}</Text>
            <View style={styles.square}>
                <Text style={styles.number}>{itemQty}</Text>
            </View>
        </View>
    )
}

const handleCallPress = () => {
    Alert.alert(
        'Call Helpdesk',
        'Would you like to call Helpdesk',
        [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Call', onPress: () => makeCall('+919999987878') },
        ]
    )
}

const OrderDetailScreen = ({ navigation, route }) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingLocker, setLoadingLocker] = useState(false)
    const [currentOrder, setCurrentOrder] = useState(null)

    const handleStatusChange = (orderId, newUIStatus) => {
        const currentStatus = mapFirebaseStatusToUI(currentOrder?.orderStatus)

        if (newUIStatus === 'Delivered' && currentStatus !== 'Delivered') {
            setModalVisible(true)
        } else if (currentStatus === 'Delivered' && newUIStatus !== 'Delivered') {
            Alert.alert(
                'Status cannot be changed',
                'Please call Customer Care to change the status',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Call Customer Care', onPress: () => makeCall() },
                ]
            )
        } else {
            updateOrderStatus(orderId, newUIStatus)
        }
    }

    const updateOrderStatus = async (orderId, newUIStatus) => {
        const newFirebaseStatus = mapUIStatusToFirebase(newUIStatus)
        setLoading(true)
        try {
            await firestore()
                .collection('orders')
                .doc(orderId)
                .update({ orderStatus: newFirebaseStatus })

            setCurrentOrder(prevState =>
                ({ ...prevState, orderStatus: newFirebaseStatus })
            )
        } catch (error) {
            console.error('Error updating order status:', error)
        } finally {
            setLoading(false)
        }
    }

    const onConfirmHandler = () => {
        const { orderNum, pickupCode } = currentOrder
        // Update the order status to 'delivered' in Firebase
        const orderId = currentOrder?.id
        updateOrderStatus(orderId, 'Delivered')
    }

    const markOrderAsOpened = async (orderId) => {
        try {
            const openedOrdersString = await AsyncStorage.getItem('openedOrders')
            let openedOrders = openedOrdersString ? JSON.parse(openedOrdersString) : []
            if (!openedOrders.includes(orderId)) {
                openedOrders.push(orderId)
                await AsyncStorage.setItem('openedOrders', JSON.stringify(openedOrders))
            }
        } catch (error) {
            console.error('Error marking order as opened:', error)
        }
    }

    const getAdjustedDeliveryTime = (time) => {
        if (!time) return ''
        const [hours, minutes] = time.split(':').map(Number)
        const date = new Date()
        date.setHours(hours)
        date.setMinutes(minutes - 15)
        const adjustedHours = date.getHours().toString().padStart(2, '0')
        const adjustedMinutes = date.getMinutes().toString().padStart(2, '0')
        return `${adjustedHours}:${adjustedMinutes}`
    }

    useEffect(() => {
        const fetchOrderDetails = async (orderId) => {
            setLoading(true)
            try {
                const orderDoc = await firestore().collection('orders').doc(orderId).get()
                if (orderDoc.exists) {
                    setCurrentOrder({ id: orderDoc.id, ...orderDoc.data() })
                    fetchLockerDetails(orderDoc.data()?.locker?.id)
                    markOrderAsOpened(orderId)
                } else {
                    console.log('No such order!')
                }
            } catch (error) {
                console.error('Error fetching order details:', error)
            } finally {
                setLoading(false)
            }
        }
        const fetchLockerDetails = async (lockerId) => {
            if (!lockerId) return
            setLoadingLocker(true)
            try {
                const lockerDoc = await firestore().collection('lockers').doc(lockerId).get()
                if (lockerDoc.exists) {
                    setCurrentOrder(prevState => ({
                        ...prevState,
                        campusName: lockerDoc.data()?.campus,
                        lockerName: lockerDoc.data()?.lockerName
                    }))
                } else {
                    console.log('No such locker!')
                }
            } catch (error) {
                console.error('Error fetching locker details:', error)
            } finally {
                setLoadingLocker(false)
            }
        }

        const { orderId } = route.params
        if (orderId) {
            fetchOrderDetails(orderId)
        }
    }, [route.params])

    return (
        <Layout
            backTitle='Order'
            dynamicTitle={` #${currentOrder?.orderNum ?? ''}`}
            navigation={navigation}
        >
            <ScrollView>
            <View style={styles.statusContainer}>
                <Text style={[styles.mdText, { fontSize: 12 }]}>Update Status</Text>
                {loading ?
                    <ActivityIndicator size='small' color={colors.theme} style={{ marginRight: 100 }} /> :
                    <StatusToggle
                        option1='On the way'
                        option2='Picked'
                        option3='Deliver'
                        activeStatus={mapFirebaseStatusToUI(currentOrder?.orderStatus)}
                        onStatusChange={(newUIStatus) => handleStatusChange(currentOrder?.id, newUIStatus)}
                    />}
            </View>
            <View style={[GlobalStyles.lightBorder, { marginBottom: 12 }]}>
                {currentOrder?.items?.map((item, index) => <ItemWithQty key={index} style={styles.item} itemName={item.name} itemQty={item.quantity} />)}
            </View>
            {currentOrder?.instructions &&
                <View style={[GlobalStyles.lightBorder, { marginBottom: 12 }]}>
                    <Text>Additional Notes</Text>
                    <View style={styles.instructions}>
                        <Text>{currentOrder.instructions}</Text>
                    </View>
                </View>}
            <View style={[GlobalStyles.lightBorder, {marginBottom: 50}]}>
                <View style={styles.row}>
                    <Text style={styles.text}>Customer Name</Text>
                    <Text style={styles.custName}>{currentOrder?.customerName}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>Restaurant Name</Text>
                    <CustomCard icon={require('images/map.png')}text={currentOrder?.restaurantName} textColor={colors.theme} />
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>Deliver to</Text>
                    {loadingLocker ?
                        <ActivityIndicator size='small' color={colors.theme} /> :
                        <CustomCard icon={require('images/map.png')} text={currentOrder?.campusName} secondRowText={currentOrder?.lockerName} textColor={colors.theme} />}
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>Deliver before</Text>
                    {loadingLocker ?
                        <ActivityIndicator size='small' color={colors.theme} /> :
                        <Text style={styles.custName}>{getAdjustedDeliveryTime(currentOrder?.deliveryTime)}</Text>}
                </View>
            </View>
            </ScrollView>
            <View style={styles.btnContainer}>
                <ColouredButton title='Call Helpdesk' onPress={handleCallPress} bgColor='rgb(255, 241, 204)' textColor='rgb(186, 135, 0)' icon={require('images/phone.png')} />
            </View>
            <DeliveryModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                orderNum={currentOrder?.orderNum}
                pickupCode={currentOrder?.pickupCode}
                onConfirm={onConfirmHandler}
            />
        </Layout>
    )
}

export default OrderDetailScreen

const styles = StyleSheet.create({
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 12,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 6,
    },
    itemContainer: {
        minHeight: 48,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        color: '#3B3B3B',
        fontSize: 14,
        fontWeight: '600',
    },
    square: {
        width: 50,
        height: 40,
        borderRadius: 6,
        backgroundColor: '#F4F4F4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    number: {
        fontSize: 14,
        color: colors.theme,
        fontWeight: '600',
    },
    instructions: {
        backgroundColor: colors.lightGray,
        minHeight: 40,
        padding: 10,
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
      },
      custName: {
        fontSize: 16,
        width: 160,
        fontWeight: '600',
        color: colors.theme,
        textAlign: 'left',
        textTransform: 'capitalize',
      },
      text: {
        color: 'rgb(100,100,100)',
        fontWeight: '600',
        fontSize: 12,
      },
      mdText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.theme,
      },
      btnContainer: {
        position: 'absolute',
        bottom: 5,
        left: 20,
      }
})
