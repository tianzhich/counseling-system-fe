import React from 'react';
import { Layout, message } from 'antd';
import SignModal, { SignModalType } from './SignModal';
import { ApiKey, OtherAPI, NetworkErrorMsg } from '@common/api/config';
import { Dispatch } from 'redux';
import Emitter from '@utils/events';
import { EventEmitter } from 'events';
import AppointMntModal from './AppointMntModal';
import AppHeader from './AppHeader';

import './App.less'

const { Content, Footer } = Layout;

interface IAppProps {
    isAuth: boolean
    dispatch: Dispatch
}

interface IAppState {
    signModal: SignModalType
}

class App extends React.Component<IAppProps, IAppState> {
    signModalRef: React.RefObject<any>
    appointMntModalRef: React.RefObject<any>
    openModalToken: EventEmitter

    constructor(props: IAppProps) {
        super(props);
        this.signModalRef = React.createRef()
        this.appointMntModalRef = React.createRef()
        this.state = {
            signModal: 'signin'
        }
    }

    openModal = (type: SignModalType, ref?: string) => {
        this.setState({
            signModal: type
        }, this.signModalRef.current.openModal(ref))
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

    handleLoginWithRef = (payload?: any) => {
        if (payload) {
            this.openModal('signin', payload.ref)
        } else {
            this.openModal('signin')
        }

    }

    // 预约咨询师弹窗
    handleAppoint = (payload: any) => {
        this.appointMntModalRef.current.openModal(payload.counselor)
    }

    componentDidMount() {
        this.openModalToken = Emitter.addListener('openSigninModal', this.handleLoginWithRef)
        this.openModalToken = Emitter.addListener('openAppointMntModal', this.handleAppoint)

        // global info api


    }

    componentWillUnmount() {
        this.openModalToken.removeAllListeners()
    }

    render() {
        return (
            <div className="pcs-app">
                <Layout>
                    <AppHeader onUserSignout={this.handleUserSignout} onOpenSignModal={this.openModal} />
                    <Content>
                        <div className="pcs-content">{this.props.children}</div>
                    </Content>
                    <Footer>
                        Zhi Psychological Counseling System ©2018 Created by Tian Zhi
                    </Footer>
                </Layout>
                <SignModal type={this.state.signModal} onChangeModal={this.handleChangeModal} ref={this.signModalRef} />
                <AppointMntModal ref={this.appointMntModalRef} />
            </div>
        )
    }
}

export default App