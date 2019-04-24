import React from 'react';
import { Icon, Tag } from 'antd';
import { Article, ArticleTopic } from '@features/common/types';

import "./ArticleContent.less"
import { articleTopicMap } from '@utils/map';

const fakeCover = 'https://ossimg.xinli001.com/20190417/8a3c53c18ee8b5d46d56815fd211d213.jpeg!120x120'

interface IArticleContentProps {
  list: Article[]
  showPost: boolean
  loadList: (c: ArticleTopic) => void
  seeMore: () => void
  seeDetail: (id: number) => void
  gotoPost: () => void
}

interface IArticleContentState {
  activeCategory: ArticleTopic
}

export default class ArticleContent extends React.Component<IArticleContentProps, IArticleContentState> {
  constructor(props: IArticleContentProps) {
    super(props)
    this.state = {
      activeCategory: 'all'
    }
  }
  renderArticleItem = () => {
    const { list, seeDetail } = this.props
    return list.map(l => {
      const tags = l.tags === '' ? [] : l.tags.split(',')
      const excerpt = l.excerpt.length > 40 ? `${l.excerpt.substr(0, 40)}...` : l.excerpt
      return (
        <div className="item" key={l.id}>
          <div className="cover" onClick={() => seeDetail(l.id)}>
            <img src={fakeCover} alt="" />
          </div>
          <div className="main">
            <div className="title" onClick={() => seeDetail(l.id)}>{l.title}</div>
            <div className="excerpt">{excerpt}</div>
            <div className="tags">
              {
                tags.map(t => <Tag color="blue" key={t}>{t}</Tag>)
              }
            </div>
          </div>
        </div>
      )
    })
  }
  loadList = (c: ArticleTopic) => {
    this.setState({
      activeCategory: c
    }, () => this.props.loadList(c))
  }
  render() {
    const active = this.state.activeCategory
    const { seeMore, gotoPost, showPost } = this.props
    return (
      <div className="article-content-wrapper">
        <div className="content">
          <div className="category-bar">
            {
              Object.keys(articleTopicMap).filter(k => k !== 'others').map(k => (
                <div
                  key={k}
                  className={active === k ? 'category active' : 'category'}
                  onClick={() => this.loadList(k as ArticleTopic)}
                >
                  {k === 'all' ? '最新热文' : articleTopicMap[k]}
                </div>
              ))
            }
            <div onClick={seeMore} className="category">更多分类</div>
            {
              showPost ? (
                <div className="post-button" onClick={gotoPost}>
                  <Icon type="highlight" /> 发布文章
                </div>
              ) : null
            }
          </div>
          <div className="list">
            {
              this.renderArticleItem()
            }
          </div>
        </div>
      </div>
    )
  }
}