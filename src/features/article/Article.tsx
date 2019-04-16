import React from 'react';
import ArticleList from "./component/ArticleList";
import { articles } from '../common/fakeData';
import PopularList from './component/PopularList';

import "./Article.less";
import { IStore } from '@common/storeConfig';
import { connect } from 'react-redux';

interface IArticleProps {
    isCounselor: boolean
}

interface IArticleState {}

class Article extends React.Component<IArticleProps, IArticleState> {
    constructor(props: IArticleProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="pcs-article">
                <ArticleList articles={articles} />
                <PopularList articles={articles.slice(0, 4)} isCounselor={this.props.isCounselor} />
            </div>
        )
    }
}

const mapState = (state: IStore) => ({
    isCounselor: state['@global'].auth.authType === 1
})

export default connect(mapState)(Article)