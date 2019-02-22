import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { history } from "./history";
import apiReducers from "./api/reducer";

const reducerMap = {
    router: connectRouter(history),
    ...apiReducers
} 

export default combineReducers(reducerMap)