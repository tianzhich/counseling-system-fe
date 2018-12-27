import React, { ReactElement } from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { history } from "./common/history";
import { IRoute } from "./common/routeConfig";
import { Route, RouteProps, Switch } from "react-router";

interface IRootProps {
    store: any
    routes: IRoute[]
}

function renderRoute(route: IRoute): ReactElement<RouteProps> {
    if (!route.component && (!route.childRoutes || route.childRoutes.length === 0)) {
        return null;
    } else if (route.component && !route.childRoutes) {
        return <Route key={route.path} component={route.component} path={route.path} />
    } else if (!route.component && route.childRoutes) {
        return <Switch>{renderRouteConfig(route.childRoutes)}</Switch>
    } else if (route.component && route.childRoutes) {
        return <Route key={route.path} component={route.component}>{renderRouteConfig(route.childRoutes)}</Route>
    }

}

function renderRouteConfig(routes: IRoute[]) {
    if(routes.length === 0) {
        return null;
    }
    let children: any[] = [];

    routes.forEach(route => { children.push(renderRoute(route)) });

    return <Switch>{children}</Switch>;

}

export default class Root extends React.Component<IRootProps, {}> {
    render() {
        console.log(renderRouteConfig(this.props.routes));
        return (
            <Provider store={this.props.store}>
                <ConnectedRouter history={history}>{renderRouteConfig(this.props.routes)}</ConnectedRouter>
            </Provider>
        )
    }
}