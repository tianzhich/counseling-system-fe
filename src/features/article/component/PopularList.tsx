import React from 'react';
import { Affix, Button } from "antd";
import { fakeArticle } from '@types';

import "./PopularList.less";
import { Link } from 'react-router-dom';

interface IPopularListProps {
    articles: fakeArticle[]
    isCounselor: boolean
}

function ListItem(props: Pick<fakeArticle, "author" | "title" | "date" | "excerpt"> & { number: string }) {
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
            <Affix offsetTop={100}>
                <div className="popular-list">
                    <div className="title-bar">阅读最多</div>
                    <ol>
                        {
                            this.props.articles.map((article, i) =>
                                <ListItem {...article} number={`0${i + 1}`} key={article.id} />
                            )
                        }
                    </ol>
                    <div className="post-button" style={{display: this.props.isCounselor ? 'block' : 'none'}}>
                        <Link to="/post"><Button type="primary">发表文章</Button></Link>
                    </div>
                </div>
            </Affix>
        )
    }
}