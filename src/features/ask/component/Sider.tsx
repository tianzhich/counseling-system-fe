import React from 'react'
import { Button } from 'antd'
import './Sider.less'
import { featuedTags } from '@features/common/fakeData'
import classnames from 'classnames'

interface ISiderProps {
  onGotoAskPost: () => void
  onToggleFeatured: (id: string) => void
  featured: string
}

interface ISiderState {}

export default class Sider extends React.Component<ISiderProps, ISiderState> {
  constructor(props: ISiderProps) {
    super(props)
    this.state = {}
  }

  gotoAskPost = () => {
    this.props.onGotoAskPost()
  }

  render() {
    const featured = this.props.featured
    return (
      <div className="sider">
        <div className="item item1">
          <div className="content">
            <div>
              <span>0</span>
              <br />
              <span>获赞数</span>
            </div>
            <div>
              <span>0</span>
              <br />
              <span>回答数</span>
            </div>
            <div>
              <span>0</span>
              <br />
              <span>提问数</span>
            </div>
          </div>
          <div className="actions">
            <Button type="primary" size="large" onClick={this.gotoAskPost}>
              我要提问
            </Button>
            <Button type="primary" size="large">
              我的问答
            </Button>
          </div>
        </div>
        <div className="item item2">
          <div className="title">精选分类</div>
          <div className="content">
            {featuedTags.map(t => {
              const id = `${t.parentTag}-${t.id}`
              return (
                <span
                  className={id === featured ? 'active' : ''}
                  key={id}
                  onClick={() => this.props.onToggleFeatured(id)}
                >
                  {t.name}
                </span>
              )
            })}
          </div>
        </div>
        <div className="ads">
          <img
            src="https://ossimg.xinli001.com/20190222/ab6d268dd410fda3f4bc45b64016475f.jpeg"
            alt=""
            width="360px"
          />
        </div>
      </div>
    )
  }
}
