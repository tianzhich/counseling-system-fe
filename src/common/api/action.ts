import { ApiKey, IApiResponse } from './config'
import { AxiosRequestConfig } from 'axios';

export interface IFetchAction {
    key: ApiKey
    type: string // 'ApiKey_fetching'
    options?: AxiosRequestConfig // get请求可以无需options
}

export interface IFetchSucessAction {
    type: string // 'ApiKey_success'
    response: IApiResponse
    currentPageNum?: number
    totalPageNum?: number
    totalNum?: number
    pageSize?: number
}

export interface IFetchFailedAction {
    type: string // 'ApiKey_failed'
    err: any
}

export interface IAxiosRequestConfig extends AxiosRequestConfig {
    appendPath?: string
}

export const fetchAction = (key: ApiKey, options?: IAxiosRequestConfig) => {
    const action: IFetchAction = {
        key,
        options,
        type: `${key}_fetching`
    }
    return action
}

export type IApiAction = IFetchAction | IFetchSucessAction | IFetchFailedAction