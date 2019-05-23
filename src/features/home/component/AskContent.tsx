import React from 'react'
import { Icon, Avatar, Tag } from 'antd'

import './AskContent.less'
import ContentHeader from './ContentHeader'
import { fakeAskList, avatarURL, fakeRecmdAskPost } from '@features/common/fakeData'
import { AskItemProps } from '@features/common/types'
import { Link } from 'react-router-dom'

interface IAskContentProps {
  list: AskItemProps[]
  featuredList: AskItemProps[]
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
    const { list, featuredList } = this.props
    return (
      <div className="ask-content-wrapper">
        <div className="ask-content">
          <ContentHeader type="ask" />
          <div className="sections">
            <div className="list">
              {list.map(l => {
                const tags = l.tags.map(t => (
                  <span className="tag" key={t.subTags[0].id}>
                    <Tag color="blue">{t.subTags[0].name}</Tag>
                  </span>
                ))
                const recentCmt = l.recentComment
                const cmtEle =
                  recentCmt.text.length > 50 ? (
                    <React.Fragment>
                      {`${recentCmt.text.slice(0, 60)}`}{' '}
                      <Link className="see-more" to={`/ask/${l.id}`}>
                        ...[查看全部]
                      </Link>
                    </React.Fragment>
                  ) : (
                    recentCmt.text
                  )
                return (
                  <div className="item" key={recentCmt.id}>
                    <header>
                      <Link to={`/ask/${l.id}`} className="title">{l.title}</Link>
                      {l.answerCount > 0 ? (
                        <span className="count">{l.answerCount}个回答</span>
                      ) : null}
                      {l.starCount > 0 ? <span className="count">{l.starCount}个收藏</span> : null}
                    </header>
                    <main>
                      <div className="cover">
                        <img src={avatarURL} alt="" />
                      </div>
                      <div className="before" />
                      <div className="content">{cmtEle}</div>
                    </main>
                    <footer>{tags}</footer>
                  </div>
                )
              })}
            </div>
            <div className="recmd-list">
              <div className="header">最近30天精华回答 <Link to="/ask">更多</Link></div>
              {featuredList.map(l => {
                const text = l.title.length > 20 ? <span>{l.title.slice(0, 20)}...</span> : l.title
                return (
                  <div className="item" key={l.id}>
                    <Link to={`/ask/${l.id}`} className="title">{text}</Link>
                    <div className="count">{l.answerCount}回答</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
