import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert, Modal, TextInput, Image } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import Layout from 'common/Layout'
import { GlobalStyles } from 'constants/GlobalStyles'
import colors from 'constants/colors'
import StatusToggle from '../../components/common/StatusToggle'
import { useDispatch, useSelector } from 'react-redux'
import { toggleLoading } from 'slices/uiSlice'
import { makeCall } from 'utils/makeCall'
import DeliveryModal from './DeliveryModal'

const mapFirebaseStatusToUI = (firebaseStatus) => {
  switch (firebaseStatus) {
    case 'on the way':
      return 'On the way'
    case 'ready':
      return 'On the way'
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

const subtractMinutes = (time, minutes) => {
  const [hours, mins] = time.split(':').map(Number)
  const totalMinutes = hours * 60 + mins - minutes
  const newHours = Math.floor(totalMinutes / 60)
  const newMinutes = totalMinutes % 60
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
}

const OrderListScreen = ({ navigation }) => {
  const [ordersData, setOrdersData] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loadingOrderId, setLoadingOrderId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const runnerId = useSelector(state => state.authentication.runnerId)
  const dispatch = useDispatch()
  const isLoading = useSelector(state => state.ui.loading)
  const flatListRef = useRef(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [currentOrder, setCurrentOrder] = useState({ orderNum: '', pickupCode: '' })

  useEffect(() => {
    if (!runnerId) {
      return
    }
    const runnerRef = firestore().doc(`runners/${runnerId}`)

    const unsubscribe = firestore()
      .collection('orders')
      .where('runner', '==', runnerRef)
      .where('orderStatus', 'in', ['received', 'on the way', 'ready', 'picked', 'delivered'])
      .onSnapshot(async (querySnapshot) => {
        const ordersList = []
        for (const doc of querySnapshot.docs) {
          const data = doc.data()
          const restaurantDoc = data.restaurant ? await data.restaurant.get() : null
          const customerDoc = data.customer ? await data.customer.get() : null
          const lockerDoc = data.locker ? await data.locker.get() : null

          ordersList.push({
            id: doc.id,
            orderNum: data?.orderNum,
            pickupCode: data?.pickupCode,
            orderStatus: data?.orderStatus,
            deliveryTime: data?.deliveryTime,
            restaurantName: restaurantDoc?.data()?.name,
            customerName: customerDoc?.data()?.name,
            campusName: lockerDoc?.data()?.campus,
            lockerName: lockerDoc?.data()?.lockerName,
          })
        }
        ordersList.sort((a, b) => a.deliveryTime.localeCompare(b.deliveryTime))
        setOrdersData(ordersList)
        setFilteredOrders(ordersList)
      }, error => {
        console.error('Error fetching orders:', error)
      })
    return () => unsubscribe()
  }, [runnerId])

  const updateOrderStatus = async (orderId, newUIStatus) => {
    const newFirebaseStatus = mapUIStatusToFirebase(newUIStatus)
    setLoadingOrderId(orderId)
    try {
      await firestore()
        .collection('orders')
        .doc(orderId)
        .update({ orderStatus: newFirebaseStatus })

      setOrdersData(prevState => 
        prevState.map(order => 
          order.id === orderId ? { ...order, orderStatus: newFirebaseStatus } : order
        )
      )
      setFilteredOrders(prevState => 
        prevState.map(order => 
          order.id === orderId ? { ...order, orderStatus: newFirebaseStatus } : order
        )
      )
    } catch (error) {
      console.error('Error updating order status:', error)
    } finally {
      setLoadingOrderId(null)
      const index = ordersData.findIndex(order => order.id === orderId)
      if (flatListRef.current && index !== -1) {
        flatListRef.current.scrollToIndex({ index, animated: true })
      }
    }
  }

  const handleStatusChange = (orderId, newUIStatus) => {
    const currentOrder = ordersData.find(order => order.id === orderId)
    const currentStatus = mapFirebaseStatusToUI(currentOrder.orderStatus)

    if (newUIStatus === 'Delivered' && currentStatus !== 'Delivered') {
      setCurrentOrder({ orderNum: currentOrder.orderNum, pickupCode: currentOrder.pickupCode })
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

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query === '') {
      setFilteredOrders(ordersData)
    } else {
      const lowerCaseQuery = query.toLowerCase()
      const filtered = ordersData.filter(order => 
        order.restaurantName.toLowerCase().includes(lowerCaseQuery) ||
        order.orderNum.toString().includes(lowerCaseQuery) ||
        order.customerName.toLowerCase().includes(lowerCaseQuery)
      )
      setFilteredOrders(filtered)
    }
  }

  const onConfirmHandler = () => {
    const { orderNum, pickupCode } = currentOrder
    // Update the order status to 'delivered' in Firebase
    const orderId = ordersData.find(order => order.orderNum === orderNum).id
    updateOrderStatus(orderId, 'Delivered')
  }

  const Order = ({ from, campus, locker, custName, orderNum, deliveryTime, orderStatus, id }) => (
    <View style={[GlobalStyles.lightBorder, { marginBottom: 10 }]}>
      <View style={styles.topSection}>
        <View style={styles.from}>
          <Text style={styles.smText}>From</Text>
          <Text style={styles.mdText}>{from}</Text>
        </View>
        <View style={styles.distanceBar}>
          <View style={styles.dot}></View>
          <View style={styles.dashedLine}></View>
          <View style={styles.dot}></View>
        </View>
        <View style={styles.to}>
          <Text style={styles.smText}>To</Text>
          <Text style={[styles.mdText, {textTransform: 'capitalize'}]}>{campus}</Text>
          <Text style={[styles.mdText, { fontSize: 12, textTransform: 'capitalize' }]}>{locker}</Text>
        </View>
      </View>
      <View style={styles.middleSection}>
          <View style={styles.row}>
            <Text style={[styles.lgText, {textTransform: 'capitalize'}]}>{custName}</Text>
            <Text style={styles.orderNum}>Order <Text style={{ color: colors.theme }} >#{orderNum}</Text></Text>   
          </View>
          <View style={styles.row}>
            <Text style={styles.pickup}>Deliver by</Text>
            <Text style={styles.mdText}>{subtractMinutes(deliveryTime, 15)}</Text>
          </View>
      </View>

      { loadingOrderId === id ? 
        <ActivityIndicator size='small' color={colors.theme} /> : 
        <View style={styles.bottomSection}>
          <Text style={[styles.mdText, { fontSize: 12 }]}>Update Status</Text>
          <StatusToggle 
            option1='On the way' 
            option2='Picked' 
            option3='Deliver' 
            activeStatus={mapFirebaseStatusToUI(orderStatus)} 
            onStatusChange={(newUIStatus) => handleStatusChange(id, newUIStatus)} 
          />
        </View>
      }
    </View>
  )

  return (
    <Layout navigation={navigation} title='Live Orders'>
      <View style={styles.searchBarContainer}> 
        <Image
          source={require('images/search.png')} // Replace with your search icon
          style={styles.icon}
        />
        <TextInput
        style={styles.searchBar}
        placeholder='Search Orders..'
        value={searchQuery}
        onChangeText={handleSearch}
        />
      </View>
      <FlatList
        ref={flatListRef}
        data={filteredOrders}
        renderItem={({ item }) =>
          <Order
            from={item.restaurantName} 
            campus={item.campusName} 
            locker={item.lockerName} 
            custName={item.customerName}
            orderNum={item.orderNum}
            orderStatus= {item.orderStatus}
            deliveryTime={item.deliveryTime}
            id={item.id}
          />}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => (
          <View style={styles.noOrdersContainer}>
            <Text style={styles.noOrdersText}>No Orders</Text>
          </View>
        )}
      />
      <DeliveryModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(!modalVisible)}
        orderNum={currentOrder.orderNum}
        pickupCode={currentOrder.pickupCode}
        onConfirm={onConfirmHandler}
       />
    </Layout>
  )
}

export default OrderListScreen

const styles = StyleSheet.create({
  topSection: {
    backgroundColor: colors.themeLight,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  middleSection: {
    marginTop: 16,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  from: {
    flex: 1,
  },
  to: {
    flex: 1,
  },
  smText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3F80B0'
  },
  mdText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.theme,
  },
  lgText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.theme,
  },
  pickup: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.theme,
    marginTop: 2,
  },
  orderNum: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.darkGray,
  },
  distanceBar: {
    width: 95,
    flexDirection: 'row',
    height: 1,
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 14 ,
  },
  dot:{
    backgroundColor: colors.theme,
    width: 10,
    height: 10,
    borderRadius: 100,
  },
  dashedLine: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#52A5E4',
    borderStyle: 'dashed',
  },
  loadingOverlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  searchBarContainer: {
    position: 'relative'
  },
  searchBar: {
    height: 40,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 30,
    marginVertical: 10,
  },
  icon: {
    width: 16,
    height: 16,
    position: 'absolute',
    top:'35%',
    left: '2%',
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  noOrdersText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
})
