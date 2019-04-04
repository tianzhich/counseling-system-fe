import React from 'react';
import { Modal, DatePicker } from 'antd';

interface IContactModalProps {
    visible: boolean
    closeModal: () => void
    onPass: (time: string, location?: string) => void
    isPass: boolean
}

interface IContactModalState {
    time: string
    location: string
}

export default class ContactModal extends React.Component<IContactModalProps, IContactModalState> {

    onPass = () => {
        const time = this.state.time
        const location = this.state.location
        this.props.onPass(time, location)
    }

    render() {
        const visible = this.props.visible
        return (
            <Modal
                title="协商确认"
                visible={visible}
                onCancel={this.props.closeModal}
                onOk={this.onPass}
            >
                <DatePicker showTime />
            </Modal>
        )
    }
}