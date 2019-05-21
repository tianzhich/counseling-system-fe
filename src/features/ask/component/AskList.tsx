import React from 'react'
import './AskList.less'
import { Icon, Empty, Spin } from 'antd'
import classnames from 'classnames'
import { AskItemProps } from '@features/common/types'
import AskItem from './AskItem'
import { NetworkStatus } from '@common/api/config'

export type AskListType = 'answerFirst' | 'questionFirst' | 'featured'

interface IAskListProps {
  type: AskListType
  list: AskItemProps[]
  onToggleType: (type: AskListType) => void
  loadingStatus: NetworkStatus
  featued: string
}

interface IAskListState {}

const ToggleBarOption = [
  {
    title: '最新答案',
    icon: <Icon type="info-circle" />,
    type: 'answerFirst'
  },
  {
    title: '最新问题',
    icon: <Icon type="question-circle" />,
    type: 'questionFirst'
  },
  {
    title: '30天精华',
    icon: <Icon type="heart" />,
    type: 'featured'
  }
]

export default class AskList extends React.Component<IAskListProps, IAskListState> {
  constructor(props: IAskListProps) {
    super(props)
    this.state = {}
  }

  render() {
    const { type, onToggleType, list, loadingStatus, featued } = this.props
    const itemType = type === 'answerFirst' ? 'answerFirst' : 'questionFirst'
    const llist =
      featued === ''
        ? list
        : list.filter(item => (item.tags.find(t => t.id === featued.split('-')[0]) ? true : false))

    return (
      <div className="ask-list">
        <div className="bar">
          {ToggleBarOption.map(op => (
            <div
              key={op.type}
              className={classnames('bar-item', { active: type === op.type })}
              onClick={() => onToggleType(op.type as AskListType)}
            >
              {op.icon}
              {op.title}
            </div>
          ))}
        </div>
        <div className="list">
          {llist.length > 0 && loadingStatus === 'success' ? (
            llist.map(item => {
              const key = item.recentComment ? item.recentComment.id : item.id
              return <AskItem key={key} type={itemType} data={item} />
            })
          ) : loadingStatus === 'loading' ? (
            <Spin size="large" />
          ) : (
            <Empty />
          )}
        </div>
      </div>
    )
  }
}
