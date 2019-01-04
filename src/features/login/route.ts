const loader = (name: string) => async () => {
    const entrance = await import('./');
    return entrance[name];
};

export default {
    path: '/login',
    name: 'login',
    loader: loader('Login'),
};
