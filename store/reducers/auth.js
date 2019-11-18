import {AUTHENTICATE, LOGOUT} from "../actions/auth";

const initialState = {
    userId: null,
    token: null
}
export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return {
                token: action.token,
                userId: action.userId
            }
        case LOGOUT:
            return initialState;
        // case LOGIN:
        //     return {
        //         token: action.token,
        //         userId: action.userId
        //     }
        default:
            return state;
    }
}