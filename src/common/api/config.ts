import Axios from "axios";
import { NotificationTabKey } from "@features/common/component/Notification";

export const baseURL = `${window.location.origin}/api/`;

type oAuthKey = 'oauth/signin' | 'oauth/signup' | 'oauth/auth' | 'oauth/apply'
type infoKey = 'info/counselingFilters'
type queryKey = 'query/counselorList' | 'query/newlyCounselors' | 'query/counselor' | 'query/notifications' | 'query/counselingRecords' |
    'query/messages'
type operationKey = 'operation/appoint' | 'operation/addMessage' | 'operation/appointProcess'

export type ApiKey = oAuthKey | infoKey | queryKey | operationKey

export type IApiConfig = {
    [key in ApiKey]: IConfig
}

export type NetworkStatus = 'loading' | 'success' | 'failed'

export const NetworkErrorMsg = '网络错误，请稍后重试！'
export const ServerErrorMsg = '服务器内部错误，请稍后重试！'

export interface IApiResponse {
    code: number
    data: any
    message: string
}

export interface IApiResult {
    status: NetworkStatus
    response: IApiResponse
}

export interface IConfig {
    method?: 'POST' | 'GET' // default get
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
    'oauth/auth': {},
    'oauth/apply': {
        method: 'POST'
    },
    'info/counselingFilters': {},
    'query/counselorList': {
        method: 'POST',
        isPage: true
    },
    'query/newlyCounselors': {
        isPage: true
    },
    'query/counselor': {},
    'operation/appoint': {
        method: 'POST'
    },
    'query/notifications': {},
    'query/counselingRecords': {},
    'operation/addMessage': {
        method: 'POST'
    },
    'query/messages': {},
    'operation/appointProcess': {
        method: 'POST'
    }
}

export const OtherAPI = {
    'Signout': () => Axios.get(`${baseURL}oauth/signout`),
    'MarkRead': (ids: number[], type: NotificationTabKey) => Axios.get(`${baseURL}operation/markRead?ids=${ids.join(',')}&type=${type}`),
    'GetRecordDetail': (id: number) => Axios.get(`${baseURL}query/counselingRecords?id=${id}`)
}