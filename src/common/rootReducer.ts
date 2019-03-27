import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { history } from "./history";
import apiReducers from "./api/reducer";

// global reducer(权限等等)
export interface IGlobalState {
    auth: {
        isAuth: boolean
        authType: Number
    }
}
const initGlobalState: IGlobalState = {
    auth: {
        isAuth: false,
        authType: -1
    }
}
const globalReducer = (state: IGlobalState = initGlobalState, action: any) => {
    const { type } = action
    switch (type) {
        case "@global/updateAuth":
            return {
                ...state,
                auth: action.auth
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