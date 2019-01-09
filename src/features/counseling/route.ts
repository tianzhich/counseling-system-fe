import App from '../common/App';

const loader = (name: string) => async () => {
    const entrance = await import('./');
    return entrance[name];
};

const childRoutes = [{
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