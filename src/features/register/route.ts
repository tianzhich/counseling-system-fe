const loader = (name: string) => async () => {
    const entrance = await import('./');
    return entrance[name];
};

export default {
    path: '/register',
    name: 'Register',
    loader: loader('Register'),
};