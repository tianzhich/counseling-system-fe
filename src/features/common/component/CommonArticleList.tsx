import React from 'react'
import { List, Icon, Avatar, Tag, Divider } from 'antd';
import { ArticleProps } from '../types';
import { avatarURL, fakeCoverURL } from '../fakeData';
import { Link } from 'react-router-dom';

import "./CommonArticleList.less"

interface ICommonArticleListProps {
  list: ArticleProps[]
}

interface ICommonArticleListState {}

const IconText = (props: { type: string; text: string; onClick?: () => void }) => (
  <span onClick={props.onClick}>
    <Icon type={props.type} style={{ marginRight: 8 }} />
    {props.text}
  </span>
)

export default class CommonArticleList extends React.Component<
  ICommonArticleListProps,
  ICommonArticleListState
> {
  constructor(props: ICommonArticleListProps) {
    super(props)
    this.state = {}
  }

  render() {
    const {list} = this.props
    return (
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          pageSize: 3
        }}
        dataSource={list}
        renderItem={(item: ArticleProps) => {
          const tags = item.tags !== '' && item.tags ? item.tags.split(',') : []
          return (
            <List.Item
              key={item.id}
              actions={[
                <IconText type="eye" text={item.readCount.toString()} />,
                <IconText type="star-o" text={item.starCount.toString()} />,
                <IconText type="like-o" text={item.likeCount.toString()} />,
                <IconText
                  type="message"
                  text={item.comment ? item.comment.length.toString() : '0'}
                />
              ]}
              extra={<img width={272} alt="logo" src={fakeCoverURL} />}
            >
              <List.Item.Meta
                avatar={<Avatar src={avatarURL} />}
                title={<Link to={`/article/${item.id}`}>{item.title}</Link>}
                description={
                  <div>
                    <div>
                      作者：<span>{item.authorName}</span>
                    </div>
                    <div>
                      发布时间：<span>{item.postTime}</span>
                    </div>
                    <div>
                      标签：
                      {tags.map(t => (
                        <Tag key={t} color="blue">
                          #{t}
                        </Tag>
                      ))}
                    </div>
                  </div>
                }
              />
              {item.excerpt}
            </List.Item>
          )
        }}
      />
    )
  }
}
