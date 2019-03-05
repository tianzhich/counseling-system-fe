import { IConfig, ApiKey, apiConfig, baseURL } from "./config";
import Axios, { AxiosRequestConfig } from "axios";
import { IFetchSucessAction, IFetchFailedAction, IFetchAction } from "./action";
import { put, fork, take, takeEvery } from "redux-saga/effects";

function* fetchData(config: IConfig, key: ApiKey, option?: AxiosRequestConfig) {
    const { method } = config
    let data: any, params: any
    if (option) {
        data = option.data
        params = option.params
    }
    let fetchData

    try {
        fetchData = yield Axios({
            url: baseURL + key,
            method,
            data,
            params
        })
        const successAction: IFetchSucessAction = {
            response: fetchData.data,
            type: `${key}_success`
        }
        yield put(successAction)
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.log(error);
        }
        const failedAction: IFetchFailedAction = {
            type: `${key}_failed`,
            error
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