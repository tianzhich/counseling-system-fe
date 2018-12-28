import App from "../features/home/App";
import HomeRoute from "../features/home/route";

export type AsyncComponentLoader = () => Promise<any>;

export interface IRoute {
    path: string
    name: string
    component?: React.ComponentClass | React.SFC;
    childRoutes?: IRoute[]
    loader?: AsyncComponentLoader
    exact?: boolean
}

const childRoutes: IRoute[] = [HomeRoute]

const routes = [{
    path: '/',
    name: 'Psychological Counseling System',
    component: App,
    childRoutes
}]

export default routes;