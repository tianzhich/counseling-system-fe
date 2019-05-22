import HomeRoute from "../features/home/route";
import CounselingRoute from "../features/counseling/route";
import ArticleRoute from "../features/article/route";
import PostRoute from "../features/post/route";
import ApplyRoute from "../features/apply/route";
import ExpertRoute from "../features/expert/route";
import ProfileRoute from "../features/profile/route";
import AskRoute from "../features/ask/route";
import SearchRoute from "../features/search/route";

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

const childRoutes: IRoute[] = [HomeRoute, CounselingRoute, ArticleRoute, PostRoute, ApplyRoute, ExpertRoute, ProfileRoute, AskRoute, SearchRoute]

const routes = [{
    path: '/',
    name: 'app',
    exact: true,
    redirect: '/home'
}, ...childRoutes]

export default routes;