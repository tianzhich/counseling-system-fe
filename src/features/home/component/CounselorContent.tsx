import React from 'react'
import './CounselorContent.less'
import ContentHeader from './ContentHeader'
import { Counselor } from '@features/common/types'
import { avatarURL } from '@features/common/fakeData'
import { Button } from 'antd'

interface ICounselorContentProps {
  seeMore: () => void
  gotoApply: () => void
  showApply: boolean
  seeDetail: (cid: number) => void
  list: Counselor[]
}

interface ICounselorContentState {
  activeSlide: number
}

export default class CounselorContent extends React.Component<
  ICounselorContentProps,
  ICounselorContentState
> {
  swipeRef: React.RefObject<any>
  constructor(props: ICounselorContentProps) {
    super(props)
    this.state = {
      activeSlide: 0
    }
  }
  render() {
    const { seeMore, gotoApply, showApply, list } = this.props
    const activeSlide = this.state.activeSlide
    const swipeList = [list.slice(0, 4), list.slice(4, 8), list.slice(8, 10)].filter(
      v => v.length !== 0
    )

    console.log(swipeList)

    return (
      <div className="counselor-content-wrapper">
        <div className="counselor-content">
          <ContentHeader
            type="counselor"
            onSeeMore={seeMore}
            onAction={gotoApply}
            hideAction={!showApply}
          />
          <main>
            <div className="swipe" ref={this.swipeRef}>
              <div className="list">
                {swipeList.length !== 0 &&
                  swipeList[activeSlide].map(l => {
                    const major = l.topic.id === 4 ? l.topicOther : l.topic.name
                    const desc = l.description.split('/')
                    return (
                      <div className="item" key={l.id}>
                        <div className="bg" />
                        <header>
                          <img className="avatar" src={avatarURL} alt="" />
                          <span>累计帮助了53人</span>
                        </header>
                        <main>
                          <section className="desc">
                            {
                              desc.map(d => (<div key={d}>{d}</div>))
                            }
                          </section>
                          <section className="major">擅长：{major}</section>
                        </main>
                        <footer>
                          <Button type="primary">预约</Button>
                        </footer>
                      </div>
                    )
                  })}
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }
}
