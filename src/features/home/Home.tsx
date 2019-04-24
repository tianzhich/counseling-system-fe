import React from 'react';
import './Home.less'
import BaseCarousel from '@features/common/component/Carousel';
import ArticleContent from './component/ArticleContent';
import { IStore } from '@common/storeConfig';
import { connect } from 'react-redux';
import { ArticleTopic, Article, Counselor } from '@features/common/types';
import { Dispatch } from 'redux';
import { fetchAction } from '@common/api/action';
import { push } from 'connected-react-router';
import PostContent from './component/AskContent';
import AskContent from './component/AskContent';
import CounselorContent from './component/CounselorContent';
import LectureContent from './component/LectureContent';

interface IHomeProps {
    articleList: Article[]
    counselorList: Counselor[]
    dispatch: Dispatch
    isCounselor: boolean
}

interface IHomeState { }

class Home extends React.Component<IHomeProps, IHomeState> {
    constructor(props: IHomeProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.fetchArticleList('all')
        this.fetchCounselorList()
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

    render() {
        const { articleList, isCounselor, counselorList } = this.props
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
                        seeDetail={(id) => this.redirect(`/article/${id}`)}
                    />
                    <AskContent
                        list={[]}
                        gotoPost={() => this.redirect('/')}
                        seeMore={() => this.redirect('/')}
                    />
                    <CounselorContent 
                        gotoApply={() => this.redirect('/apply')}
                        showApply={!isCounselor}
                        seeMore={() => this.redirect('/counseling')}
                        seeDetail={(id) => this.redirect(`/counselor/${id}`)}
                        list={counselorList}
                    />
                    <LectureContent />
                </main>
            </div>
        )
    }
}

const mapState = (state: IStore) => {
    const as = state['query/homeArticleList']
    const cs = state['query/homeCounselorList']
    return {
        articleList: as.response && as.response.data && as.response.data.list ? as.response.data.list : [],
        counselorList: cs.response && cs.response.data && cs.response.data.list ? cs.response.data.list : [],
        isCounselor: state['@global'].auth.authType === 1,
    }
}

export default connect(mapState)(Home)