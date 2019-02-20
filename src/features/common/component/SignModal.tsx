import React from 'react';
import { Modal } from "antd";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";

import './SignModal.less';

export type SignModalType = 'signin' | 'signup'

interface ISignModalProps {
    type: SignModalType
    onChangeModal: (type: SignModalType) => void
}

interface ISignModalState {
    showModal: boolean
}

export default class SignModal extends React.Component<ISignModalProps, ISignModalState> {
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
                        <span>没有账号? <span style={{color: "#1890ff", cursor: "pointer"}} onClick={() => this.props.onChangeModal('signup')}>注册</span></span> :
                        <span>已有账号? <span style={{color: "#1890ff", cursor: "pointer"}} onClick={() => this.props.onChangeModal('signin')}>登录</span></span>
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
                    this.props.type === "signin" ? <SigninForm /> : <SignupForm />
                }
            </Modal>
        )
    }
}