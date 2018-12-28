const loader = (name: string) => async () => {
    const entrance = await import('./');
    return entrance[name];
};

export default {
    path: '/',
    name: 'Home',
    loader: loader('Home'),
    exact: true
};
