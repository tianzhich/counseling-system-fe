import React from 'react'
import { Modal, DatePicker, Input, message, notification, Icon, Select, Rate, Divider } from 'antd'
import { ICounselingRecord } from './Counselor/CounselingTab'

import './ActionModal.less'
import { IApiState } from '@common/api/reducer'
import moment from '@utils/moment'

const Option = Select.Option

const cancelReason1Map = {
  '1': '咨询师长时间未答复',
  '2': '下单错误，不想再咨询',
  '3': '选错咨询师',
  '4': '问题已解决，无需进行咨询',
  '5': '其他'
}

interface IActionModalProps {
  visible: boolean
  isCounselor: boolean
  record: ICounselingRecord
  operation: 0 | 1
  processRes: IApiState

  onReload: () => void
  closeModal: () => void
  onProcess: (op: 0 | 1, data?: any) => void
}

interface IActionModalState {
  // 填写拒绝理由
  cancelReason1?: string
  cancelReason2?: string
  cancelReason1Option?: keyof typeof cancelReason1Map

  // 确认时间和地点
  location: string
  startTime: string

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
        {
          const cancelReason1 = this.state.cancelReason1
          const option = this.state.cancelReason1Option
          if (!option || (option === '5' && (!cancelReason1 || cancelReason1.trim() === ''))) {
            message.error('取消理由不能为空')
            return
          }
          data = {
            cancelReason1: option === '5' ? cancelReason1 : cancelReason1Map[option]
          }
          op = 0
        }
        break

      case '预约协商':
      case '确认预约':
        {
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
            startTime,
            location
          }
          op = 1
        }
        break

      case '拒绝预约':
        {
          const cancelReason2 = this.state.cancelReason2
          if (!cancelReason2 || cancelReason2.trim() === '') {
            message.error('拒绝理由不能为空')
            return
          }
          data = {
            cancelReason2
          }
          op = 0
        }
        break

      case '评价咨询':
        {
          const ratingScore = this.state.ratingScore
          const ratingText = this.state.ratingText
          const letter = this.state.letter
          if (ratingScore === undefined) {
            message.error('咨询评分不能为空')
            return
          }
          data = {
            ratingScore,
            ratingText: ratingText ? ratingText : '',
            letter: letter ? letter : ''
          }
          op = 1
        }
        break

      case '感谢信':
        {
          const letter = this.state.letter
          if (!letter || letter.trim() === '') {
            message.error('感谢信不能为空')
            return
          }
          data = {
            letter
          }
          op = 1
        }
        break

      default:
        return
    }

    this.props.onProcess(op, data)
  }

  handleChangeArgs = <K extends Args>(key: K, val: IActionModalState[K]) => {
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
        return isCounselor ? (op === 0 ? '拒绝预约' : '预约协商') : op === 0 ? '取消订单' : ''

      case 'wait_confirm':
        return !isCounselor ? (op === 0 ? '取消订单' : '确认预约') : ''

      case 'wait_counseling':
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
    const option = this.state.cancelReason1Option
    const defaultLocation = this.state.location
    const defaultStartTime = this.state.startTime

    switch (title) {
      case '取消订单':
        return (
          <React.Fragment>
            <div>注意：确认咨询后取消订单无法退款，确认前取消可直接退款</div>
            <Divider />
            <Select
              placeholder="请选择理由"
              value={option}
              onChange={val => this.handleChangeArgs('cancelReason1Option', val)}
            >
              {Object.keys(cancelReason1Map).map(v => (
                <Option value={v} key={v}>
                  {cancelReason1Map[v]}
                </Option>
              ))}
            </Select>
            {option === '5' ? (
              <Input.TextArea
                placeholder="请输入理由"
                onChange={e => this.handleChangeArgs('cancelReason1', e.target.value)}
              />
            ) : null}
          </React.Fragment>
        )

      case '预约协商':
      case '确认预约':
        return (
          <React.Fragment>
            <DatePicker
              showTime
              placeholder="请选择咨询时间"
              onChange={(date, dateStr) => this.handleChangeArgs('startTime', dateStr)}
              defaultValue={defaultStartTime ? moment(defaultStartTime) : undefined}
            />
            {isFtf ? (
              <Input
                placeholder="请输入咨询地点"
                defaultValue={defaultLocation}
                onChange={e => this.handleChangeArgs('location', e.target.value)}
              />
            ) : null}
          </React.Fragment>
        )

      case '拒绝预约':
        return (
          <Input.TextArea
            placeholder="请填写拒绝理由(必填)"
            onChange={e => this.handleChangeArgs('cancelReason2', e.target.value)}
          />
        )

      case '评价咨询':
        return (
          <React.Fragment>
            <div className="rating">
              评分：
              <Rate allowHalf onChange={val => this.handleChangeArgs('ratingScore', val)} />
            </div>
            <Input.TextArea
              className="rating-text"
              placeholder="写下您对本次咨询的评价(可选)"
              onChange={e => this.handleChangeArgs('ratingText', e.target.value)}
            />
            <Input.TextArea
              placeholder="给咨询师写一封感谢信(可选)"
              onChange={e => this.handleChangeArgs('letter', e.target.value)}
            />
          </React.Fragment>
        )

      case '感谢信':
        return (
          <Input.TextArea
            placeholder="给咨询师写一封感谢信(可选)"
            onChange={e => this.handleChangeArgs('letter', e.target.value)}
          />
        )

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
        break

      case '感谢信':
        message = '留言成功'
        description = '咨询师将会收到您的感谢信，祝您生活美好，欢迎下次来访'
        break

      case '拒绝预约':
        message = '取消成功'
        description = '您已成功拒绝本次预约'
        break

      case '确认预约':
        message = '确认成功'
        description = '确认成功，请等待咨询师与您联系，进行后续的咨询'
        break

      case '评价咨询':
        message = '评价成功'
        description = '感谢您的评价，欢迎下次来访'
        break

      case '预约协商':
        message = '操作成功'
        description = '协商成功，请等待咨询者的确认'
        break

      default:
        message = ''
        description = ''
        break
    }

    return { ...props, message, description }
  }

  componentDidUpdate(prevProps: IActionModalProps) {
    // 处理回调
    const prevRes = prevProps.processRes
    const curRes = this.props.processRes
    const status = prevProps.record.status
    const isCancelCounseling = this.props.operation === 0
    if (
      prevRes.status === 'loading' &&
      (status !== 'wait_counseling' || (status === 'wait_counseling' && isCancelCounseling))
    ) {
      if (curRes.status === 'success' && curRes.response && curRes.response.code === 1) {
        const argsProps = this.renderProcessCallbackProps()
        notification.open(argsProps)
        this.props.closeModal()
        this.props.onReload()
      } else if (curRes.response && curRes.response.code !== 1) {
        notification.error({
          message: '操作失败',
          description: curRes.response.message,
          duration: null
        })
      } else {
        notification.error({
          message: '操作失败',
          description: '网络错误，请尝试稍后重试',
          duration: null
        })
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
