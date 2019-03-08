import Axios from "axios";

export const baseURL = `${window.location.origin}/api/`;

type oAuthKey = 'oauth/signin' | 'oauth/signup' | 'oauth/auth' | 'oauth/apply'
type infoKey = 'info/counselingFilters'

export type ApiKey = oAuthKey | infoKey

export type IApiConfig = {
    [key in ApiKey]: IConfig 
}

export type NetworkStatus = 'loading' | 'success' | 'failed'

export const NetworkErrorMsg = '网络错误，请稍后重试！'

export interface IApiResponse {
    code: number
    data: any | null
    message: string
}

export interface IApiResult {
    status: NetworkStatus
    response: IApiResponse
}

export interface IConfig {
    method: 'POST' | 'GET'
    isPage?: boolean // 分页请求
    processor?: (res: any) => any // 数据额外加工
    initState?: any
}

export const apiConfig: IApiConfig = {
    'oauth/signin': {
        method: 'POST'
    },
    'oauth/signup': {
        method: 'POST'
    },
    'oauth/auth': {
        method: 'GET'
    },
    'oauth/apply': {
        method: 'POST'
    },
    'info/counselingFilters': {
        method: 'GET'
    }
}

export const OtherAPI = {
    'Signout': () => Axios.get(`${baseURL}oauth/signout`)
}