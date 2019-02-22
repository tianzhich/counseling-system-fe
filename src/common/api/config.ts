export const baseURL = `${window.location.origin}/api/`;

export type ApiKey = 'oauth/signin' | 'oauth/signup' | 'oauth/auth'

export type IApiConfig = {
    [key in ApiKey]: IConfig 
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
}