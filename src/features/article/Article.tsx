import React from 'react';
import ArticleList from "./component/ArticleList";
import { articles } from '../common/fakeData';
import PopularList from './component/PopularList';

import "./Article.less";

interface IArticleProps {}

interface IArticleState {}

export default class Article extends React.Component<IArticleProps, IArticleState> {
    constructor(props: IArticleProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="pcs-article">
                <ArticleList articles={articles} />
                <PopularList articles={articles.slice(0, 4)} />
            </div>
        )
    }
}