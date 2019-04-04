import React from 'react';
import { Modal, DatePicker, Input, message } from 'antd';

interface IContactModalProps {
    visible: boolean
    closeModal: (isPass: boolean) => void
    onPass: (time: string, location?: string) => void
    onReject: (reason: string) => void
    isPass: boolean
    isFtf: boolean
}

interface IContactModalState {
    time?: string
    location?: string
    cancelReason?: string
}

export default class ContactModal extends React.Component<IContactModalProps, IContactModalState> {

    onSubmit = () => {
        const isPass = this.props.isPass
        const isFtf = this.props.isFtf
        const time = this.state.time
        const location = this.state.location
        const cancelReason = this.state.cancelReason
        if (isPass) {
            if (!time) {
                message.error("请选择时间")
                return 
            }

            if (isFtf && (!location || location.trim() === '')) {
                message.error("请填写地点")
                return 
            }
            this.props.onPass(time, location)
        } else {
            if (!cancelReason || cancelReason.trim() === '') {
                message.error("请填写拒绝理由")
                return 
            }
            this.props.onReject(cancelReason)
        }
    }

    render() {
        const visible = this.props.visible
        const isPass = this.props.isPass
        const isFtf = this.props.isFtf
        return (
            <Modal
                className="contact-modal"
                title={isPass ? "协商确认" : "拒绝预约"}
                visible={visible}
                onCancel={() => this.props.closeModal(isPass)}
                onOk={this.onSubmit}
            >
                {
                    isPass ? (
                        <React.Fragment>
                            <DatePicker showTime placeholder="请选择咨询时间" />
                            { isFtf ? <Input placeholder="请输入咨询地点" /> : null } 
                        </React.Fragment>
                    ) : (
                        <Input.TextArea placeholder="请填写拒绝理由(必填)"  />
                    )
                }
            </Modal>
        )
    }
}