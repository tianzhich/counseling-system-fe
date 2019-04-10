import React from 'react';
import { Modal, DatePicker, Input, message, notification, Icon } from 'antd';
import { ICounselingRecord } from './Counselor/CounselingTab';

import "./ActionModal.less"
import { IApiState } from '@common/api/reducer';
import { ArgsProps } from 'antd/lib/notification';

interface IActionModalProps {
    visible: boolean
    isCounselor: boolean
    record: ICounselingRecord
    operation: 0 | 1
    processRes: IApiState

    onReload: () => void
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
            case '取消订单': {

            } break;

            case '预约协商': case '确认预约': {
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

            case '拒绝预约': {

            } break;

            case '确认预约': {

            } break;

            case '评价咨询': {

            } break;

            default:
                return
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
                return (
                    null
                )

            case '预约协商': case '确认预约':
                return (
                    <React.Fragment>
                        <DatePicker showTime placeholder="请选择咨询时间" onChange={(date, dateStr) => this.handleChangeArgs('startTime', dateStr)} />
                        {isFtf ? <Input placeholder="请输入咨询地点" onChange={(e) => this.handleChangeArgs('location', e.target.value)} /> : null}
                    </React.Fragment>
                )

            case '拒绝预约':
                return <Input.TextArea placeholder="请填写拒绝理由(必填)" onChange={(e) => this.handleChangeArgs('cancelReason2', e.target.value)} />

            case '确认预约':
                return null

            case '评价咨询':
                return null

            default:
                return null
        }
    }

    renderProcessCallbackProps = () => {
        const title = this.renderTitle()
        const props: any = {
            icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
            duration: null
        }
        let message: string
        let description: string
        switch (title) {
            case '取消订单':
                message = '取消成功'
                description = '您已成功取消本次预约'
                break;

            case '感谢信':
                message = '留言成功'
                description = '咨询师将会收到您的感谢信，祝您生活美好，欢迎下次来访'
                break;

            case '拒绝预约': 
                message = '取消成功'
                description = '您已成功拒绝本次预约'
                break;

            case '确认预约': 
                message = '确认成功'
                description = '确认成功，请等待咨询师与您联系，进行后续的咨询'
                break;

            case '评价咨询': 
                message = '评价成功'
                description = '感谢您的评价，欢迎下次来访'
                break;

            case '预约协商': 
                message = '操作成功'
                description = '协商成功，请等待咨询者的确认'
                break;

            default:
                message = ''
                description = ''
                break;
        }

        return {...props, message, description}
    }

    componentDidUpdate(prevProps: IActionModalProps) {
        // 处理回调
        const prevRes = prevProps.processRes
        const curRes = this.props.processRes
        if (prevRes.status === 'loading') {
            if (curRes.status === 'success' && curRes.response && curRes.response.code === 1) {
                const argsProps = this.renderProcessCallbackProps()
                notification.open(argsProps);
                this.props.closeModal()
                this.props.onReload()
            } else if (curRes.response && curRes.response.code !== 1) {
                notification.error({
                    message: '操作失败',
                    description: curRes.response.message,
                    duration: null
                });
            } else {
                notification.error({
                    message: '操作失败',
                    description: '网络错误，请尝试稍后重试',
                    duration: null
                });
            }
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