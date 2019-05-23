import React from 'react'
import { Icon } from 'antd'

import './ContentHeader.less'
import { Link } from 'react-router-dom';

type HeaderType = 'counselor' | 'ask'
type ContentHeaderProps = {
  title: string
  subTitle: string
  seeMoreText: React.ReactNode
  actionText: React.ReactNode
}
type ContentHeaderMap = { [key in HeaderType]: ContentHeaderProps }

const contentHeaderMap: ContentHeaderMap = {
  counselor: {
    title: '心理咨询',
    subTitle: '没有人是一座孤岛，每个人都需要心理咨询',
    seeMoreText: <Link to="/counseling">更多咨询师</Link>,
    actionText: (
      <Link to="/apply">
        <Icon type="smile" /> 咨询师入驻
      </Link >
    )
  },
  ask: {
    title: '心理问答',
    subTitle: '每个人的心事都能找到答案',
    seeMoreText: <Link to="/ask">更多回答</Link>,
    actionText: (
      <Link to="/ask/post">
        <Icon type="question-circle" /> 发布提问
      </Link>
    )
  }
}

interface IContentHeaderProps {
  type: HeaderType
  hideAction?: boolean
}

export default class ContentHeader extends React.Component<IContentHeaderProps, {}> {
  render() {
    const headerProps = contentHeaderMap[this.props.type]
    const { hideAction } = this.props
    return (
      <header className="content-header">
        <div className="title">
          <span>{headerProps.title}</span>
          <span>{headerProps.subTitle}</span>
        </div>
        <div className="actions">
          {!hideAction ? (
            <span className="action">
              {headerProps.actionText}
            </span>
          ) : null}
          <span className="action">
            {headerProps.seeMoreText} <Icon type="right" />
          </span>
        </div>
      </header>
    )
  }
}
