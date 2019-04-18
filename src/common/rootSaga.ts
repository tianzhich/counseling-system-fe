import apiSaga from "./api/saga";
import { all, take, put } from "redux-saga/effects";
import { IFetchSucessAction } from "./api/action";

function* authSaga() {
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

function* userSaga() {
    while (true) {
        const action: IFetchSucessAction = yield take(`info/pre_success`);
        const userAction = {
            type: '@global/updateUser',
            user: {
                id: action.response.code === 1 ? action.response.data.id : -1,
                userName: action.response.code === 1 ? action.response.data.userName : '',
                cID: action.response.code === 1 && action.response.data.cID ? action.response.data.cID : -1,
            }
        }
        yield put(userAction)
    }
}

const globalSaga = [authSaga, userSaga]

const sagas = [
    ...apiSaga,
    ...globalSaga
]

export default function* rootSaga() {
    yield all(sagas.map((saga: Function) => saga()))
}