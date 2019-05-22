import App from '../common/component/App';
import { IRoute } from '@common/routeConfig';

const loader = (name: string) => async () => {
    const entrance = await import('./');
    return entrance[name];
};

const childRoutes: IRoute[] = [{
    path: '/search',
    name: 'Search',
    loader: loader('Search'),
}]

export default {
    path: '/search',
    name: '',
    component: App,
    childRoutes
};