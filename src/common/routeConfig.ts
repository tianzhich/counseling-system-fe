import HomeRoute from "../features/home/route";
import LoginRoute from "../features/login/route";
import CounselingRoute from "../features/counseling/route";
import ArticleRoute from "../features/article/route";
import PostRoute from "../features/post/route";
import RegisterRoute from "../features/register/route";

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

const childRoutes: IRoute[] = [HomeRoute, LoginRoute, CounselingRoute, ArticleRoute, PostRoute, RegisterRoute]

const routes = [{
    path: '/',
    name: 'app',
    exact: true,
    redirect: '/home'
}, ...childRoutes]

export default routes;