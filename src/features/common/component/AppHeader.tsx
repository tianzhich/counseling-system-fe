import React from 'react';
import { Menu, Layout, Icon, Tabs, Input, Badge, Dropdown, Avatar, Button } from "antd";
import { NavLink, Route, Link } from 'react-router-dom';

import './AppHeader.less'
import { connect } from 'react-redux';
import { IStore } from '@common/storeConfig';
import { SignModalType } from './SignModal';

const Header = Layout.Header
const TabPane = Tabs.TabPane
const Search = Input.Search

interface IAppHeaderProps {
    onUserSignout: (e: React.MouseEvent) => void
    onOpenSignModal: (t: SignModalType) => void
    isAuth: boolean
}

interface IAppHeaderState {
    showNotif: boolean
}

class AppHeader extends React.Component<IAppHeaderProps, IAppHeaderState> {
    constructor(props: IAppHeaderProps) {
        super(props)
        this.state = {
            showNotif: false
        }
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
    stopNotifyPropagation = (e: React.MouseEvent) => {
        e.stopPropagation()
    }
    componentDidMount() {
        // using window instead of document for React Event
        window.addEventListener('click', this.closeNotif)
    }
    componentWillUnmount() {
        window.removeEventListener('click', this.closeNotif)
    }
    render() {
        const UserOverlay = (
            <Menu>
                <Menu.Item>
                    <Link to="" ><Icon type="user" /> 我的主页</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to="" ><Icon type="setting" /> 设置</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to="" onClick={this.props.onUserSignout} ><Icon type="poweroff" /> 退出</Link>
                </Menu.Item>
            </Menu>
        )
        const NotifOverlay = () => (
            <div className="notif-overlay" onClick={this.stopNotifyPropagation} >
                <Tabs defaultActiveKey="1" >
                    <TabPane tab={`通知（${0}）`} key="1">Content of Tab Pane 1</TabPane>
                    <TabPane tab={`消息（${0}）`} key="2">Content of Tab Pane 2</TabPane>
                </Tabs>
                <div className="action">
                    <div>清空 通知</div>
                    <div>查看 更多</div>
                </div>
            </div>
        )
        const UserViewer = (
            <div className="user-viewer">
                <Search placeholder="站内搜索" />
                <div className="trigger trigger-notif" onClick={this.toggleNotif} >
                    <Badge count={1}><Icon type="bell" style={{ fontSize: "20px" }} /></Badge>
                    {this.state.showNotif ? <NotifOverlay /> : null}
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
})

export default connect(mapState)(AppHeader)