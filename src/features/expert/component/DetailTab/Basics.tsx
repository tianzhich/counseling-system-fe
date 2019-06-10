import React from 'react'
import { Counselor } from '@features/common/types'

interface IBasicsProps {
  couselor: Counselor
}

export default class Basics extends React.Component<IBasicsProps, {}> {
  render() {
    const descArr = this.props.couselor.description.split(',')
    const topicArr = this.props.couselor.topicOther
      ? this.props.couselor.topicOther.split(',')
      : [this.props.couselor.topic.name]

    return (
      <div className="tab-basics">
        <div className="info veri">
          <img src={require('@images/verification.svg')} alt="" />
          <div>
            <h2 className="info-title">认证资质</h2>
            <div className="content">
              {descArr.map(d => (
                <span key={d}>
                  {d}
                  <br />
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="info topic">
          <img src={require('@images/tag.svg')} alt="" />
          <div>
            <h2 className="info-title">擅长方向</h2>
            <div className="content">
              {topicArr.map(t => (
                <span key={t}>
                  {t}
                  <br />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
