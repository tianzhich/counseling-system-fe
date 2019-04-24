import React from 'react'
import { Icon } from 'antd'

import './ContentHeader.less'

type HeaderType = 'counselor' | 'ask' | 'lecture'
type ContentHeaderProps = {
  title: string
  subTitle: string
  seeMoreText: string
  actionText: React.ReactNode
}
type ContentHeaderMap = { [key in HeaderType]: ContentHeaderProps }

const contentHeaderMap: ContentHeaderMap = {
  counselor: {
    title: '心理咨询',
    subTitle: '没有人是一座孤岛，每个人都需要心理咨询',
    seeMoreText: '更多咨询师',
    actionText: (
      <React.Fragment>
        <Icon type="smile" /> 咨询师入驻
      </React.Fragment>
    )
  },
  lecture: {
    title: '心理讲座',
    subTitle: '人人都能学的心理学',
    seeMoreText: '更多讲座',
    actionText: (
      <React.Fragment>
        <Icon type="paper-clip" /> 上传讲座视频
      </React.Fragment>
    )
  },
  ask: {
    title: '心理问答',
    subTitle: '每个人的心事都能找到答案',
    seeMoreText: '更多回答',
    actionText: (
      <React.Fragment>
        <Icon type="question-circle" /> 发布提问
      </React.Fragment>
    )
  }
}

interface IContentHeaderProps {
  type: HeaderType
  onAction?: () => void
  onSeeMore?: () => void
  hideAction?: boolean
}

export default class ContentHeader extends React.Component<IContentHeaderProps, {}> {
  handleSeeMore = () => {
    const seeMore = this.props.onSeeMore
    if (seeMore) {
      seeMore()
    }
  }
  handleAction = () => {
    const action = this.props.onAction
    if (action) {
      action()
    }
  }
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
            <span onClick={this.handleAction} className="action">
              {headerProps.actionText}
            </span>
          ) : null}
          <span onClick={this.handleSeeMore} className="action">
            {headerProps.seeMoreText} <Icon type="right" />
          </span>
        </div>
      </header>
    )
  }
}
