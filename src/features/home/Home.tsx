import React from 'react'
import './Home.less'
import BaseCarousel from '@features/common/component/Carousel'
import ArticleContent from './component/ArticleContent'
import { IStore } from '@common/storeConfig'
import { connect } from 'react-redux'
import { ArticleTopic, ArticleProps, Counselor, AskItemProps } from '@features/common/types'
import { Dispatch } from 'redux'
import { fetchAction } from '@common/api/action'
import { push } from 'connected-react-router'
import PostContent from './component/AskContent'
import AskContent from './component/AskContent'
import CounselorContent from './component/CounselorContent'

interface IHomeProps {
  articleList: ArticleProps[]
  counselorList: Counselor[]
  askList: AskItemProps[]
  featuredList: AskItemProps[]
  dispatch: Dispatch
  isCounselor: boolean
}

interface IHomeState {}

class Home extends React.Component<IHomeProps, IHomeState> {
  constructor(props: IHomeProps) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.fetchArticleList('all')
    this.fetchCounselorList()
    this.fetchAskList()
  }

  redirect = (path: string) => {
    this.props.dispatch(push(path))
  }

  fetchArticleList = (c: ArticleTopic) => {
    const p = { pageSize: 6, pageNum: 1 }
    if (c === 'all') {
      this.props.dispatch(fetchAction('query/homeArticleList', { params: { ...p } }))
    } else {
      this.props.dispatch(fetchAction('query/homeArticleList', { params: { ...p, category: c } }))
    }
  }

  fetchCounselorList = () => {
    const p = { pageSize: 10, pageNum: 1 }
    this.props.dispatch(fetchAction('query/homeCounselorList', { params: { ...p } }))
  }

  fetchAskList = () => {
    const params1 = {
      isAnswer: true,
      featured: false
    }
    this.props.dispatch(fetchAction('query/homeAskList', { params: params1 }))

    // featured list
    const params2 = {
      isAnswer: false,
      featured: true
    }
    this.props.dispatch(fetchAction('query/homeAskFeatureList', { params: params2 }))
  }

  render() {
    const { articleList, isCounselor, counselorList, askList, featuredList } = this.props
    const aaskList = askList.length > 5 ? askList.slice(0, 5) : askList
    const ffList = featuredList.length > 15 ? featuredList.slice(0, 15) : featuredList
    return (
      <div className="pcs-home">
        <header>
          <BaseCarousel />
        </header>
        <main>
          <ArticleContent
            list={articleList}
            seeMore={() => this.redirect('/article')}
            gotoPost={() => this.redirect('/post')}
            loadList={this.fetchArticleList}
            showPost={isCounselor}
            seeDetail={id => this.redirect(`/article/${id}`)}
          />
          <AskContent list={aaskList} featuredList={ffList} />
          <CounselorContent
            gotoApply={() => this.redirect('/apply')}
            showApply={!isCounselor}
            seeMore={() => this.redirect('/counseling')}
            seeDetail={id => this.redirect(`/counselor/${id}`)}
            list={counselorList}
          />
        </main>
      </div>
    )
  }
}

const mapState = (state: IStore) => {
  const as = state['query/homeArticleList']
  const cs = state['query/homeCounselorList']
  const askState = state['query/homeAskList']
  const fs = state['query/homeAskFeatureList']
  return {
    articleList:
      as.response && as.response.data && as.response.data.list ? as.response.data.list : [],
    counselorList:
      cs.response && cs.response.data && cs.response.data.list ? cs.response.data.list : [],
    isCounselor: state['@global'].auth.authType === 1,
    askList: askState.response && askState.response.data ? askState.response.data : [],
    featuredList: fs.response && fs.response.data ? fs.response.data : []
  }
}

export default connect(mapState)(Home)
