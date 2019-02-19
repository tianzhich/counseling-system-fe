import App from '../common/component/App';
import { IRoute } from '@common/routeConfig';

const loader = (name: string) => async () => {
    const entrance = await import('./');
    return entrance[name];
};

const childRoutes: IRoute[] = [{
    path: '/apply',
    name: 'Apply',
    loader: loader('Apply'),
}]

export default {
    path: '/apply',
    name: '',
    component: App,
    childRoutes
};