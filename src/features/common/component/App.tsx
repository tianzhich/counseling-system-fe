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
import { fetchAction } from '@common/api/action';
import MessageModal from './MessageModal';
import { connect } from 'react-redux';
import { IStore } from '@common/storeConfig';
import { INotification, IMessage } from './Notification';
import { push } from 'connected-react-router';

const { Content, Footer } = Layout;

interface IAppProps {
    isAuth: boolean
    authType: number
    notifications: INotification[]
    messages: IMessage[]
    onload: boolean
    dispatch: Dispatch
}

interface IAppState {
    signModal: SignModalType
}

class App extends React.Component<IAppProps, IAppState> {
    signModalRef: React.RefObject<any>
    appointMntModalRef: React.RefObject<any>
    messageModalRef: React.RefObject<any>
    openModalToken: EventEmitter

    constructor(props: IAppProps) {
        super(props);
        this.signModalRef = React.createRef()
        this.appointMntModalRef = React.createRef()
        this.messageModalRef = React.createRef()
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

    handleLeaveMessage = (payload: any) => {
        this.messageModalRef.current.openModal(payload.receiverId, payload.receiverName, payload.srcMsg, payload.callback)
    }

    initRequest = () => {
        // 消息通知
        this.loadNotifications()

        // 个人信息
        const isCounselor = this.props.authType === 1
        if (isCounselor) {
            this.props.dispatch(fetchAction('info/preCounselor'))
        }
        this.props.dispatch(fetchAction('info/pre'))
    }

    loadNotifications = () => {
        this.props.dispatch(fetchAction('query/notifications'))
        this.props.dispatch(fetchAction('query/messages'))
    }

    handleRedirect = (url: string) => {
        this.props.dispatch(push(url))
    }

    handleSearch = (keyword: string) => {
        if (keyword.trim() === '') {
            return
        }
        this.props.dispatch(push('/search', { keyword }))
    }

    componentDidMount() {
        this.openModalToken = Emitter.addListener('openSigninModal', this.handleLoginWithRef)
        this.openModalToken = Emitter.addListener('openAppointMntModal', this.handleAppoint)
        this.openModalToken = Emitter.addListener('openMessageModal', this.handleLeaveMessage)

        // refresh data (一些需要路由更改就刷新的数据)
        if (this.props.isAuth) {
            this.loadNotifications()
        }
    }

    componentWillUnmount() {
        this.openModalToken.removeAllListeners()
    }

    componentDidUpdate(prevProps: IAppProps) {
        // init request
        if (!prevProps.isAuth && this.props.isAuth) {
            this.initRequest()
        }
    }

    render() {
        const { isAuth, notifications, messages, onload } = this.props
        return (
            <div className="pcs-app">
                <Layout>
                    <AppHeader
                        isAuth={isAuth}
                        notifications={notifications}
                        messages={messages}
                        dataOnload={onload}
                        onUserSignout={this.handleUserSignout}
                        onOpenSignModal={this.openModal}
                        reloadNotifications={this.loadNotifications}
                        onRedirect={this.handleRedirect}
                        onSearch={this.handleSearch}
                    />
                    <Content>
                        <div className="pcs-content">{this.props.children}</div>
                    </Content>
                    <Footer>
                        Zhi Psychological Counseling System ©2018 Created by Tian Zhi
                    </Footer>
                </Layout>
                <SignModal type={this.state.signModal} onChangeModal={this.handleChangeModal} ref={this.signModalRef} />
                <AppointMntModal ref={this.appointMntModalRef} />
                <MessageModal ref={this.messageModalRef} />
            </div>
        )
    }
}

const mapState = (state: IStore) => ({
    // 权限
    isAuth: state['@global'].auth.isAuth,
    authType: state['@global'].auth.authType,

    // 数据
    notifications: state['query/notifications'].response && state['query/notifications'].response.data ? state['query/notifications'].response.data : [],
    messages: state['query/messages'].response && state['query/messages'].response.data ? state['query/messages'].response.data : [],
    onload: state['query/messages'].status === 'loading' || state['query/notifications'].status === 'loading'
})

export default connect(mapState)(App)