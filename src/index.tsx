import React from 'react';
import { render } from 'react-dom';
import Root from "./Root";
import configureStore from './common/storeConfig';
import routes from './common/routeConfig';

import '@src/styles/index.less';

const store = configureStore({})

function renderApp(app: any) {
    render(app, document.getElementById('root'));
}

renderApp(<Root store={store} routes={routes} />);
