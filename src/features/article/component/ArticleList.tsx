import React from 'react';
import { Menu, Tag } from "antd";
import { ArticleTopic, Article } from '@src/features/common/types';
import { articleTopicMap } from '@src/features/common/map';

import './ArticleList.less'

interface ITopicBar {
    onSelectTopic: (topic: ArticleTopic) => void
    selectedTopic: ArticleTopic
}

interface IArticleListProps {
    articles: Article[]
}

interface IArticleListState {
    topic: ArticleTopic
}

function TopicBar(props: ITopicBar) {
    return (
        <Menu
            mode="horizontal"
            onClick={({ key }) => props.onSelectTopic(key as ArticleTopic)}
            selectedKeys={[props.selectedTopic]}
        >
            {
                Object.keys(articleTopicMap).map(topic =>
                    <Menu.Item key={topic}>{articleTopicMap[topic]}</Menu.Item>
                )
            }
        </Menu>
    );
}

function ArticleItem(props: Article) {
    return (
        <div className="article-item-wrapper">
            <article>
                <div className="content">
                    <h2 className="title">{props.title}</h2>
                    <p className="excerpt">{props.excerpt}</p>
                    <div className="footer">
                        <span className="author">{props.author.name}</span>
                        <span className="date">{props.date}</span>
                        <span className="views">{props.views}阅读</span>
                        <div className="tags">
                            {
                                props.tags.map(tag =>
                                    <Tag key={tag} color="blue">#{tag}</Tag>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="thumbnail">
                    <img src={props.thumbnail ? props.thumbnail : ''} alt="" />
                </div>
            </article>
        </div>
    )
}

export default class ArticleList extends React.Component<IArticleListProps, IArticleListState> {
    constructor(props: IArticleListProps) {
        super(props);
        this.state = {
            topic: "all"
        };
    }

    handleSelectTopic = (topic: ArticleTopic) => {
        this.setState({
            topic
        })
    }

    componentDidMount() {
        // Todo, 
    }

    render() {
        return (
            <div className="article-list">
                <TopicBar onSelectTopic={this.handleSelectTopic} selectedTopic={this.state.topic} />
                {
                    this.props.articles.map(article =>
                        <ArticleItem {...article} key={article.id} />
                    )
                }
            </div>
        )
    }
}