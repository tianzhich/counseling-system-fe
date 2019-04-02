import React from 'react';
import { Modal, Input, message } from 'antd';
import { IApiState, IApiStore } from '@common/api/reducer';
import { connect } from 'react-redux';
import { NetworkErrorMsg, ServerErrorMsg } from '@common/api/config';
import { Dispatch } from 'redux';
import { fetchAction } from '@common/api/action';

import "./MessageModal.less"

interface IMessageModalOwnProps { }

interface IMessageModalConnProps {
    addRes: IApiState
    dispatch: Dispatch
}

type Props = IMessageModalConnProps & IMessageModalOwnProps

interface IMessageModalState {
    receiverName?: string
    receiverId?: number
    msg?: string
    visible: boolean
}

class MessageModal extends React.Component<Props, IMessageModalState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    openModal = (receiverId: number, receiverName: string) => {
        this.setState({
            visible: true,
            receiverId,
            receiverName
        })
    }

    closeModal = () => {
        this.setState({
            visible: false
        })
    }

    handleInput = (msg: string) => {
        this.setState({
            msg
        })
    }

    handleSaveMessage = () => {
        if (!this.state.receiverId || !this.state.receiverName) {
            return
        }

        const msg = this.state.msg
        if (msg === undefined || msg === '') {
            message.warning('请补充私信')
            return
        }

        const data = {
            receiver: this.state.receiverId,
            detail: this.state.msg
        }
        this.props.dispatch(fetchAction('operation/addMessage', { data }))
    }

    componentDidUpdate(prevProps: Props) {
        // 留言结果回调
        if (prevProps.addRes.status === 'loading') {
            const addRes = this.props.addRes
            if (addRes.status === 'success') {
                if (addRes.response && addRes.response.code === 1) {
                    message.success('私信成功！')
                    this.closeModal()
                } else {
                    message.error(addRes.response.message)
                }
            } else if (addRes.status === 'failed') {
                message.error(NetworkErrorMsg)
            }
        }
    }

    render() {
        return (
            <Modal
                className="message-modal"
                title="私信"
                onOk={this.handleSaveMessage}
                visible={this.state.visible}
                onCancel={this.closeModal}
                destroyOnClose
            >
                <div className="title">给 <span>{this.state.receiverName}</span> 一条私信：</div>
                <Input.TextArea onChange={(e) => this.handleInput(e.target.value)} />
            </Modal>
        )
    }
}

const mapState = (state: IApiStore) => ({
    addRes: state['operation/addMessage']
})

export default connect(mapState, null, null, { forwardRef: true })(MessageModal as React.ComponentClass<IMessageModalOwnProps>)