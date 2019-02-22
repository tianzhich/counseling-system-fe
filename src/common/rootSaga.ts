import apiSaga from "./api/saga";
import { all } from "redux-saga/effects";

const sagas = [
    ...apiSaga
]

export default function* rootSaga() {
    yield all(sagas.map((saga: Function) => saga()))
}