import HomeRoute from "../features/home/route";
import CounselingRoute from "../features/counseling/route";
import ArticleRoute from "../features/article/route";
import PostRoute from "../features/post/route";
import ApplyRoute from "../features/apply/route";

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

const childRoutes: IRoute[] = [HomeRoute, CounselingRoute, ArticleRoute, PostRoute, ApplyRoute]

const routes = [{
    path: '/',
    name: 'app',
    exact: true,
    redirect: '/home'
}, ...childRoutes]

export default routes;