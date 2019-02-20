import React from 'react';
import { Layout, Modal, Button } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import Navigator from './Navigator';
import SignModal, { SignModalType } from './SignModal';
import emitter from "@utils/events";

import './App.less'

const { Header, Content, Footer } = Layout;

interface IAppProps extends RouteComponentProps { }

interface IAppState {
    signModal: SignModalType
}

export default class App extends React.Component<IAppProps, IAppState> {
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

    componentDidMount() {
        emitter.addListener("login", this.signModalRef.current.openModal)
    }

    componentWillUnmount() {
        emitter.removeListener("login", this.signModalRef.current.openModal)
    }

    render() {
        return (
            <div className="pcs-app">
                <Layout>
                    <Header>
                        <Navigator />
                        <Button type="primary" ghost onClick={() => this.openModal('signin')}>登录</Button>
                        <Button type="primary" onClick={() => this.openModal('signup')}>加入智心理</Button>
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
