import React from 'react'
import { Button } from 'antd'
import './Sider.less'
import { featuedTags } from '@features/common/fakeData'
import { Link } from 'react-router-dom';

interface ISiderProps {
  onToggleFeatured: (id: string) => void
  featured: string
  isLoggin: boolean
  postCount: number
  cmtCount: number
}

interface ISiderState {}

export default class Sider extends React.Component<ISiderProps, ISiderState> {
  constructor(props: ISiderProps) {
    super(props)
    this.state = {}
  }

  render() {
    const { featured, isLoggin, postCount, cmtCount } = this.props
    return (
      <div className="sider">
        {isLoggin ? (
          <div className="item item1">
            <div className="content">
              <div>
                <span>{cmtCount}</span>
                <br />
                <span>回答数</span>
              </div>
              <div>
                <span>{postCount}</span>
                <br />
                <span>提问数</span>
              </div>
            </div>
            <div className="actions">
              <Link to="/ask/post">
                <Button type="primary" size="large">
                  我要提问
                </Button>
              </Link>
              <Link to="/profile/ask">
                <Button type="primary" size="large">
                  我的问答
                </Button>
              </Link>
            </div>
          </div>
        ) : null}
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
