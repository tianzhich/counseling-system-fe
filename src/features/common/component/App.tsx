import React from 'react';
import { Layout, Modal, Button, Badge, Avatar, message, Icon, Dropdown, Menu, Anchor } from 'antd';
import { RouteComponentProps, Link, withRouter } from 'react-router-dom';
import Navigator from './Navigator';
import SignModal, { SignModalType } from './SignModal';

import './App.less'
import { connect } from 'react-redux';
import { ApiKey, OtherAPI } from '@common/api/config';
import { NetworkErrorMsg } from '@common/api/reducer';
import { Dispatch } from 'redux';
import { fetchAction } from '@common/api/action';
import Emitter from '@utils/events';
import { EventEmitter } from 'events';

const { Header, Content, Footer } = Layout;

interface IAppProps extends RouteComponentProps {
    isAuth: boolean
    dispatch: Dispatch
}

interface IAppState {
    signModal: SignModalType
}

const authKey: ApiKey = 'oauth/auth'

class App extends React.Component<IAppProps, IAppState> {
    signModalRef: React.RefObject<any>
    signinToken: EventEmitter

    constructor(props: IAppProps) {
        super(props);
        this.signModalRef = React.createRef();
        this.state = {
            signModal: 'signin'
        }
    }

    openModal = (type: SignModalType) => {
        this.setState({
            signModal: type
        }, this.signModalRef.current.openModal())
    }

    handleChangeModal = (type: SignModalType) => {
        this.setState({
            signModal: type
        })
    }

    handleUserSignout = (e: React.MouseEvent) => {
        e.preventDefault()
        OtherAPI.Signout().then(res => {
            window.location.reload()
        }).catch(err => {
            message.error(NetworkErrorMsg)
        })
    }

    componentDidMount() {
        this.signinToken = Emitter.addListener('openSigninModal', () => this.openModal('signin'))
    }

    componentWillUnmount() {
        this.signinToken.removeAllListeners()
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
                    <Link to="" onClick={this.handleUserSignout} ><Icon type="poweroff" /> 退出</Link>
                </Menu.Item>
            </Menu>
        )
        const UserViewer = (
            <div className="user-viewer">
                <Badge count={1}><Icon type="message" style={{ fontSize: "25px" }} /></Badge>
                <Badge dot><Icon type="bell" style={{ fontSize: "25px" }} /></Badge>
                <Dropdown overlay={UserOverlay}>
                    <Badge count={1} style={{cursor: "pointer"}}><Avatar shape="square" icon="user" /></Badge>
                </Dropdown>
            </div>
        )
        const SignButtonGroup = (
            <div className="sign-button-group">
                <Button type="primary" ghost onClick={() => this.openModal('signin')}>登录</Button>
                <Button type="primary" onClick={() => this.openModal('signup')}>加入智心理</Button>
            </div>
        )

        return (
            <div className="pcs-app">
                <Layout>
                    <Header>
                        <Navigator />
                        {
                            this.props.isAuth ? UserViewer : SignButtonGroup
                        }
                    </Header>
                    <Content>
                        <div className="pcs-content">{this.props.children}</div>
                    </Content>
                    <Footer>
                        Zhi Psychological Counseling System ©2018 Created by Tian Zhi
                    </Footer>
                </Layout>
                <SignModal type={this.state.signModal} onChangeModal={this.handleChangeModal} ref={this.signModalRef} />
            </div>
        )
    }
}

const mapState = (state: any) => ({
    isAuth: state[authKey].data ? state[authKey].data.code === 0 ? false : true : false
})

export default connect(mapState)(App)