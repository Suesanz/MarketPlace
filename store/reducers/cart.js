import {ADD_TO_CART, REMOVE_FROM_CART} from '../actions/cart'
import CartItem from "../../models/cart-item";
import {ADD_ORDER} from "../actions/order";
import {DELETE_PRODUCT} from "../actions/products";

const initialState = {
    items: {},
    totalAmount: 0
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const addedProduct = action.product
            const prodPrice = addedProduct.price
            const prodTitle = addedProduct.title
            let updatedOrNewCartItem;
            if (state.items[addedProduct.id]) {
                updatedOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    prodPrice,
                    prodTitle,
                    state.items[addedProduct.id].sum + prodPrice)

            } else {
                updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice)
            }
            return {
                ...state,
                items: {...state.items, [addedProduct.id]: updatedOrNewCartItem},
                totalAmount: state.totalAmount + prodPrice
            }

        case REMOVE_FROM_CART:
            const selectedCartItem = state.items[action.pID]
            const quantity = selectedCartItem.quantity
            let updatedCartItems;

            if (quantity > 1) {
                updatedCartItems = new CartItem(quantity - 1,
                    selectedCartItem.productPrice
                    , selectedCartItem.productTitle,
                    selectedCartItem.sum - selectedCartItem.productPrice)
                updatedCartItems = {...state.items, [action.pID]: updatedCartItems}
            } else {
                updatedCartItems = {...state.items}
                delete updatedCartItems[action.pID]
            }
            return {
                ...state, items: updatedCartItems,
                totalAmount: state.totalAmount - selectedCartItem.productPrice
            }
        case ADD_ORDER:
            return initialState;
        case DELETE_PRODUCT:
            if(!state.items[action.pId]){
                return state;
            }
            const updatedItems = {...state.items}
            delete updatedItems[action.pId]
            const itemTotal = state.items[action.pId].sum
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            }
    }
    return state;
}