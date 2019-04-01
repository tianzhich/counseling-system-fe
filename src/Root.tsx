import React, { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { history } from "./common/history";
import { IRoute } from "./common/routeConfig";
import { Route, RouteProps, Switch, Redirect, Router } from "react-router";
import Loadable from 'react-loadable';
import { AsyncComponentLoader } from "@common/routeConfig";
import Loading from "./features/common/component/Loading";
import { fetchAction } from "@common/api/action";
import { ApiKey } from "@common/api/config";
import Axios from "axios";
import { LocaleProvider } from "antd";
import zh_CN from 'antd/lib/locale-provider/zh_CN';

const authKey: ApiKey = 'oauth/auth'

interface IRootProps {
    store: any
    routes: IRoute[]
}

const LoadableComponent = (loader: AsyncComponentLoader) => Loadable({
    loader: () => loader(),
    loading: () => <Loading />
})

function renderRedirect(to: string) {
    return <Redirect to={to} />
}

function renderRoute(route: IRoute): ReactElement<RouteProps> {
    // no routes
    if (!route.redirect && !route.component && !route.loader && (!route.childRoutes || route.childRoutes.length === 0)) {
        return null;
    }

    // only child routes
    if (!route.component && !route.loader && !route.redirect) {
        return renderRouteConfig(route.childRoutes)
    }

    // redirect
    if (route.redirect) {
        return <Route key={route.path} path={route.path} render={() => renderRedirect(route.redirect)} exact={route.exact} />
    }

    // component routes
    let Component = route.component || LoadableComponent(route.loader);
    if (!route.childRoutes) {
        return <Route key={route.path} component={Component} path={route.path} exact={route.exact} />
    } else {
        return <Route key={route.path} exact={route.exact} path={route.path}
            render={() => (
                <Component>
                    {renderRouteConfig(route.childRoutes)}
                </Component>
            )} />
    }
}

function renderRouteConfig(routes: IRoute[]) {
    if (routes.length === 0 || !routes) {
        return null;
    }
    let children: any[] = [];

    routes.forEach(route => { children.push(renderRoute(route)) });

    if (children.length === 1) {
        return children[0];
    }

    return <Switch>{children}</Switch>;

}

export default class Root extends React.Component<IRootProps, {}> {
    componentDidMount() {
        // 登录验证
        this.props.store.dispatch(fetchAction('oauth/auth'))
    }
    render() {
        return (
            <LocaleProvider locale={zh_CN}>
                <Provider store={this.props.store}>
                    <ConnectedRouter history={history}>{renderRouteConfig(this.props.routes)}</ConnectedRouter>
                </Provider>
            </LocaleProvider>
        )
    }
}