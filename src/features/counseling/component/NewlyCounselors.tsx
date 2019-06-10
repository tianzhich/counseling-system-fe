import React from 'react'
import { Card, Avatar, message, Spin } from 'antd'
import { Counselor } from '@types'
import './NewlyCounselors.less'
import { defaultInitPageInfo, IApiState } from '@common/api/reducer'
import { avatarURL } from '@features/common/fakeData'

const { Meta } = Card

interface INewlyCounselorsProps {
  apiData: IApiState
  fetchData: (params?: any) => void
  gotoExpertHomepage: (e: number) => void
}

const initPageInfo = {
  ...defaultInitPageInfo,
  pageSize: 4
}

interface InfoProps extends Partial<Counselor> {
  onClick: () => void
}

function Description(props: Partial<Counselor>) {
  const description = props.description
  const workYears = props.workYears

  return (
    <React.Fragment>
      <div className="description">{description}</div>
      <div className="work-years">
        从业年限 <span className="number-color">{workYears}</span>
      </div>
    </React.Fragment>
  )
}

function Title(props: InfoProps) {
  const name = props.name
  const rate = props.goodRate * 100

  return (
    <React.Fragment>
      <span className="name" onClick={props.onClick}>
        {name}
      </span>
      <span className="rate">
        {rate ? (
          <span>
            好评率 <span className="number-color">{`${rate}%`}</span>
          </span>
        ) : null}
      </span>
    </React.Fragment>
  )
}

export default class Newlycounselors extends React.Component<INewlyCounselorsProps, {}> {
  loadMore = () => {
    const { pageInfo = initPageInfo } = this.props.apiData
    const pageSize = pageInfo.pageSize
    const pageNum = pageInfo.currentPageNum
    const totalPageNum = pageInfo.totalPageNum
    if (pageNum < totalPageNum) {
      this.props.fetchData()
    } else {
      this.props.fetchData({ pageSize, pageNum: 1 })
    }
  }

  render() {
    const { response, status } = this.props.apiData
    const counselors: Counselor[] = response && response.data ? response.data.list : []
    return (
      <div className="newly-counselors">
        <div className="newly-counselors-header">
          新加入的专家 {status === 'loading' ? <Spin /> : null}
        </div>
        <div className="newly-counselors-content">
          {counselors.map(c => (
            <Card key={c.id}>
              <Meta
                avatar={
                  <div onClick={() => this.props.gotoExpertHomepage(c.id)}>
                    <Avatar src={c.avatar ? c.avatar : require('@images/fakeAvatar.png')} />
                  </div>
                }
                title={
                  <Title
                    name={c.name}
                    goodRate={c.goodRate}
                    onClick={() => this.props.gotoExpertHomepage(c.id)}
                  />
                }
                description={<Description description={c.description} workYears={c.workYears} />}
              />
            </Card>
          ))}
        </div>
        <div className="newly-counselors-footer" onClick={this.loadMore}>
          换一批 >
        </div>
      </div>
    )
  }
}
