export interface Expert {
    id: string
    name: string
    avatar: string
    description: string
    workYears: number
    goodRate?: number
}

export const newlyExperts: Expert[]  = [{
    id: '1',
    name: '凌一',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description: '国家二级心理咨询师，心理学学士',
    workYears: 4,
    goodRate: 100
}, {
    id: '2',
    name: '凌二',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description: '国家二级心理咨询师，心理学学士',
    workYears: 5,
}, {
    id: '3',
    name: '凌三',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description: '国家二级心理咨询师，心理学学士',
    workYears: 6,
    goodRate: 90
}, {
    id: '4',
    name: '凌四',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description: '国家二级心理咨询师，心理学学士',
    workYears: 10,
    goodRate: 100
}, {
    id: '5',
    name: '凌五',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description: '国家二级心理咨询师，心理学学士',
    workYears: 8,
}]