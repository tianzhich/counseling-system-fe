import React from 'react'
import { ICounselingRecord } from '../Counselor/CounselingTab'
import { List, Avatar, Tag } from 'antd'
import { avatarURL } from '@features/common/fakeData'
import { CounselingRecordStatusMap, CounselingMethodMap } from '@utils/map'

import './CounselingTab.less'

interface ICounselingTabProps {
  data: ICounselingRecord[]
  gotoExpert: (id: number) => void
  gotoDetail: (id: number) => void
}

interface ICounselingTabState {}

export default class CounselingTab extends React.Component<
  ICounselingTabProps,
  ICounselingTabState
> {
  constructor(props: ICounselingTabProps) {
    super(props)
    this.state = {}
  }

  gotoDetail = (id: number) => {
    this.props.gotoDetail(id)
  }

  render() {
    const { data } = this.props
    return (
      <div className="tab-user-counseling">
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item: ICounselingRecord) => {
            const { counselorName, startTime, cID, method, times } = item
            const status = CounselingRecordStatusMap[item.status]
            return (
              <List.Item onClick={() => this.gotoDetail(item.id)}>
                <List.Item.Meta
                  avatar={<Avatar src={avatarURL} />}
                  title={
                    <React.Fragment>
                      <a
                        onClick={e => {
                          e.stopPropagation()
                          this.props.gotoExpert(cID)
                        }}
                      >
                        {counselorName}
                      </a>
                      <Tag color={status.color}>{status.text}</Tag>
                    </React.Fragment>
                  }
                  description={`开始时间: ${startTime !== '' ? startTime : '无'} 咨询方式: ${
                    CounselingMethodMap[method]
                  } 咨询次数: ${times}(40分钟/次)`}
                />
              </List.Item>
            )
          }}
        />
      </div>
    )
  }
}
