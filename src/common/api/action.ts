import { ApiKey, IApiResult } from './config'
import { AxiosRequestConfig } from 'axios';

export interface IFetchAction {
    key: ApiKey
    type: string // 'ApiKey_fetching'
    options?: AxiosRequestConfig // get请求可以无需options
}

export interface IFetchSucessAction {
    type: string // 'ApiKey_success'
    response: IApiResult
    currentPageNum?: number
    totalPageNum?: number
    totalNum?: number
    pageSize?: number
}

export interface IFetchFailedAction {
    type: string // 'ApiKey_failed'
    err: any
}

export const fetchAction = (key: ApiKey, options?: AxiosRequestConfig) => {
    const action: IFetchAction = {
        key,
        options,
        type: `${key}_fetching`
    }
    return action
}

export type IApiAction = IFetchAction | IFetchSucessAction | IFetchFailedAction