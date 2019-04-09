import React from 'react';
import { Modal, DatePicker, Input, message } from 'antd';
import { ICounselingRecord } from './Counselor/CounselingTab';

import "./ActionModal.less"

interface IActionModalProps {
    visible: boolean
    isCounselor: boolean
    record: ICounselingRecord
    operation: 0 | 1

    closeModal: () => void
    onProcess: (data: any, op: 0 | 1) => void
}

interface IActionModalState {
    // 填写拒绝理由
    cancelReason1?: string
    cancelReason2?: string

    // 确认时间和地点
    location?: string
    startTime?: string

    // 评价和感谢信
    ratingScore?: number
    ratingText?: string
    letter?: string
}

type ModalTitle = '拒绝预约' | '预约协商' | '取消订单' | '确认预约' | '评价咨询' | '感谢信' | ''
type Args = keyof IActionModalState

export default class ActionModal extends React.Component<IActionModalProps, IActionModalState> {
    constructor(props: IActionModalProps) {
        super(props)
        this.state = {
            location: this.props.record.location,
            startTime: this.props.record.startTime
        }
    }

    onSubmit = (title: ModalTitle) => {
        let data: any
        let op: 0 | 1

        switch (title) {
            case '取消订单':
                return null

            case '预约协商':case '确认预约': {
                const startTime = this.state.startTime
                const location = this.state.location
                const needLocation = this.props.record.method === 'ftf'
                if (!startTime) {
                    message.error('时间确认不能为空')
                    return
                }
                if (needLocation && !location) {
                    message.error('地点选择不能为空')
                    return
                }
                data = {
                    startTime, location
                }
                op = 1
            } break;

            case '拒绝预约':
                return <Input.TextArea placeholder="请填写拒绝理由(必填)" />

            case '确认预约':
                return null

            case '评价咨询':
                return null

            default:
                return null
        }

        this.props.onProcess(data, op)
    }

    handleChangeArgs = <K extends Args>(key: K, val: IActionModalState[K]) => {
        console.log(val)

        this.setState({
            ...this.state,
            [key]: val
        })
    }

    renderTitle = () => {
        const status = this.props.record.status
        const isCounselor = this.props.isCounselor
        const op = this.props.operation
        switch (status) {
            case 'wait_contact':
                return isCounselor ? op === 0 ? '拒绝预约' : '预约协商' : op === 0 ? '取消订单' : ''

            case 'wait_confirm':
                return !isCounselor ? op === 0 ? '取消订单' : '确认预约' : ''

            case 'wait_counsling':
                return !isCounselor && op === 0 ? '取消订单' : ''

            case 'wait_comment':
                return !isCounselor && op === 1 ? '评价咨询' : ''

            case 'finish':
                return !isCounselor && op === 1 ? '感谢信' : ''

            default:
                return ''
        }
    }

    renderContent = (title: ModalTitle) => {
        const isFtf = this.props.record.method === 'ftf'

        switch (title) {
            case '取消订单':
                return null

            case '预约协商':case '确认预约':
                return (
                    <React.Fragment>
                        <DatePicker showTime placeholder="请选择咨询时间" onChange={(date, dateStr) => this.handleChangeArgs('startTime', dateStr)} />
                        {isFtf ? <Input placeholder="请输入咨询地点" /> : null}
                    </React.Fragment>
                )

            case '拒绝预约':
                return <Input.TextArea placeholder="请填写拒绝理由(必填)" />

            case '确认预约':
                return null

            case '评价咨询':
                return null

            default:
                return null
        }
    }

    render() {
        const visible = this.props.visible
        const title = this.renderTitle()
        return (
            <Modal
                className="action-modal"
                title={title}
                visible={visible}
                onCancel={this.props.closeModal}
                onOk={() => this.onSubmit(title)}
            >
                {this.renderContent(title)}
            </Modal>
        )
    }
}