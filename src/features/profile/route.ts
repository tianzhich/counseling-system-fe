import App from '../common/component/App';
import { IRoute } from '@common/routeConfig';

const loader = (name: string) => async () => {
    const entrance = await import('./');
    return entrance[name];
};

const childRoutes: IRoute[] = [{
    path: '/profile',
    name: 'Profile',
    exact: true,
    redirect: '/profile/counseling'
}, {
    path: '/profile/:activeTab',
    name: 'Profile',
    loader: loader('Profile'),
}]

export default {
    path: '/profile',
    name: '',
    component: App,
    childRoutes
};