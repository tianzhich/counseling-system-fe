import React from 'react'
import { Icon } from 'antd'

import './AskContent.less'
import ContentHeader from './ContentHeader';

interface IAskContentProps {
  list: any[]
  gotoPost: () => void
  seeMore: () => void
}

export default class AskContent extends React.Component<IAskContentProps, {}> {
  renderPostList = () => {
    return (
      <div className="item">
        <div className="title">{}</div>
      </div>
    )
  }

  render() {
    const { gotoPost, seeMore } = this.props
    return (
      <div className="ask-content-wrapper">
        <div className="ask-content">
          <ContentHeader onAction={gotoPost} onSeeMore={seeMore} type='ask' />
          <main>
            <div className="list" />
          </main>
        </div>
      </div>
    )
  }
}
