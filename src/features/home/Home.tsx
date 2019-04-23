import React from 'react';
import './Home.less'
import BaseCarousel from '@features/common/component/Carousel';
import ArticleContent from './component/ArticleContent';
import { IStore } from '@common/storeConfig';
import { connect } from 'react-redux';
import { ArticleTopic, Article } from '@features/common/types';
import { Dispatch } from 'redux';
import { fetchAction } from '@common/api/action';
import { push } from 'connected-react-router';

interface IHomeProps {
    articleList: Article[]
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

    render() {
        const { articleList, isCounselor } = this.props
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
                        isCounselor={isCounselor}
                        seeDetail={(id) => this.redirect(`/article/${id}`)}
                    />
                </main>
            </div>
        )
    }
}

const mapState = (state: IStore) => {
    const as = state['query/homeArticleList']
    return {
        articleList: as.response && as.response.data && as.response.data.list ? as.response.data.list : [],
        isCounselor: state['@global'].auth.authType === 1
    }
}

export default connect(mapState)(Home)