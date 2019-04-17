import App from '../common/component/App';
import { IRoute } from '@common/routeConfig';

const loader = (name: string) => async () => {
    const entrance = await import('./');
    return entrance[name];
};

const childRoutes: IRoute[] = [{
    path: '/article',
    name: 'Article',
    loader: loader('Article'),
    exact: true
}, {
    path: '/article/:id',
    name: 'Article post',
    loader: loader('ArticlePost'),
}]

export default {
    path: '/article',
    name: '',
    component: App,
    childRoutes
};