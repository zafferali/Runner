import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Layout from 'common/Layout';
import colors from 'constants/colors';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const subtractMinutes = (time, minutes) => {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins - minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(
    2,
    '0',
  )}`;
};

const OrderListScreen = ({navigation}) => {
  const [ordersData, setOrdersData] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [upcomingOrders, setUpcomingOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Active');
  const [openedOrders, setOpenedOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingAdditionalDetails, setIsFetchingAdditionalDetails] =
    useState(false);
  const runnerId = useSelector(state => state.authentication.runnerId);

  const flatListRef = useRef(null);

  useEffect(() => {
    loadOpenedOrders();
    const unsubscribe = fetchOrders();
    return () => unsubscribe();
  }, [runnerId]);

  useEffect(() => {
    filterOrders(ordersData, activeTab);
  }, [ordersData, activeTab, openedOrders]);

  const loadOpenedOrders = async () => {
    try {
      const openedOrdersString = await AsyncStorage.getItem('openedOrders');
      if (openedOrdersString) {
        setOpenedOrders(JSON.parse(openedOrdersString));
      }
    } catch (error) {
      console.error('Error loading opened orders:', error);
    }
  };

  const saveOpenedOrders = async updatedOpenedOrders => {
    try {
      await AsyncStorage.setItem(
        'openedOrders',
        JSON.stringify(updatedOpenedOrders),
      );
    } catch (error) {
      console.error('Error saving opened orders:', error);
    }
  };

  const fetchOrders = () => {
    if (!runnerId) {
      setIsLoading(false);
      return () => {};
    }

    const runnerRef = firestore().doc(`runners/${runnerId}`);

    return firestore()
      .collection('orders')
      .where('runner', '==', runnerRef)
      .onSnapshot(
        querySnapshot => {
          const ordersList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            orderNum: doc.data()?.orderNum,
            pickupCode: doc.data()?.pickupCode,
            orderStatus: doc.data()?.orderStatus,
            deliveryTime: doc.data()?.deliveryTime,
            restaurantName: doc.data()?.restaurantName,
            branchName: doc.data()?.branchName,
            customer: doc.data()?.customer,
            locker: doc.data()?.locker,
            items: doc.data()?.items,
            instructions: doc.data()?.instructions,
          }));
          ordersList.sort((a, b) =>
            a.deliveryTime.localeCompare(b.deliveryTime),
          );
          setOrdersData(ordersList);
          fetchAdditionalDetails(ordersList);
          setIsLoading(false);
        },
        error => {
          console.error('Error fetching orders:', error);
          setIsLoading(false);
        },
      );
  };

  const fetchAdditionalDetails = async ordersList => {
    setIsFetchingAdditionalDetails(true);
    const updatedOrders = await Promise.all(
      ordersList.map(async order => {
        const customerDoc = order.customer ? await order.customer.get() : null;
        const lockerDoc = order.locker ? await order.locker.get() : null;

        return {
          ...order,
          customerName: customerDoc?.data()?.name,
          campusName: lockerDoc?.data()?.campus,
          lockerName: lockerDoc?.data()?.lockerName,
        };
      }),
    );
    setOrdersData(updatedOrders);
    setIsFetchingAdditionalDetails(false);
  };

  const filterOrders = (orders, tab) => {
    const activeStatuses = [
      'received',
      'ready',
      'on the way',
      'picked',
      'delivered',
    ];
    const pastStatuses = ['completed', 'cancelled'];

    const upcoming = orders.filter(
      order =>
        !openedOrders.includes(order.id) &&
        activeStatuses.includes(order.orderStatus),
    );
    setUpcomingOrders(upcoming);

    const activeOrders = orders.filter(
      order =>
        activeStatuses.includes(order.orderStatus) &&
        openedOrders.includes(order.id),
    );

    const pastOrders = orders.filter(order =>
      pastStatuses.includes(order.orderStatus),
    );

    const filtered = tab === 'Active' ? activeOrders : pastOrders;
    filtered.sort((a, b) => a.deliveryTime.localeCompare(b.deliveryTime));

    setFilteredOrders(filtered);
  };

  const handleSearch = query => {
    setSearchQuery(query);
    if (query === '') {
      filterOrders(ordersData, activeTab);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = [...upcomingOrders, ...filteredOrders].filter(
        order =>
          order.restaurantName?.toLowerCase().includes(lowerCaseQuery) ||
          order.orderNum.toString().includes(lowerCaseQuery) ||
          order.customerName?.toLowerCase().includes(lowerCaseQuery),
      );
      setFilteredOrders(filtered);
    }
  };

  const handleOrderPress = item => {
    if (!openedOrders.includes(item.id)) {
      const updatedOpenedOrders = [...openedOrders, item.id];
      setOpenedOrders(updatedOpenedOrders);
      saveOpenedOrders(updatedOpenedOrders);
    }
    navigation.navigate('OrderDetailScreen', {orderId: item.id});
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.theme} />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      );
    }

    if (filteredOrders.length === 0 && upcomingOrders.length === 0) {
      return (
        <View style={styles.noOrdersContainer}>
          <Text style={styles.noOrdersText}>No Orders</Text>
        </View>
      );
    }

    return (
      <>
        <FlatList
          ref={flatListRef}
          data={filteredOrders}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.orderContainer}
              onPress={() => handleOrderPress(item)}>
              <View style={styles.leftSection}>
                <Text style={styles.lgText}>
                  {item.restaurantName}
                  {item.branchName && `, ${item.branchName}`}
                </Text>
                <Text style={[styles.mdText, {color: colors.theme}]}>
                  Order #{item.orderNum}
                </Text>
                <Text style={styles.deliveryTime}>
                  Deliver to locker before{' '}
                  <Text style={styles.time}>
                    {subtractMinutes(item.deliveryTime, 15)}
                  </Text>
                </Text>
              </View>
              <View style={styles.rightSection}>
                <Image
                  style={styles.next}
                  source={require('images/next.png')}
                />
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      </>
    );
  };

  return (
    <Layout navigation={navigation} title="Live Orders">
      {upcomingOrders.length > 0 && (
        <View style={styles.upcomingSection}>
          <Text style={styles.sectionHeaderText}>New order(s)</Text>
          <ScrollView horizontal style={styles.scrollContainer}>
            {upcomingOrders.map(order => (
              <View key={order.id} style={styles.upcomingOrderContainer}>
                <Text style={styles.lgText}>
                  {order.restaurantName}
                  {order.branchName && `, ${order.branchName}`}
                </Text>
                <Text style={[styles.mdText, {color: colors.theme}]}>
                  Order #{order.orderNum}
                </Text>
                <Text style={styles.deliveryTime}>
                  Deliver to locker before{' '}
                  <Text style={styles.time}>
                    {subtractMinutes(order.deliveryTime, 15)}
                  </Text>
                </Text>
                <TouchableOpacity
                  style={styles.moreDetailsButton}
                  onPress={() => handleOrderPress(order)}>
                  <Text style={styles.moreDetailsText}>More Details</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Active' && styles.activeTab]}
          onPress={() => setActiveTab('Active')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Active' && styles.activeTabText,
            ]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Past' && styles.activeTab]}
          onPress={() => setActiveTab('Past')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Past' && styles.activeTabText,
            ]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {
        // isFetchingAdditionalDetails && (
        //   <View style={styles.loadingAdditionalDetailsContainer}>
        //     <ActivityIndicator size="small" color={colors.theme} />
        //     <Text style={styles.loadingAdditionalDetailsText}>
        //       Fetching additional order details...
        //     </Text>
        //   </View>
        // )
      }
      {renderContent()}
    </Layout>
  );
};

export default OrderListScreen;

const styles = StyleSheet.create({
  lgText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.theme,
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  searchBarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  searchBar: {
    height: 40,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 6,
    paddingLeft: 40,
    backgroundColor: 'white',
  },
  icon: {
    width: 18,
    height: 18,
    position: 'absolute',
    top: '25%',
    left: 10,
    zIndex: 1,
  },
  upcomingSection: {
    backgroundColor: '#F0F4F8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.theme,
    marginBottom: 10,
  },
  upcomingOrderContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    marginRight: 10,
    minWidth: 240,
  },
  moreDetailsButton: {
    backgroundColor: '#E6EEF4',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  moreDetailsText: {
    color: colors.theme,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#F0F4F8',
    borderRadius: 25,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: colors.theme,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGray,
  },
  activeTabText: {
    color: 'white',
  },
  orderContainer: {
    flexDirection: 'row',
    minHeight: 80,
    borderRadius: 10,
    borderColor: '#E6EEF4',
    marginBottom: 10,
    borderWidth: 1,
  },
  leftSection: {
    flex: 4,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  rightSection: {
    backgroundColor: '#E6EEF4',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  next: {
    width: 16,
    height: 16,
    tintColor: colors.theme,
  },
  deliveryTime: {
    fontSize: 14,
    color: colors.darkGray,
  },
  time: {
    color: colors.theme,
    fontWeight: '600',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.darkGray,
  },
  loadingAdditionalDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  loadingAdditionalDetailsText: {
    marginLeft: 10,
    fontSize: 14,
    color: colors.darkGray,
  },
});
