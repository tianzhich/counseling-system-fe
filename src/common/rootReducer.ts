import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { history } from "./history";
import apiReducers from "./api/reducer";

// global reducer(权限等等)
export interface IGlobalState {
    auth: {
        isAuth: boolean
        authType: Number
    },
    user: {
        id: number
        userName: string
        cID: number
    }
}
const initGlobalState: IGlobalState = {
    auth: {
        isAuth: false,
        authType: -1
    },
    user: {
        id: -1,
        userName: '',
        cID: -1
    }
}
const globalReducer = (state: IGlobalState = initGlobalState, action: any): IGlobalState => {
    const { type } = action
    switch (type) {
        case "@global/updateAuth":
            return {
                ...state,
                auth: action.auth
            }
        case "@global/updateUser":
            return {
                ...state,
                user: action.user
            }
        default:
            return state
    }
}

const reducerMap = {
    router: connectRouter(history),
    '@global': globalReducer,
    ...apiReducers
} 

export default combineReducers(reducerMap)