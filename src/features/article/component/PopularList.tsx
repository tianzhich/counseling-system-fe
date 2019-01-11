import React from 'react';
import { Affix } from "antd";
import { Article } from '@src/features/common/types';

import "./PopularList.less";

interface IPopularListProps {
    articles: Article[]
}

function ListItem(props: Pick<Article, "author" | "title" | "date" | "excerpt"> & { number: string }) {
    return (
        <li className="list-item">
            <div className="number">{props.number}</div>
            <div className="content">
                <h4 className="title">{props.title}</h4>
                <p className="excerpt">{props.excerpt}</p>
                <div>
                    <span className="date">{props.date}</span>
                    <span className="author">{props.author.name}</span>
                </div>
            </div>
        </li>
    );
}

export default class PopularList extends React.Component<IPopularListProps, {}> {
    render() {
        return (
            <Affix offsetTop={30}>
                <div className="popular-list">
                    <div className="title-bar">阅读最多</div>
                    <ol>
                        {
                            this.props.articles.map((article, i) =>
                                <ListItem {...article} number={`0${i + 1}`} key={article.id} />
                            )
                        }
                    </ol>
                </div>
            </Affix>
        )
    }
}