import { articleTopicMap, topicMap } from '@utils/map'

// Info in dict db
export interface DictInfo {
  id: number
  name: string
}

export interface Letter {
  id: number
  time: string
  text: string
}

export interface DetailItem {
  id: number
  title: string
  content: string
}

// Info about Counselor
export interface Counselor {
  id: number
  uid: number
  name: string
  gender: number
  avatar?: string
  description: string
  workYears: number
  goodRate: number | null
  motto: string // 格言
  audioPrice: number
  videoPrice: number
  ftfPrice: number
  city: DictInfo | null
  topic: DictInfo
  topicOther: string
  serviceCount: number
  lettersCount: number
  letters: Letter[]
  articleList: ArticleProps[]
  details: DetailItem[]
}

// deprecated fake expert
export interface Expert {
  id: string
  name: string
  avatar: string
  description: string
  workYears: number
  goodRate?: number
  motto: string // 格言
  price: number
}

// article topic
export type ArticleTopic = keyof typeof articleTopicMap

// article info
export interface fakeArticle {
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

// article comment
export interface ArticleComment {
  id: number
  text: string
  postTime: string
  ref?: ArticleComment
  authorID: number
  authorName: string
  isLike: boolean
  likeCount: number
}

// post comment
export interface PostComment {
  id: number
  text: string
  postTime: string
  authorID: number
  authorName: string
  isLike: boolean
  likeCount: number
  replyTo?: string // 被回复者username
  childComment: PostComment[]
}

// article info
export interface ArticleProps {
  id: number
  cover: string // 缩略图
  title: string // 文章标题
  excerpt: string // 摘要
  postTime: string // 发表日期
  // views: number // 浏览量
  tags: string // 标签
  content: string
  category: ArticleTopic
  authorName: string
  comment: ArticleComment[]
  isRead: boolean
  isStar: boolean
  isLike: boolean
  readCount: number
  likeCount: number // 点赞量
  starCount: number // 收藏量
}

// ask post
export interface AskPost {
  id: number
  title: string 
  postTime: string // 发表日期
  tags: string // 标签
  content: string
  authorName: string
  comment: PostComment[]
  isRead: boolean
  isStar: boolean // 收藏(也叫关注)
  isLike: boolean // 点赞(也叫抱抱)
  readCount: number
  likeCount: number
  starCount: number
}

// post comment(暂用于首页展示)
export interface FakePostComment {
  id: number
  text: string
  authorAvatar: string
  authorName: string
}

// ask post(暂用于首页展示)
export interface FakeAskPost {
  id: number
  title: string 
  // postTime: string // 发表日期
  tags: string // 标签
  // content: string
  commentCount: number
  recmdComment: FakePostComment
  starCount: number
}

export interface FakeRecmdAskPost {
  title: string
  id: number
  commentCount: number
}

// ask tags
export interface AskTags {
  id: string
  name: string
  subTags: null | AskTags[]
}

// featued ask tags
export interface FakeAskTag {
  id: string
  name: string
  parentTag: string
}

// askComment
export interface AskComment{
  id: number
  text: string
  authorId: number
  authorName: string
  replyTo?: string // 被回复人用户名
  time: string
  subComments?: AskComment[]
}

// ask item
export interface AskItemProps {
  id: number
  title: string
  content: string
  time: string
  authorName: string
  authorId: number
  answerCount: number
  starCount: number
  likeCount: number
  readCount: number
  isStar?: boolean
  isLike?: boolean
  isRead?: boolean
  isAnony: boolean
  tags: AskTags[]
  recentComment: AskComment
  askComment: AskComment[]
}

