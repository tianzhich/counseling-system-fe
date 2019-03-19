import React from 'react';
import { render } from 'react-dom';
import Root from "./Root";
import store from './common/storeConfig';
import routes from './common/routeConfig';

import '@styles/index.less';


function renderApp(app: any) {
    render(app, document.getElementById('root'));
}

renderApp(<Root store={store} routes={routes} />);
