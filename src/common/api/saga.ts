import { IConfig, ApiKey, apiConfig, baseURL, IApiResponse } from "./config";
import Axios, { AxiosRequestConfig } from "axios";
import { IFetchSucessAction, IFetchFailedAction, IFetchAction } from "./action";
import { put, fork, take } from "redux-saga/effects";
import store from "@common/storeConfig";
import { IApiState } from "./reducer";

function* fetchData(config: IConfig, key: ApiKey, option?: AxiosRequestConfig) {
    const { method = 'GET' } = config
    let data: any, params: any
    let pageNum, pageSize

    if (option) {
        data = option.data
        params = option.params
    }

    // pagination
    if (config.isPage) {
        const state = store.getState()[key] as IApiState
        pageNum = option && option.params && option.params.pageNum ? option.params.pageNum : state.currentPageNum + 1
        pageSize = option && option.params && option.params.pageSize ? option.params.pageSize : state.pageSize
    }

    let fetchData: { data: IApiResponse }
    try {
        fetchData = yield Axios({
            url: baseURL + key,
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