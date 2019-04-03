import { IApiConfig, ApiKey, apiConfig, NetworkStatus, IApiResult, IApiResponse } from "./config";
import { Reducer } from "redux";
import { IApiAction, IFetchSucessAction, IFetchFailedAction } from "./action";

type reducerGenerator = (key: ApiKey, isPage?: boolean) => Reducer

export interface IApiState {
    status?: NetworkStatus
    pageInfo?: IPageInfo
    response?: IApiResponse
    err?: any
}

export interface IPageInfo {
    totalPageNum?: number
    pageSize: number
    totalNum?: number
    currentPageNum: number
}

export const defaultInitPageInfo: IPageInfo = {
    currentPageNum: 0,
    pageSize: 10
}

export type IApiStore = {
    [key in ApiKey]: IApiState
}

const defaultState: IApiState = {
    pageInfo: defaultInitPageInfo
}

const genReducer: reducerGenerator = (key, isPage) => (state: IApiState = isPage ? defaultState : {}, action: IApiAction): IApiState => {
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
                    pageInfo: {
                        currentPageNum,
                        totalNum,
                        totalPageNum,
                        pageSize
                    }
                } : {
                    ...state,
                    status: 'success',
                    response,
                }
        case `${key}_failed`:
            const { err } = action as IFetchFailedAction
            return {
                ...state,
                err,
                status: 'failed'
            }
        case `${key}_remove`:
            return {
                ...state,
                response: {
                    ...state.response,
                    data: null
                }
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