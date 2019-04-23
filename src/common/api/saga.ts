import { IConfig, ApiKey, apiConfig, baseURL, IApiResponse } from "./config";
import Axios from "axios";
import { IFetchSucessAction, IFetchFailedAction, IFetchAction, IAxiosRequestConfig } from "./action";
import { put, fork, take } from "redux-saga/effects";
import store from "@common/storeConfig";
import { IApiState } from "./reducer";

function* fetchData(config: IConfig, key: ApiKey, option?: IAxiosRequestConfig) {
    const { method = 'GET', repeat } = config
    let data: any, params: any
    let pageNum, pageSize
    const appendPath = option && option.appendPath ? option.appendPath : ''

    if (option) {
        data = option.data
        params = option.params
    }

    // pagination
    if (config.isPage) {
        const state = store.getState()[key] as IApiState
        pageNum = option && option.params && option.params.pageNum ? option.params.pageNum : state.pageInfo.currentPageNum + 1
        pageSize = option && option.params && option.params.pageSize ? option.params.pageSize : state.pageInfo.pageSize
    }

    let fetchData: { data: IApiResponse }
    const url = repeat ? baseURL + repeat + appendPath : baseURL + key + appendPath 
    try {
        fetchData = yield Axios({
            url,
            method,
            data,
            params: {
                ...params,
                pageNum, pageSize
            }
        })
        const successAction: IFetchSucessAction = config.isPage ? {
            response: fetchData.data,
            type: `${key}_success`,
            pageSize: fetchData.data.data.pageSize,
            currentPageNum: fetchData.data.data.pageNum,
            totalNum: fetchData.data.data.total,
            totalPageNum: Math.ceil(fetchData.data.data.total / fetchData.data.data.pageSize)
        } : {
            response: fetchData.data,
            type: `${key}_success`
        }
        yield put(successAction)
    } catch (err) {
        if (process.env.NODE_ENV === 'development') {
            console.log(err);
        }
        const failedAction: IFetchFailedAction = {
            type: `${key}_failed`,
            err
        }
        yield put(failedAction)
    }
}

export default Object.keys(apiConfig).map((key: ApiKey) => {
    const config: IConfig = apiConfig[key]

    return function* () {
        while (true) {
            const action: IFetchAction = yield take(`${key}_fetching`);
            yield fork(fetchData, config, key, action.options)
        }
    }
})