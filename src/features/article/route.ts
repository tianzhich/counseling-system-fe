import App from '../common/component/App';
import { IRoute } from '@src/common/routeConfig';

const loader = (name: string) => async () => {
    const entrance = await import('./');
    return entrance[name];
};

const childRoutes: IRoute[] = [{
    path: '/article',
    name: 'Article',
    loader: loader('Article'),
}]

export default {
    path: '/article',
    name: '',
    component: App,
    childRoutes
};