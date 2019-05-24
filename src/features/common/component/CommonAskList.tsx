import React from 'react'
import { List, Icon, Avatar, Divider } from 'antd'
import { AskItemProps } from '../types'
import { Link } from 'react-router-dom'
import { avatarURL } from '../fakeData'
import AskItem from '@features/ask/component/AskItem'
import './CommonAskList.less'

interface ICommonAskListProps {
  list: AskItem[]
}

interface ICommonAskListState {}

const IconText = (props: { type: string; text: string; onClick?: () => void }) => (
  <span onClick={props.onClick}>
    <Icon type={props.type} style={{ marginRight: 8 }} />
    {props.text}
  </span>
)

export default class CommonAskList extends React.Component<
  ICommonAskListProps,
  ICommonAskListState
> {
  constructor(props: ICommonAskListProps) {
    super(props)
    this.state = {}
  }

  render() {
    const { list } = this.props
    return (
      <List
        className="pcs-common-list"
        itemLayout="vertical"
        size="large"
        pagination={{
          pageSize: 3
        }}
        dataSource={list}
        renderItem={(item: AskItemProps) => {
          const recentCmt = item.askComment ? item.askComment[0] : null
          return (
            <List.Item
              key={item.id}
              actions={[
                <IconText type="eye" text={item.readCount.toString()} />,
                <IconText type="star-o" text={item.starCount.toString()} />,
                <IconText type="like-o" text={item.likeCount.toString()} />,
                <IconText type="message" text={item.answerCount.toString()} />
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={avatarURL} />}
                title={<Link to={`/ask/${item.id}`}>{item.title}</Link>}
                description={
                  <div>
                    <div>
                      作者：<span>{item.authorName}</span>
                    </div>
                    <div>
                      发布时间：<span>{item.time}</span>
                    </div>
                    <div>
                      最近回答：
                      {recentCmt ? <span className="recent-cmt">{recentCmt.text}</span> : '暂无'}
                    </div>
                  </div>
                }
              />
              {item.content}
            </List.Item>
          )
        }}
      />
    )
  }
}
