import React from 'react';
import { Modal, message } from "antd";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";

import './SignModal.less';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { fetchAction } from '@common/api/action';
import { ApiKey } from '@common/api/config';

export type SignModalType = 'signin' | 'signup'

const signinKey: ApiKey = 'oauth/signin'
const signupKey: ApiKey = 'oauth/signup'

interface ISignRes {
    code: number
    message: string
}

interface ISignModalProps {
    type: SignModalType
    onChangeModal: (type: SignModalType) => void
    dispatch: Dispatch
    signinRes: ISignRes
}

interface ISignModalState {
    showModal: boolean
}

class SignModal extends React.Component<ISignModalProps, ISignModalState> {
    constructor(props: ISignModalProps) {
        super(props);
        this.state = {
            showModal: false
        };
    }

    openModal = () => {
        this.setState({
            showModal: true
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
        if (prevProps.signinRes === undefined && this.props.signinRes.code === 1) {
            this.props.dispatch(fetchAction('oauth/auth'))
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
                    this.props.type === "signin" ? <SigninForm dispatch={this.props.dispatch} /> : <SignupForm />
                }
            </Modal>
        )
    }
}

const mapState = (state: any) => ({
    signinRes: state[signinKey].data
})

export default connect(mapState, null, null, { forwardRef: true })(SignModal)