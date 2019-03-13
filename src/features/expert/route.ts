import App from '../common/component/App';
import { IRoute } from '@common/routeConfig';

const loader = (name: string) => async () => {
    const entrance = await import('./');
    return entrance[name];
};

const childRoutes: IRoute[] = [{
    path: '/expert/:expertId',
    name: 'Expert',
    loader: loader('Expert'),
}]

export default {
    path: '/expert/:expertId',
    name: '',
    component: App,
    childRoutes
};