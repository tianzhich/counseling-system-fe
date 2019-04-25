import React from 'react'
import { Icon, Avatar, Tag } from 'antd'

import './AskContent.less'
import ContentHeader from './ContentHeader'
import { fakeAskList, avatarURL, fakeRecmdAskPost } from '@features/common/fakeData'

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
          <ContentHeader onAction={gotoPost} onSeeMore={seeMore} type="ask" />
          <div className="sections">
            <div className="list">
              {fakeAskList.map(l => {
                const tags = l.tags === '' ? [] : l.tags.split(',')
                const recmdComment =
                  l.recmdComment.text.length > 50 ? (
                    <React.Fragment>
                      {`${l.recmdComment.text.slice(0, 60)}`}{' '}
                      <span className="see-more">...[查看全部]</span>
                    </React.Fragment>
                  ) : (
                    l.recmdComment.text
                  )
                return (
                  <div className="item" key={l.id}>
                    <header>
                      <span className="title">{l.title}</span>
                      {l.commentCount > 0 ? (
                        <span className="count">{l.commentCount}个回答</span>
                      ) : null}
                      {l.starCount > 0 ? <span className="count">{l.starCount}个收藏</span> : null}
                    </header>
                    <main>
                      <div className="cover">
                        <img src={avatarURL} alt="" />
                      </div>
                      <div className="before" />
                      <div className="content">{recmdComment}</div>
                    </main>
                    <footer>
                      {tags.map(t => (
                        <span className="tag">
                          <Tag color="blue">{t}</Tag>
                        </span>
                      ))}
                    </footer>
                  </div>
                )
              })}
            </div>
            <div className="recmd-list">
              <div className="header">最近30天精华回答</div>
              {
                fakeRecmdAskPost.map(l => {
                  const text = l.title.length > 10 ? <span>{l.title.slice(0, 10)}...</span> : l.title
                  return (
                    <div className="item" key={l.id}>
                      <div className="title">{text}</div>
                      <div className="count">{l.commentCount}回答</div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
