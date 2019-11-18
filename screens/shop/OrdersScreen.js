import React, {useEffect, useState} from 'react';
import {View, FlatList, Platform, ActivityIndicator, StyleSheet, Text} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton'
import OrderItem from "../../components/Shop/OrderItem";
import * as orderActions from '../../store/actions/order'
import Colors from "../../constants/Colors";

const OrdersScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false)
    const orders = useSelector(state => state.order.orders)
    const dispatch = useDispatch();

    useEffect(() => {
        setIsLoading(true)
        dispatch(orderActions.fetchOrders()).then(() => {
            setIsLoading(false)
        })
    }, [dispatch])

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size={"large"} color={Colors.primary}/>
            </View>
        )
    }
    if (orders.length === 0) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>No orders found, maybe start ordering some?</Text>
            </View>
        );
    }
    return (
        <FlatList data={orders}
                  renderItem={itemData => <OrderItem amount={itemData.item.totalAmount} items={itemData.item.items}
                                                     date={itemData.item.readableDate}/>}
                  keyExtractor={item => item.id}/>


    )
}
OrdersScreen.navigationOptions = navData => ({
    headerTitle: "All Orders",
    headerLeft: <HeaderButtons HeaderButtonComponent={HeaderButton} title="cart">
        <Item key={Math.random()} iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} onPress={() => {
            navData.navigation.toggleDrawer()
        }}/>
    </HeaderButtons>
})
const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default OrdersScreen;