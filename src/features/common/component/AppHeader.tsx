import React from 'react';
import { Menu, Layout, Icon, Tabs, Input, Badge, Dropdown, Avatar, Button, List, notification } from "antd";
import { NavLink, Route, Link } from 'react-router-dom';

import './AppHeader.less'
import { connect } from 'react-redux';
import { IStore } from '@common/storeConfig';
import { SignModalType } from './SignModal';
import Notification, { INotification } from './Notification';
import { OtherAPI } from '@common/api/config';
import { Dispatch } from 'redux';
import { fetchAction } from '@common/api/action';
import { push } from 'connected-react-router';

const Header = Layout.Header
const Search = Input.Search

interface IAppHeaderProps {
    onUserSignout: (e: React.MouseEvent) => void
    onOpenSignModal: (t: SignModalType) => void
    isAuth: boolean
    notifications: INotification[]
    dispatch: Dispatch
}

interface IAppHeaderState {
    showNotif: boolean
    readNotifs: INotification['id'][]
}

class AppHeader extends React.Component<IAppHeaderProps, IAppHeaderState> {
    constructor(props: IAppHeaderProps) {
        super(props)
        this.state = {
            showNotif: false,
            readNotifs: []
        }
    }

    markReadNotifs = (id?: number, markAll?: boolean) => {
        let ids: number[]
        if (markAll) {
            ids = this.props.notifications.map(n => n.id)
            this.setState({
                readNotifs: ids
            })
        } else {
            if (this.state.readNotifs.find(iid => iid === id)) {
                return
            }
            this.setState({
                readNotifs: [...this.state.readNotifs, id]
            })
            ids = [id]
        }
        OtherAPI.MarkReadNotifiction(ids).then(() => this.props.dispatch(fetchAction('query/notifications')))
    }

    toggleNotif = (e: React.MouseEvent) => {
        e.stopPropagation()
        this.setState({
            showNotif: !this.state.showNotif
        })
    }
    closeNotif = () => {
        this.setState({
            showNotif: false
        })
    }
    componentDidMount() {
        // using window instead of document for React Event
        window.addEventListener('click', this.closeNotif)
    }
    componentWillUnmount() {
        window.removeEventListener('click', this.closeNotif)
    }

    render() {
        const readNotifs = this.state.readNotifs
        const notifications = this.props.notifications.filter(n => !readNotifs.find(id => id === n.id))
        const countAll = notifications.length
        const count = {
            notifCount: notifications.length,
            msgCount: 0
        }

        const UserOverlay = (
            <Menu>
                <Menu.Item>
                    <Link to="/profile" ><Icon type="user" /> 我的主页</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to="" ><Icon type="setting" /> 设置</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to="" onClick={this.props.onUserSignout} ><Icon type="poweroff" /> 退出</Link>
                </Menu.Item>
            </Menu>
        )
        const UserViewer = (
            <div className="user-viewer">
                <Search placeholder="站内搜索" />
                <div className="trigger trigger-notif" onClick={this.toggleNotif} >
                    <Badge count={countAll}><Icon type="bell" style={{ fontSize: "20px" }} /></Badge>
                    {
                        this.state.showNotif ?
                            <Notification
                                notifications={notifications}
                                count={count}
                                onMarkReadNotif={this.markReadNotifs}
                                seeDetail={(type: string) => this.props.dispatch(push(`/profile/${type}`))}
                            /> : null
                    }
                </div>
                <Dropdown overlay={UserOverlay}>
                    <div className="trigger trigger-user">
                        <Avatar shape="square" icon="user" />
                    </div>
                </Dropdown>
            </div>
        )
        const SignButtonGroup = (
            <div className="sign-button-group">
                <Button type="primary" ghost onClick={() => this.props.onOpenSignModal('signin')}>登录</Button>
                <Button type="primary" onClick={() => this.props.onOpenSignModal('signup')}>加入智心理</Button>
            </div>
        )

        return (
            <Header>
                <Route children={({ location }) => (
                    <Menu
                        theme="light"
                        mode="horizontal"
                        selectedKeys={[location.pathname.split('/')[1]]}
                    >
                        <Menu.Item key="home">
                            <NavLink to="/">首页</NavLink>
                        </Menu.Item>
                        <Menu.Item key="article">
                            <NavLink to="/article">阅读</NavLink>
                        </Menu.Item>
                        <Menu.Item key="counseling">
                            <NavLink to="/counseling">咨询</NavLink>
                        </Menu.Item>
                    </Menu>
                )} />
                {
                    this.props.isAuth ? UserViewer : SignButtonGroup
                }
            </Header>
        )
    }
}

const mapState = (state: IStore) => ({
    isAuth: state['@global'].auth.isAuth,
    notifications: state['query/notifications'].response && state['query/notifications'].response.data ? state['query/notifications'].response.data : []
})

export default connect(mapState)(AppHeader)