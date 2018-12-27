import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import rootReducer from './rootReducer';
import { history } from './history';

const router = routerMiddleware(history);

const middlewares = [router]

export default function configureStore(initialState: any) {
    const store = createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(...middlewares),
        )
    );
    return store;
}