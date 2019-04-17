import React from 'react'
import ArticleList from './component/ArticleList'
import { articles } from '../common/fakeData'
import PopularList from './component/PopularList'

import './Article.less'
import { IStore } from '@common/storeConfig'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Dispatch } from 'redux';
import { fetchAction } from '@common/api/action';
import { IApiState } from '@common/api/reducer';
import { ArticleTopic } from '@features/common/types';
import { push } from 'connected-react-router';

interface IArticleProps extends RouteComponentProps<{ id?: string }> {
  isCounselor: boolean
  dispatch: Dispatch
  list1State: IApiState
}

interface IArticleState {}

class Article extends React.Component<IArticleProps, IArticleState> {
  constructor(props: IArticleProps) {
    super(props)
    this.state = {}
  }

  fetchArticleList = (category: ArticleTopic, init?: boolean) => {
    this.props.dispatch(fetchAction('query/articleList', { params: { pageSize: 4, category: category === 'all' ? undefined : category, pageNum: init ? 1 : undefined } }))
  }

  getMostReadArticleList = () => {

  }

  gotoArticlePost = (id: string) => {
    this.props.dispatch(push(`/article/${id}`))
  }

  render() {
    const state1 = this.props.list1State
    const status1 = state1.status
    const list1 = state1.response && state1.response.data && state1.response.data.list ? state1.response.data.list : []
    const hasMore = state1.pageInfo.currentPageNum < state1.pageInfo.totalPageNum
    return (
      <div className="pcs-article">
        <ArticleList list={list1} loadData={this.fetchArticleList} status={status1} hasMore={hasMore} gotoArticlePost={this.gotoArticlePost} />
        <PopularList articles={articles.slice(0, 4)} isCounselor={this.props.isCounselor} />
      </div>
    )
  }
}

const mapState = (state: IStore) => ({
  isCounselor: state['@global'].auth.authType === 1,
  list1State: state['query/articleList']
})

export default connect(mapState)(Article)
