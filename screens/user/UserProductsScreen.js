import React from 'react';
import {Alert, FlatList, Text, View, Platform, Button} from "react-native";
import {useSelector, useDispatch} from "react-redux";
import ProductItem from "../../components/Shop/ProductItem";
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton'
import Colors from "../../constants/Colors";
import * as productActions from "../../store/actions/products";

const UserProductScreen = (props) => {
    const userProducts = useSelector(state => state.products.userProducts)
    const dispatch = useDispatch()

    const editProductHandler = (id) => {
        props.navigation.navigate("EditProduct", {productId: id})
    }
    const deleteHandler = (id) => {
        Alert.alert('Are you sure', "Do you want to delete this ?", [
            {text: "No", style: "default"},
            {
                text: "Yes",
                style: "destructive",
                onPress: () => {
                    dispatch(productActions.deleteProduct(id))
                }
            }
        ])
    }
    if (userProducts.length === 0) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>No products found, maybe start creating some?</Text>
            </View>
        );
    }
    return (
        <FlatList data={userProducts} keyExtractor={item => item.id}
                  renderItem={itemData =>
                      <ProductItem title={itemData.item.title}
                                   price={itemData.item.price}
                                   image={itemData.item.imageUrl}
                                   onSelect={() => {
                                       editProductHandler(itemData.item.id)
                                   }}>
                          <Button
                              color={Colors.primary}
                              title="Edit"
                              onPress={() => {
                                  editProductHandler(itemData.item.id)
                              }}
                          />
                          <Button
                              color={Colors.primary}
                              title="Delete"
                              onPress={() => {
                                  deleteHandler(itemData.item.id)
                              }}
                          />
                      </ProductItem>
                  }/>
    )
}
UserProductScreen.navigationOptions = navData => ({
    headerTitle: "Your Products",
    headerLeft: <HeaderButtons HeaderButtonComponent={HeaderButton} title="Cart">
        <Item key={Math.random()}
              iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
              onPress={() => {
                  navData.navigation.toggleDrawer()
              }}/>
    </HeaderButtons>,
    headerRight: <HeaderButtons
        HeaderButtonComponent={HeaderButton} title="Add">
        <Item key={Math.random()}
              iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'} onPress={() => {
            navData.navigation.navigate("EditProduct")
        }}/>
    </HeaderButtons>
})
export default UserProductScreen;