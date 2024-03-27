import { StyleSheet, Text, View, FlatList} from 'react-native'
import React from 'react'
import Layout from 'common/Layout'
import SearchBar from 'common/SearchBar'
import { GlobalStyles } from 'constants/GlobalStyles'
import colors from 'constants/colors'
import StatusToggle from '../../components/common/StatusToggle'

const OrderListScreen = ({navigation}) => {

  const ordersData = [
    {
      id: 301,
      from: 'Rajdhani Express',
      to: 'IIT Delhi',
      toLoc: 'Front Lobby',
      custName: 'Abhinav Chikara',
      orderNum: '301',
      deliveryTime: '15:30'
    },
    
    {
      id: 302,
      from: 'Shalimar',
      to: 'Ascendas IT Park ',
      toLoc: 'Back Lobby',
      custName: 'Kashyap',
      orderNum: '302',
      deliveryTime: '14:30'
    },
    {
      id: 303,
      from: 'Jessie Burger corner',
      to: 'IIT Delhi',
      toLoc: 'Front Lobby',
      custName: 'Sankit',
      orderNum: '303',
      deliveryTime: '12:30'
    },
    {
      id: 304,
      from: 'Rajdhani Express',
      to: 'IIT Delhi',
      toLoc: 'Front Lobby',
      custName: 'Abhinav Chikara',
      orderNum: '304',
      deliveryTime: '18:30'
    },
    {
      id: 305,
      from: 'Rajdhani Express',
      to: 'IIT Delhi',
      toLoc: 'Front Lobby',
      custName: 'Abhinav Chikara',
      orderNum: '304',
      deliveryTime: '18:30'
    },
    {
      id: 306,
      from: 'Rajdhani Express',
      to: 'IIT Delhi',
      toLoc: 'Front Lobby',
      custName: 'Abhinav Chikara',
      orderNum: '304',
      deliveryTime: '18:30'
    },
    {
      id: 307,
      from: 'Rajdhani Express',
      to: 'IIT Delhi',
      toLoc: 'Front Lobby',
      custName: 'Abhinav Chikara',
      orderNum: '304',
      deliveryTime: '18:30'
    },
    {
      id: 308,
      from: 'Rajdhani Express',
      to: 'IIT Delhi',
      toLoc: 'Front Lobby',
      custName: 'Abhinav Chikara',
      orderNum: '304',
      deliveryTime: '18:30'
    },
  ];

  const sortedOrders = ordersData.sort((a, b) => {
    return new Date('1970/01/01 ' + a.deliveryTime) - new Date('1970/01/01 ' + b.deliveryTime);
  });
  

  const Order = ({from, to, toLoc, custName, orderNum}) => (
    <View style={[GlobalStyles.lightBorder, {marginBottom: 10}]}>
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
          <Text style={styles.mdText}>{to}</Text>
          <Text style={[styles.mdText, {fontSize: 12}]}>{toLoc}</Text>
        </View>
      </View>
      <View style={styles.middleSection}>
        <Text style={styles.lgText}>{custName}</Text>
        <Text style={styles.orderNum}>Order <Text style={{ color: colors.theme}} >#{orderNum}</Text></Text>
      </View>
      <View style={styles.bottomSection}>
        <Text style={[styles.mdText, {fontSize: 12}]}>Update Status</Text>
        <StatusToggle option1='On the way' option2='Arrived' option3='Delivered' active='On the way'/>
      </View>
    </View>
  )

  
  return (
    <Layout navigation={navigation} title='Live Orders'>
      <SearchBar placeholder='Search Orders..'/>
      <FlatList
      data={sortedOrders}
      renderItem={({ item }) => 
      <Order
        from={item.from}
        to={item.to}
        toLoc={item.toLoc}
        custName={item.custName}
        orderNum={item.id}
      />} 
      keyExtractor={item => item.id}
    />
    </Layout>
  )
}

export default OrderListScreen

const styles = StyleSheet.create({
  orderContainer: {

  },
  topSection: {
    backgroundColor: colors.themeLight,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  middleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  orderNum: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.darkGray,
  },
  updateText: {

  },
  // distanceBar
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
  }
})