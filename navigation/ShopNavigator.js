import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import React from 'react';
import {useDispatch} from "react-redux";
import {Ionicons} from '@expo/vector-icons';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import {Platform, View, Button, SafeAreaView} from 'react-native';
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import Colors from '../constants/Colors';
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import UserProductScreen from "../screens/user/UserProductsScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import AuthScreen from "../screens/user/AuthScreen";
import StartupScreen from "../screens/StartupScreen";
import * as authActions from '../store/actions/auth';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold',
    }, headerBackTitleStyle: {
        fontFamily: 'open-sans',
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
}
const ProductsNavigator = createStackNavigator(
    {
        ProductsOverview: ProductsOverviewScreen,
        ProductDetails: ProductDetailScreen,
        Cart: CartScreen
    },
    {
        navigationOptions: {
            drawerIcon: drawerConfig => (
                <Ionicons name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                          color={drawerConfig.tintColor} size={23}/>
            )
        },
        defaultNavigationOptions: defaultNavOptions
    }
    )
;
const OrderNavigator = createStackNavigator({
        Order: OrdersScreen
    },
    {
        navigationOptions: {
            drawerIcon: drawerConfig => (
                <Ionicons name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                          color={drawerConfig.tintColor} size={23}/>
            )
        },
        defaultNavigationOptions: defaultNavOptions
    }
)
const AdminNavigator = createStackNavigator({
        Order: UserProductScreen,
        EditProduct: EditProductScreen
    },
    {
        navigationOptions: {
            drawerIcon: drawerConfig => (
                <Ionicons name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                          color={drawerConfig.tintColor} size={23}/>
            )
        },
        defaultNavigationOptions: defaultNavOptions
    }
)
const ShopNavigator = createDrawerNavigator({
    Products: ProductsNavigator,
    Orders: OrderNavigator,
    Admin: AdminNavigator
}, {
    contentOptions: {
        activeTintColor: Colors.primary
    },
    contentComponent: props => {
        const dispatch = useDispatch();
        return (
            <View style={{flex: 1, paddingTop: 20}}>
                <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
                    <DrawerItems {...props} />
                    <Button
                        title="Logout"
                        color={Colors.primary}
                        onPress={() => {
                            dispatch(authActions.logout());
                            // props.navigation.navigate('Auth');
                        }}
                    />
                </SafeAreaView>
            </View>
        );
    }
})
const AuthNavigator = createStackNavigator({
    Auth: AuthScreen
}, {
    defaultNavigationOptions: defaultNavOptions
})
const MainNavigator = createSwitchNavigator({
    StartUp: StartupScreen,
    Auth: AuthNavigator,
    Shop: ShopNavigator
})
export default createAppContainer(MainNavigator);
