import PRODUCTS from '../../data/dummy-data';
import {CREATE_PRODUCT, DELETE_PRODUCT, SET_PRODUCTS, UPDATE_PRODUCT} from "../actions/products";
import Product from "../../models/product";

const initialState = {
    availableProducts: [],
    userProducts: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_PRODUCTS:
            return {
                availableProducts: action.products,
                userProducts: action.userProducts
            }
        case DELETE_PRODUCT:
            return {
                ...state,
                userProducts: state.userProducts.filter(product => product.id !== action.pId),
                availableProducts: state.availableProducts.filter(product => product.id !== action.pId)
            }
        case CREATE_PRODUCT:
            const newProduct = new Product(action.productData.id, action.productData.ownerId,
                action.productData.title, action.productData.description, action.productData.imageUrl, action.productData.price
            )
            return {
                ...state,
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct)
            }
        case UPDATE_PRODUCT:
            const productIndex = state.userProducts.findIndex(prod => prod.id === action.pId)
            const updatedProduct = new Product(action.pId, state.userProducts[productIndex].ownerId, action.productData.title, action.productData.description, action.productData.imageUrl, state.userProducts[productIndex].price
            )

            const updatedUserProducts = [...state.userProducts]
            updatedUserProducts[productIndex] = updatedProduct

            const availableIndex = state.availableProducts.findIndex(prod => prod.id === action.pId)
            const updatedAvailableProducts = [...state.availableProducts]
            updatedAvailableProducts[availableIndex] = updatedProduct
            // console.log("Updated")
            return {
                ...state,
                userProducts: updatedUserProducts,
                availableProducts: updatedAvailableProducts

            }
    }
    return state;
}
