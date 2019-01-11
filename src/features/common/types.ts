import { articleTopicMap } from "./map";

// Info about Expert
export interface Expert {
    id: string
    name: string
    avatar: string
    description: string
    workYears: number
    goodRate?: number
    motto: string // 格言
    price: number // 咨询价格
}

// article topic
export type ArticleTopic = keyof typeof articleTopicMap;

// article info
export interface Article {
    id: string 
    thumbnail?: string // 缩略图
    title: string // 文章标题
    excerpt?: string // 摘要
    author: Expert
    date: string // 发表日期
    views: number // 浏览量
    tags: string[] // 标签
    content: string
    topic: ArticleTopic
}