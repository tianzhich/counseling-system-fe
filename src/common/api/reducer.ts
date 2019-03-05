import { IApiConfig, ApiKey, apiConfig, NetworkStatus } from "./config";
import { Reducer } from "redux";
import { IApiAction, IFetchSucessAction, IFetchFailedAction } from "./action";

type reducerGenerator = (key: ApiKey, isPage?: boolean) => Reducer

interface IApiState {
    status?: NetworkStatus
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
            const { currentPageNum, totalNum, totalPageNum, pageSize } = action as IFetchSucessAction
            const { processor } = apiConfig[key]
            let { response } = action as IFetchSucessAction
            if (processor) {
                response = processor(response)
            }
            return isPage ?
                {
                    ...state,
                    status: 'success',
                    response,
                    currentPageNum,
                    totalNum,
                    totalPageNum,
                    pageSize
                } : {
                    ...state,
                    status: 'success',
                    response,
                }
        case `${key}_failed`:
            const { error } = action as IFetchFailedAction
            return {
                ...state,
                error,
                status: 'failed'
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