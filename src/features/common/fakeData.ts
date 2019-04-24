import { Expert, fakeArticle, AskPost } from "@types";

export const avatarURL = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'

export const newlyExperts: Expert[] = [{
    id: '1',
    name: '凌一',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description: '国家二级心理咨询师，心理学学士',
    workYears: 4,
    goodRate: 100,
    motto: "被看见、被听见、被理解、被接受。",
    price: 600
}, {
    id: '2',
    name: '凌二',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description: '国家二级心理咨询师，心理学学士',
    workYears: 5,
    motto: "爱是通向问题解决的必经道路，让我陪伴你，学会如何爱！",
    price: 800
}, {
    id: '3',
    name: '凌三',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description: '国家二级心理咨询师，心理学学士',
    workYears: 6,
    goodRate: 90,
    motto: "我愿意和你一起面对所有，相信爱具有疗愈一切的力量",
    price: 600
}, {
    id: '4',
    name: '凌四',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description: '国家二级心理咨询师，心理学学士',
    workYears: 10,
    goodRate: 100,
    motto: "心理咨询是摒弃对自我内心的漠视，调养关爱自己的内在，爱是一切的答案。",
    price: 800
}, {
    id: '5',
    name: '凌五',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description: '国家二级心理咨询师，心理学学士',
    workYears: 8,
    motto: "生活无论怎样，请不要忘记微笑，愿您成为自己的太阳，无需凭借谁的光芒！",
    price: 500
}]

export const articles: fakeArticle[] = [{
    id: "1",
    title: "致睡不着的中国人：你有多久没有说过“我很累”了？",
    excerpt: "这些失眠的人，心理上承受了多大的压力，生理上又消耗了多少功能，只有他们自己知道。",
    author: newlyExperts[0],
    date: "2019-01-10",
    views: 1867,
    thumbnail: "https://ossimg.xinli001.com/20190110/8395f50395a178824a0a2ef7357c15b6.jpeg!120x120",
    tags: ["tag1", "tag2"],
    content: "",
    topic: "hotTopic"
}, {
    id: "2",
    title: "在抑郁中挣扎 | 优等生和高知父母们难过的坎儿",
    excerpt: "20个因抑郁症休学在家的家庭。这些孩子在病前很多是重点中学的优等生，自我要求极高。然而在突如其来的心理疾病面前，一切的愿景和家庭秩序都被打碎了。",
    content: "",
    author: newlyExperts[1],
    date: "2019-01-10",
    views: 1590,
    tags: [],
    topic: "growth"
}, {
    id: "3",
    title: "我们重新开始之前，先谈谈这些吧",
    content: "",
    author: newlyExperts[2],
    date: "2019-01-09",
    views: 190,
    tags: ["恋爱沟通"],
    topic: "love"
}, {
    id: "4",
    title: "“我特么就要考试了，急用”|几个可以救急的记忆方法",
    excerpt: "期末考面对如山般的资料该怎么办呢？这篇文章总结了几种高效记忆方法，让你在期末时轻松应对！",
    content: "",
    author: newlyExperts[3],
    date: "2019-01-09",
    views: 1900,
    tags: ["tag1"],
    topic: "growth"
}, {
    id: "5",
    title: "找工作前，听听咨询师的这两个建议| 心事博物馆",
    content: "",
    author: newlyExperts[4],
    date: "2019-01-08",
    views: 3000,
    tags: [],
    topic: "workSkill"
}, , {
    id: "6",
    title: "有爱物陪伴的老年",
    excerpt: "对于老年人而言，由于身体能力下降，活动空间受到限制，老人的时光越来越多的在自己居住的房子或房间中度过，这些空间对老人的心理感受而言是非常重要的。",
    content: "",
    author: newlyExperts[2],
    date: "2019-01-07",
    views: 4590,
    tags: ["tag33"],
    topic: "psychology"
}]

export const fakePostList: any[] = [{
    
}]