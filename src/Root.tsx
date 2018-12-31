import React, { ReactElement } from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { history } from "./common/history";
import { IRoute } from "./common/routeConfig";
import { Route, RouteProps, Switch } from "react-router";
import Loadable from 'react-loadable';
import { AsyncComponentLoader } from "@src/common/routeConfig";

interface IRootProps {
    store: any
    routes: IRoute[]
}

const LoadableComponent = (loader: AsyncComponentLoader) => Loadable({
    loader: () => loader(),
    loading: () => <div>loading...</div>
})

function renderRoute(route: IRoute): ReactElement<RouteProps> {
    // no routes
    if (!route.component && !route.loader && (!route.childRoutes || route.childRoutes.length === 0)) {
        return null;
    }

    // only child routes
    if (!route.component && !route.loader) {
        return renderRouteConfig(route.childRoutes)
    }

    // component routes
    let Component = route.component || LoadableComponent(route.loader);
    if (!route.childRoutes) {
        return <Route
            key={route.path}
            component={Component}
            path={route.path}
            exact={route.exact ? route.exact : undefined}
        />
    } else {
        return (
            <Route
                key={route.path}
                exact={route.exact ? route.exact : undefined}
                render={() => (
                    <Component>
                        {renderRouteConfig(route.childRoutes)}
                    </Component>
                )}
            />
        )
    }
}

function renderRouteConfig(routes: IRoute[]) {
    if (routes.length === 0 || !routes) {
        return null;
    }
    let children: any[] = [];

    routes.forEach(route => { children.push(renderRoute(route)) });

    if(children.length === 1) {
        return children[0];
    }

    return <Switch>{children}</Switch>;

}

export default class Root extends React.Component<IRootProps, {}> {
    render() {
        return (
            <Provider store={this.props.store}>
                <ConnectedRouter history={history}>{renderRouteConfig(this.props.routes)}</ConnectedRouter>
            </Provider>
        )
    }
}