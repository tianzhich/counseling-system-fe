import React from 'react'
import ArticleList from './component/ArticleList'
import { articles } from '../common/fakeData'
import PopularList from './component/PopularList'

import './Article.less'
import { IStore } from '@common/storeConfig'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Dispatch } from 'redux'
import { fetchAction } from '@common/api/action'
import { IApiState } from '@common/api/reducer'
import { ArticleTopic } from '@features/common/types'
import { push } from 'connected-react-router'
import { ArticleProps } from '@types'

interface IArticleProps extends RouteComponentProps<{ id?: string }> {
  isCounselor: boolean
  dispatch: Dispatch
  listState: IApiState
  popularList: ArticleProps[]
}

interface IArticleState {}

class Article extends React.Component<IArticleProps, IArticleState> {
  constructor(props: IArticleProps) {
    super(props)
    this.state = {}
  }

  fetchArticleList = (category: ArticleTopic, init?: boolean) => {
    this.props.dispatch(
      fetchAction('query/articleList', {
        params: {
          pageSize: 4,
          category: category === 'all' ? undefined : category,
          pageNum: init ? 1 : undefined
        }
      })
    )
    // featch popular list
    this.props.dispatch(fetchAction('query/popularList'))
  }

  getMostReadArticleList = () => {}

  gotoArticlePost = (id: string) => {
    this.props.dispatch(push(`/article/${id}`))
  }

  render() {
    const { listState, popularList } = this.props
    const listStatus = listState.status
    const list1 =
      listState.response && listState.response.data && listState.response.data.list
        ? listState.response.data.list
        : []
    const hasMore = listState.pageInfo.currentPageNum < listState.pageInfo.totalPageNum
    return (
      <div className="pcs-article">
        <ArticleList
          list={list1}
          loadData={this.fetchArticleList}
          status={listStatus}
          hasMore={hasMore}
          gotoArticlePost={this.gotoArticlePost}
        />
        <PopularList articles={popularList} isCounselor={this.props.isCounselor} />
      </div>
    )
  }
}

const mapState = (state: IStore) => ({
  isCounselor: state['@global'].auth.authType === 1,
  listState: state['query/articleList'],
  popularList:
    state['query/popularList'].response && state['query/popularList'].response.data
      ? state['query/popularList'].response.data
      : []
})

export default connect(mapState)(Article)
