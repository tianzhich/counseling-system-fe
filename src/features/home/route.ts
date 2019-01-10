import App from '../common/component/App';

const loader = (name: string) => async () => {
    const entrance = await import('./');
    return entrance[name];
};

const childRoutes = [{
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
