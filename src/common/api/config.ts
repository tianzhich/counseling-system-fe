import Axios from 'axios'
import { NotificationTabKey } from '@features/common/component/Notification'

export const baseURL = `${window.location.origin}/api/`

type oAuthKey = 'oauth/signin' | 'oauth/signup' | 'oauth/auth' | 'oauth/apply'
type infoKey =
  | 'info/counselingFilters'
  | 'info/pre'
  | 'info/preCounselor'
  | 'info/askTags'
  | 'info/myArticleList'
  | 'info/myAskList'
type queryKey =
  | 'query/counselorList'
  | 'query/newlyCounselors'
  | 'query/counselor'
  | 'query/notifications'
  | 'query/counselingRecords'
  | 'query/messages'
  | 'query/articleList'
  | 'query/popularList'
  | 'query/homeArticleList'
  | 'query/homeCounselorList'
  | 'query/homeAskList'
  | 'query/homeAskFeatureList'
  | 'query/askList'
  | 'query/search'
type operationKey =
  | 'operation/appoint'
  | 'operation/addMessage'
  | 'operation/appointProcess'
  | 'operation/article'
  | 'operation/addAsk'
  | 'operation/addAskComment'

export type ApiKey = oAuthKey | infoKey | queryKey | operationKey

export type IApiConfig = { [key in ApiKey]: IConfig }

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
  repeat?: ApiKey
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
  },
  'info/pre': {},
  'info/preCounselor': {},
  'operation/article': {
    method: 'POST'
  },
  'query/articleList': {
    isPage: true
  },
  'query/popularList': {},
  'query/homeArticleList': {
    isPage: true,
    repeat: 'query/articleList'
  },
  'query/homeCounselorList': {
    isPage: true,
    repeat: 'query/counselorList',
    method: 'POST'
  },
  'query/homeAskList': {
    repeat: 'query/askList'
  },
  'query/homeAskFeatureList': {
    repeat: 'query/askList'
  },
  'info/askTags': {},
  'operation/addAsk': {
    method: 'POST'
  },
  'query/askList': {},
  'operation/addAskComment': {
    method: 'POST'
  },
  'query/search': {},
  'info/myArticleList': {},
  'info/myAskList': {}
}

export const OtherAPI = {
  Signout: () => Axios.get(`${baseURL}oauth/signout`),
  MarkRead: (ids: number[], type: NotificationTabKey) =>
    Axios.get(`${baseURL}operation/markRead?ids=${ids.join(',')}&type=${type}`),
  GetRecordDetail: (id: number) => Axios.get(`${baseURL}query/counselingRecords?id=${id}`),
  UpdateUserInfo: (data: any) => Axios.post(`${baseURL}operation/updateInfo?type=2`, data),
  UpdateCounselorInfo: (data: any) => Axios.post(`${baseURL}operation/updateInfo?type=1`, data),
  GetArticleDraft: () => Axios.get(`${baseURL}info/articleDraft`),
  GetArticleByID: (id: string) => Axios.get(`${baseURL}query/article?id=${id}`),
  AddArticleComment: (data: any) => Axios.post(`${baseURL}operation/articleComment`, data),
  ToggleStarLike: (
    id: number,
    type1: 'star' | 'like',
    type2: 'article' | 'article_comment' | 'ask'
  ) => Axios.get(`${baseURL}operation/starLike?refID=${id}&type1=${type1}&type2=${type2}`),
  CountReadByID: (id: number, type: 'article' | 'ask') =>
    Axios.get(`${baseURL}operation/countRead?refID=${id}&type=${type}`),
  GetAskByID: (id: string) => Axios.get(`${baseURL}query/ask?id=${id}`)
}
