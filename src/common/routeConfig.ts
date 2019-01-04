import HomeRoute from "../features/home/route";
import LoginRoute from "../features/login/route";

export type AsyncComponentLoader = () => Promise<any>;

export interface IRoute {
    path: string
    name: string
    component?: React.ComponentClass | React.SFC;
    childRoutes?: IRoute[]
    loader?: AsyncComponentLoader
    exact?: boolean
    redirect?: string
}

const childRoutes: IRoute[] = [HomeRoute, LoginRoute]

const routes = [{
    path: '/',
    name: 'app',
    exact: true,
    redirect: '/home'
}, ...childRoutes]

export default routes;