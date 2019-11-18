import React, {useEffect, useState, useCallback} from 'react';
import {FlatList, Text, Platform, Button, ActivityIndicator, View, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ProductItem from "../../components/Shop/ProductItem";
import * as cartActions from '../../store/actions/cart'
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton'
import {Ionicons} from '@expo/vector-icons'
import * as productActions from '../../store/actions/products'
import Colors from "../../constants/Colors";


const ProductsOverviewScreen = props => {

    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState();
    const [isRefreshing, setRefreshing] = useState(false)
    const dispatch = useDispatch()
    const products = useSelector(state => state.products.availableProducts)

    const loadProducts = useCallback(async () => {
        setError(null)
        setRefreshing(true);
        try {
            await dispatch(productActions.fetchProducts())
        } catch (err) {
            setError(err.message);
        }
        setRefreshing(false);
    }, [dispatch, setError, setLoading])
    useEffect(() => {

        const willFocusSub = props.navigation.addListener('willFocus', loadProducts)

        return () => {
            willFocusSub.remove();
        }

    }, [loadProducts])
    useEffect(() => {
        setLoading(true)
        loadProducts().then(() => {
            setLoading(false)
        });

    }, [dispatch, loadProducts])

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An Error occurred!!</Text>
                <Button title={"Try again"} onPress={loadProducts} color={Colors.primary}/>
            </View>
        )
    }
    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size={'large'} color={Colors.primary}/>
            </View>
        )
    }
    if (!isLoading && products.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No Products!! Add some products..</Text>
            </View>
        )
    }
    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetails', {
            productId: id,
            productTitle: title
        })
    }
    return <FlatList onRefresh={loadProducts} refreshing={isRefreshing} data={products} keyExtractor={item => item.id}
                     renderItem={itemData =>
                         <ProductItem
                             image={itemData.item.imageUrl}
                             title={itemData.item.title}
                             price={itemData.item.price}
                             onSelect={() => {
                                 selectItemHandler(itemData.item.id, itemData.item.title)
                             }}>
                             <Button
                                 color={Colors.primary}
                                 title="View Details"
                                 onPress={() => {
                                     selectItemHandler(itemData.item.id, itemData.item.title)
                                 }}
                             />
                             <Button
                                 color={Colors.primary}
                                 title="To Cart"
                                 onPress={() => {
                                     dispatch(cartActions.addToCart(itemData.item))
                                 }}
                             />
                         </ProductItem>}/>

}
ProductsOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: "All Products",
        headerLeft: <HeaderButtons HeaderButtonComponent={HeaderButton} title="Menu">
            <Item iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} onPress={() => {
                navData.navigation.toggleDrawer()
            }}/>
        </HeaderButtons>,
        headerRight: <HeaderButtons HeaderButtonComponent={HeaderButton}
                                    title="cart">
            <Item iconName={Platform.OS === 'android' ?
                'md-cart' : 'ios-cart'} onPress={() => {
                navData.navigation.navigate("Cart")
            }}/>
        </HeaderButtons>
    }
}
const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default ProductsOverviewScreen;
