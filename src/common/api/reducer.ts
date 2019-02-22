import { apiConfig, IApiConfig, ApiKey } from "./config";
import { Reducer } from "redux";
import { IApiAction, IFetchSucessAction, IFetchFailedAction } from "./action";

type status = 'loading' | 'success' | 'failed'

type reducerGenerator = (key: ApiKey, isPage?: boolean) => Reducer

interface IApiState {
    status?: status
    totalPageNum?: number
    totalNum?: number
    currentPageNum?: number
    pageSize?: number
    data?: any
    err?: any
}

const defaultState: IApiState = {
    currentPageNum: 0,
    pageSize: 10
}

const genReducer: reducerGenerator = (key, isPage) => (state: IApiState = isPage ? defaultState : {}, action: IApiAction) => {
    const { type } = action
    switch (type) {
        case `${key}_fetching`:
            return {
                ...state,
                status: 'loading'
            }
        case `${key}_success`:
            const { data, currentPageNum, totalNum, totalPageNum, pageSize } = action as IFetchSucessAction
            return isPage ? {
                ...state,
                status: 'success',
                data,
                currentPageNum,
                totalNum,
                totalPageNum,
                pageSize
            } : {
                ...state,
                status: 'success',
                data,
            }
        case `${key}_failed`:
            const { error } = action as IFetchFailedAction
            return {
                ...state,
                error
            }
        default:
            return state
    }
}

const apiReducers = Object.keys(apiConfig).reduce((r, apikey: ApiKey) => {
    r[apikey] = genReducer(apikey, apiConfig[apikey].isPage)
    return r
}, {})

export default apiReducers