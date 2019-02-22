import React from 'react';
import { Layout, Modal, Button, Badge, Avatar, message, Icon } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import Navigator from './Navigator';
import SignModal, { SignModalType } from './SignModal';

import './App.less'
import { connect } from 'react-redux';
import { ApiKey } from '@common/api/config';

const { Header, Content, Footer } = Layout;

interface IAppProps extends RouteComponentProps {
    isAuth: boolean
}

interface IAppState {
    signModal: SignModalType
}

const authKey: ApiKey = 'oauth/auth'

class App extends React.Component<IAppProps, IAppState> {
    signModalRef: React.RefObject<any>

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

    render() {
        const UserViewer = (
            <div className="user-viewer">
                <Badge count={1}><Icon type="message" style={{ fontSize: "25px" }} /></Badge>
                <Badge dot><Icon type="bell" style={{ fontSize: "25px" }} /></Badge>
                <Badge count={1}><Avatar shape="square" icon="user" /></Badge>
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