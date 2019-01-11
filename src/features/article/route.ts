import App from '../common/component/App';

const loader = (name: string) => async () => {
    const entrance = await import('./');
    return entrance[name];
};

const childRoutes = [{
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