import App from '@features/common/component/App';
import { IRoute } from '@common/routeConfig';

const loader = (name: string) => async () => {
    const entrance = await import('./');
    return entrance[name];
};

const childRoutes: IRoute[] = [{
    path: '/post',
    name: 'post',
    loader: loader('Post'),
}]

export default {
    path: '/post',
    name: 'Post',
    component: App,
    childRoutes,
};