import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { history } from "./history";

const reducerMap = {
    router: connectRouter(history)
} 

export default combineReducers(reducerMap)