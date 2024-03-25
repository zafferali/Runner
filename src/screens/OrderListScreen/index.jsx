import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Layout from 'common/Layout'
import SearchBar from 'common/SearchBar'

const OrderListScreen = ({navigation}) => {

  const Order = () => (
    <View style={styles.orderContainer}>
      <View style={styles.topSection}>
        <View style={styles.from}>
          <Text style={styles.smText}></Text>
          <Text style={styles.mdText}></Text>
        </View>
        <View style={styles.to}>
          
        </View>
      </View>
      <View style={styles.middleSection}>

      </View>
      <View style={styles.bottomSection}>

      </View>
    </View>
  )

  
  return (
    <Layout navigation={navigation} title='Live Orders'>
      <SearchBar placeholder='Search Orders..'/>

    </Layout>
  )
}

export default OrderListScreen

const styles = StyleSheet.create({
  orderContainer: {

  },
  topSection: {
    
  }
})