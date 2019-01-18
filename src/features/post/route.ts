
const loader = (name: string) => async () => {
    const entrance = await import('./');
    return entrance[name];
};

export default {
    path: '/post',
    name: 'Post',
    loader: loader('Post'),
};