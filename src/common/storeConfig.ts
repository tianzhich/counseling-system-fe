import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import rootReducer, { IGlobalState } from './rootReducer';
import { history } from './history';
import createSagaMiddleware from '@redux-saga/core';
import rootSaga from './rootSaga';
import logger from "redux-logger";
import { IApiStore } from './api/reducer';

export type IStore = IApiStore & {
    "@global": IGlobalState
}

const router = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();

const middlewares = [router, sagaMiddleware, logger]

function configureStore(initialState: any) {
    const store = createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(...middlewares),
        )
    );
    sagaMiddleware.run(rootSaga)
    return store;
}

export default configureStore({})