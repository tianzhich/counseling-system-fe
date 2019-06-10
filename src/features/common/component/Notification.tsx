import React from 'react'
import { Tabs, Avatar, List } from 'antd'

import './Notification.less'
import { avatarURL } from '../fakeData'
import Emitter from '@utils/events'

const TabPane = Tabs.TabPane

type NotiType = 'counseling' | 'article' | 'ask' | 'letter'
export type NotificationTabKey = 'notification' | 'message'

type IconMap = { [key in NotiType]: React.ReactNode }

const iconMap: IconMap = {
  counseling: <img src={require('@images/new_appoint.svg')} />,
  article: <img src={require('@images/new_appoint.svg')} />,
  ask: <img src={require('@images/new_appoint.svg')} />,
  letter: <img src={require('@images/new_appoint.svg')} />,
}

export interface INotification {
  id: number
  time: string
  title: string
  desc: string
  type: NotiType
  payload: number
}

export interface IMessage {
  id: number
  senderName: string
  senderId: number
  detail: string
  time: string
}

interface INotificationProps {
  notifications: INotification[]
  messages: IMessage[]
  count: {
    notifCount: number
    msgCount: number
  }
  onMarkRead: (type: NotificationTabKey, id?: number, markAll?: boolean) => void
  onRedirect: (url: string) => void
  closeNotif: () => void
}

interface INotificationState {
  tabKey: NotificationTabKey
}

export default class Notification extends React.Component<INotificationProps, INotificationState> {
  constructor(props: INotificationProps) {
    super(props)
    this.state = {
      tabKey: 'notification'
    }
  }

  stopNotifyPropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  toggleTabPane = (k: NotificationTabKey) => {
    this.setState({
      tabKey: k
    })
  }

  replyMessage = (
    receiverId: number,
    receiverName: string,
    srcMsg: string,
    callback?: Function
  ) => {
    Emitter.emit('openMessageModal', { receiverId, receiverName, srcMsg, callback })
  }

  onClickDetail = (t: NotiType, p: number) => {
    let url: string
    switch (t) {
      case 'counseling':
        url = `/profile/${t}/${p}`
        break

      case 'article':
        url = `/article/${p}`
        break

      case 'ask':
        url = `/ask/${p}`
        break

      default:
        break
    }
    this.props.onRedirect(url)
  }

  render() {
    const { notifications, count, messages } = this.props
    const tabKey = this.state.tabKey

    return (
      <div className="notif-overlay" onClick={this.stopNotifyPropagation}>
        <Tabs defaultActiveKey={tabKey} onChange={this.toggleTabPane}>
          <TabPane tab={`通知（${count.notifCount}）`} key="notification">
            <List
              className={notifications.length > 4 ? 'overflow' : ''}
              itemLayout="horizontal"
              dataSource={notifications}
              renderItem={(item: INotification) => (
                <List.Item
                  onClick={() => {
                    this.onClickDetail(item.type, item.payload)
                    this.props.onMarkRead('notification', item.id)
                    this.props.closeNotif()
                  }}
                  actions={[
                    <a
                      onClick={e => {
                        e.stopPropagation()
                        this.props.onMarkRead('notification', item.id)
                      }}
                    >
                      标为已读
                    </a>
                  ]}
                >
                  <List.Item.Meta
                    avatar={iconMap[item.type]}
                    title={item.title}
                    description={item.desc}
                  />
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab={`私信（${count.msgCount}）`} key="message" className="message">
            <List
              className={messages.length > 4 ? 'overflow' : ''}
              itemLayout="horizontal"
              dataSource={messages}
              renderItem={(item: IMessage) => (
                <List.Item
                  onClick={() =>
                    this.replyMessage(item.senderId, item.senderName, item.detail, () =>
                      this.props.onMarkRead('message', item.id)
                    )
                  }
                  actions={[
                    <a
                      onClick={e => {
                        e.stopPropagation()
                        this.props.onMarkRead('message', item.id)
                      }}
                    >
                      标为已读
                    </a>,
                    <a
                      onClick={e => {
                        e.stopPropagation()
                        this.replyMessage(item.senderId, item.senderName, item.detail, () =>
                          this.props.onMarkRead('message', item.id)
                        )
                      }}
                    >
                      回复
                    </a>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={avatarURL} />}
                    title={item.senderName}
                    description={
                      item.detail.length > 100 ? `${item.detail.substr(0, 100)}...` : item.detail
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
        <div className="action">
          {tabKey === 'notification' ? (
            <div onClick={() => this.props.onMarkRead('notification', null, true)}>清空 通知</div>
          ) : (
            <div onClick={() => this.props.onMarkRead('message', null, true)}>清空 私信</div>
          )}
        </div>
      </div>
    )
  }
}
