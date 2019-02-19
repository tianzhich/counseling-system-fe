import App from '../common/component/App';
import { IRoute } from '@common/routeConfig';

const loader = (name: string) => async () => {
    const entrance = await import('./');
    return entrance[name];
};

const childRoutes: IRoute[] = [{
    path: '/home',
    name: 'Home',
    loader: loader('Home'),
}]

export default {
    path: '/home',
    name: '',
    component: App,
    childRoutes
};
