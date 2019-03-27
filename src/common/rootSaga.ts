import apiSaga from "./api/saga";
import { all, take, put } from "redux-saga/effects";
import { IFetchSucessAction } from "./api/action";

function* globalSaga() {
    while (true) {
        const action: IFetchSucessAction = yield take(`oauth/auth_success`);
        const authAction = {
            type: '@global/updateAuth',
            auth: {
                isAuth: action.response.code === 1 ? true : false,
                authType: action.response.code === 1 ? action.response.data.userType : -1
            }
        }
        yield put(authAction)
    }
}

const sagas = [
    ...apiSaga,
    globalSaga
]

export default function* rootSaga() {
    yield all(sagas.map((saga: Function) => saga()))
}