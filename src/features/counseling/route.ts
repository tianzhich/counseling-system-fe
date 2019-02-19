import App from '@features/common/component/App';
import { IRoute } from '@common/routeConfig';

const loader = (name: string) => async () => {
    const entrance = await import('./');
    return entrance[name];
};

const childRoutes: IRoute[] = [{
    path: '/counseling',
    name: 'Counseling',
    loader: loader('Counseling'),
}]

export default {
    path: '/counseling',
    name: '',
    component: App,
    childRoutes
};