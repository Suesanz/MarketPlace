import {AsyncStorage} from 'react-native';

export const AUTHENTICATE = 'AUTHENTICATE'
export const LOGOUT = 'LOGOUT';

let timer;
export const authenticate = (userId, token, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({type: AUTHENTICATE, userId: userId, token: token});
    };
};
export const signup = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=CAIzaSyAbR6LALEOJxJ_TEVCk2P7VxSJ61F_1xZ8', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        })
        if (!response.ok) {
            const resDataErr = await response.json();
            const errId = resDataErr.error.message;
            let message = "Something went wrong";
            if (errId === 'EMAIL_EXISTS') {
                message = "Email exists already!";
            }
            throw new Error(message);
        }
        const resData = await response.json();
        console.log("resData", resData);
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn) * 1000
        );
        console.log(expirationDate)
        dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000))
        saveDataToStorage(resData.localId, resData.idToken, expirationDate)
    }
}
export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=CAIzaSyAbR6LALEOJxJ_TEVCk2P7VxSJ61F_1xZ8', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        })
        if (!response.ok) {
            const resDataErr = await response.json();
            const errId = resDataErr.error.message;
            let message = "Something went wrong";
            if (errId === 'EMAIL_NOT_FOUND') {
                message = "Email not found";
            } else if (errId === 'INVALID_PASSWORD') {
                message = "Invalid Password";
            }
            throw new Error(message);
        }
        const resData = await response.json();
        // console.log(resData);
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn) * 1000
        );
        console.log(expirationDate)
        dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000))
        saveDataToStorage(resData.localId, resData.idToken, expirationDate)
    }
}

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return {type: LOGOUT};
};

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }
};

const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    };
};
const saveDataToStorage = (userId, token, expirationDate) => {
    AsyncStorage.setItem(
        'userData', JSON.stringify({
            token: token,
            userId: userId,
            expiryDate: expirationDate.toISOString()
        })
    )
}