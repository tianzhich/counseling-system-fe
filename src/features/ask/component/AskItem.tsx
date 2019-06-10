import React from 'react'
import { avatarURL, anonyURL } from '@features/common/fakeData'
import { Button, Empty } from 'antd'

import './AskItem.less'
import { AskItemProps } from '@features/common/types'
import moment from '@utils/moment'
import { Link } from 'react-router-dom';

interface IAskItemProps {
  type: 'answerFirst' | 'questionFirst'
  data: AskItemProps
}

interface IAskItemState {}

export default class AskItem extends React.Component<IAskItemProps, IAskItemState> {
  constructor(props: IAskItemProps) {
    super(props)
    this.state = {}
  }

  renderContent = () => {
    const { data, type } = this.props
    const isAnswer = type === 'answerFirst'
    const content  = data.content
    const Header = (
      <Link to={`/ask/${data.id}`} className="title">
        <h2>{data.title}</h2>
      </Link>
    )
    const AnswerBtn = (
      <Link to={`/ask/${data.id}`} className="answer-btn">
        <Button type="primary">去回答</Button>
      </Link>
    )
    if (isAnswer) {
      const recentCmt = data.recentComment
      if (!recentCmt) {
        return null
      }
      const recentCmtTime = moment(recentCmt.time).fromNow()
      return (
        <React.Fragment>
          <div className="header">
            <div className="name">{recentCmt.authorName}</div>
            {AnswerBtn}
          </div>
          <div className="main">
            <div>{recentCmtTime} 回答了：</div>
            {Header}
            <p>{recentCmt.text}</p>
          </div>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <div className="header">
          {Header}
          {AnswerBtn}
        </div>
        <div className="main">
          <p>{content}</p>
        </div>
      </React.Fragment>
    )
  }

  render() {
    const data = this.props.data
    const postTime = moment(data.time).fromNow()
    const cmtCount = data.answerCount
    const starCount = data.starCount
    const isAnony = data.isAnony

    return (
      <div className="ask-item">
        <div className="avatar">
          <img src={isAnony ? require('@images/anonyAvatar.png') : avatarURL} alt="" />
        </div>
        <div className="content">
          {this.renderContent()}
          <div className="footer">
            <span className="time">{postTime} ·</span>
            <span className="answer-count">{cmtCount}个回答 ·</span>
            <span className="star">{starCount}个收藏</span>
          </div>
        </div>
      </div>
    )
  }
}
