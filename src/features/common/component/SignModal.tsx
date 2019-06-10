import React from 'react';
import { Modal, message } from "antd";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";

import './SignModal.less';
import { connect, Omit } from 'react-redux';
import { Dispatch } from 'redux';
import { fetchAction } from '@common/api/action';
import { ApiKey, NetworkErrorMsg, IApiResult } from '@common/api/config';
import { RouteComponentProps, withRouter } from 'react-router';
import { push, replace } from 'connected-react-router';
import { IApiStore } from '@common/api/reducer';
import { IStore } from '@common/storeConfig';

export type SignModalType = 'signin' | 'signup'

// store key
const signinKey: ApiKey = 'oauth/signin'
const signupKey: ApiKey = 'oauth/signup'

interface ISignModalOwnProps {
    type: SignModalType
    onChangeModal: (type: SignModalType) => void
}

interface ISignModalProps extends ISignModalOwnProps {
    dispatch: Dispatch
    signinRes: IApiResult
    signupRes: IApiResult
}

interface ISignModalState {
    showModal: boolean

    // ref, 登陆跳转
    ref?: string
}

class SignModal extends React.Component<ISignModalProps, ISignModalState> {
    constructor(props: ISignModalProps) {
        super(props);
        this.state = {
            showModal: false
        };
    }

    openModal = (ref?: string) => {
        this.setState({
            showModal: true,
            ref
        })
    }

    closeModal = () => {
        // 关闭后默认设置为登录页
        this.setState({
            showModal: false
        }, () => this.props.onChangeModal('signin'))
    }

    componentDidUpdate(prevProps: ISignModalProps, prevState: ISignModalState) {
        // 登录结果(登录成功后进行验证)
        if (prevProps.signinRes.status === 'loading') {
            if (this.props.signinRes.status === 'success') {
                if (this.props.signinRes.response.code === 1) {
                    this.setState({
                        showModal: false
                    })
                    // reload
                    if (this.state.ref) {
                        this.props.dispatch(fetchAction('oauth/auth'))
                        setTimeout(() => {
                            this.props.dispatch(replace(this.state.ref))
                        }, 800);
                    } else {
                        window.location.reload()
                    }
                } else if (this.props.signinRes.response.code === 0) {
                    message.error(this.props.signinRes.response.message)
                }
            } else if (this.props.signinRes.status === 'failed') {
                message.error(NetworkErrorMsg)
            }
        }

        // 注册结果
        if (prevProps.signupRes.status === 'loading') {
            if (this.props.signupRes.status === 'success') {
                if (this.props.signupRes.response.code === 1) {
                    this.setState({
                        showModal: false
                    })
                    message.success(this.props.signupRes.response.message)
                    // reload
                    // setTimeout(() => {
                    //     window.location.reload()
                    // }, 1500);
                } else if (this.props.signupRes.response.code === 0) {
                    message.warning(this.props.signupRes.response.message)
                }
            } else if (this.props.signupRes.status === 'failed') {
                message.error(NetworkErrorMsg)
            }
        }
    }

    render() {
        const Title = (
            <div>
                {this.props.type === "signin" ? '登录' : '注册'}智心理，发现更美好的世界
            </div>
        )

        const footer = (
            <div>
                {
                    this.props.type === "signin" ?
                        <span>没有账号? <span style={{ color: "#1890ff", cursor: "pointer" }} onClick={() => this.props.onChangeModal('signup')}>注册</span></span> :
                        <span>已有账号? <span style={{ color: "#1890ff", cursor: "pointer" }} onClick={() => this.props.onChangeModal('signin')}>登录</span></span>
                }
            </div>
        )

        return (
            <Modal
                visible={this.state.showModal}
                className="sign-modal"
                onCancel={this.closeModal}
                title={Title}
                footer={footer}
                width={400}
                maskClosable={false}
            >
                {
                    this.props.type === "signin" ? <SigninForm dispatch={this.props.dispatch} /> : <SignupForm dispatch={this.props.dispatch} />
                }
            </Modal>
        )
    }
}

const mapState = (state: IStore) => ({
    signinRes: state[signinKey],
    signupRes: state[signupKey]
})

export default connect(mapState, null, null, { forwardRef: true })(SignModal) as React.ComponentClass<ISignModalOwnProps>;