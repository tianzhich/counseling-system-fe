import React from 'react';
import { Tabs, Avatar, List } from "antd";

import "./Notification.less"

const TabPane = Tabs.TabPane

type NotiType = 'counseling' | 'article' | 'ask'
type TabKey = '1' | '2'

type IconMap = {
    [key in NotiType]: React.ReactNode
}

const iconMap: IconMap = {
    'counseling': <img src={require('@images/new_appoint.svg')} />,
    'article': <img src={require('@images/new_appoint.svg')} />,
    'ask': <img src={require('@images/new_appoint.svg')} />,
}

export interface INotification {
    id: number
    time: string
    title: string
    desc: string
    type: NotiType
}

interface INotificationProps {
    notifications: INotification[]
    count: {
        notifCount: number
        msgCount: number
    }
    onMarkReadNotif: (id?: number, markAll?: boolean) => void
    seeDetail: (type: string) => void
}

interface INotificationState {
    showNotif: boolean
    tabKey: TabKey
}

export default class Notification extends React.Component<INotificationProps, INotificationState> {
    constructor(props: INotificationProps) {
        super(props);
        this.state = {
            showNotif: false,
            tabKey: '1'
        }
    }

    stopNotifyPropagation = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    toggleTabPane = (k: TabKey) => {
        this.setState({
            tabKey: k
        })
    }

    render() {
        const { notifications, count } = this.props
        const tabKey = this.state.tabKey

        return (
            <div className="notif-overlay" onClick={this.stopNotifyPropagation} >
                <Tabs defaultActiveKey={tabKey} onChange={this.toggleTabPane} >
                    <TabPane tab={`通知（${count.notifCount}）`} key="1">
                        <List
                            itemLayout="horizontal"
                            dataSource={notifications}
                            renderItem={(item: INotification) => (
                                <List.Item
                                    onClick={() => this.props.seeDetail(item.type)}
                                    actions={[<a onClick={() => this.props.onMarkReadNotif(item.id)}>标为已读</a>]}
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
                    <TabPane tab={`留言（${count.msgCount}）`} key="2">Content of Tab Pane 2</TabPane>
                </Tabs>
                <div className="action">
                    <div onClick={tabKey === '1' ? () => this.props.onMarkReadNotif(null, true) : () => { }}>
                        清空 {tabKey === '1' ? '通知' : '留言'}
                    </div>
                    <div onClick={() => this.props.seeDetail(tabKey === '1' ? 'counseling' : 'message')} >
                        查看 详情
                    </div>
                </div>
            </div>
        )
    }
}