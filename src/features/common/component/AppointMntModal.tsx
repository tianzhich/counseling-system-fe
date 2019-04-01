import React from 'react';
import { Modal, Divider, Avatar, Button, Radio, InputNumber, Icon, Input, Checkbox, Row, Col, message, notification } from 'antd';
import { avatarURL } from '../fakeData';
import { Counselor } from '../types';

import "./AppointMntModal.less";
import { IApiState, IApiStore } from '@common/api/reducer';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { fetchAction } from '@common/api/action';
import { IApiResponse } from '@common/api/config';
import { IStore } from '@common/storeConfig';

const Header = (props: { counselor?: Counselor }) => {
    const name = props.counselor ? props.counselor.name : ''
    return (
        <div className="title">
            <h3>你当前正在预约</h3>
            <div className="expert">
                <Avatar shape="square" size={80} src={avatarURL} />
                <div className="name">{name}</div>
                <Button icon="mail">私信</Button>
            </div>
        </div>
    )
}

type CounselingMethod = {
    id: 'audio' | 'video' | 'ftf'
    name: string
    price: number
}

interface PriceProps {
    counselor: Counselor
    total: number
    times: number
    onSetTimes: (t: number) => void
    method?: CounselingMethod
    onSetMethod: (m: CounselingMethod) => void
}

const PricePanel = (props: PriceProps) => {
    const methods: CounselingMethod[] = [{
        id: 'audio',
        name: '语音',
        price: props.counselor ? props.counselor.audioPrice : 0
    }, {
        id: 'video',
        name: '视频',
        price: props.counselor ? props.counselor.videoPrice : 0
    }, {
        id: 'ftf',
        name: '面对面',
        price: props.counselor ? props.counselor.ftfPrice : 0
    }]
    const method = props.method ? props.method.id : ''
    return (
        <div className="price-panel">
            <h3>咨询方式 <span>每次50分钟</span></h3>
            <Radio.Group value={method} buttonStyle="solid" onChange={e => props.onSetMethod(methods.find(m => m.id === e.target.value))} >
                {
                    methods.map(m =>
                        <Radio.Button key={m.id} value={m.id} disabled={m.price === 0}>{`${m.name} ￥${m.price}/次`}</Radio.Button>
                    )
                }
            </Radio.Group>
            <div className="times">咨询次数：<InputNumber className="right" value={props.times} onChange={props.onSetTimes} min={0} /></div>
            <div className="discount">优惠券：<span className="right">暂无可用<Icon type="right" /></span></div>
            <div className="total">总计<span className="right">￥{props.total}</span></div>
        </div>
    )
}

interface CardTitleProps {
    text: string
    extra?: string
}

const CardTitle = (prosp: CardTitleProps) => <div className="card-title"><span style={{ color: "red" }}>*</span>{prosp.text}<a className="extra">{prosp.extra}</a></div>

interface Infos {
    name?: string // 姓名
    age?: number // 年龄
    gender?: number // 性别，0表示女，1表示男
    phone?: string // 手机号
    contactName?: string // 紧急联系人姓名
    contactRel?: string // 紧急联系人关系
    contactPhone?: string // 紧急联系人电话
    desc?: string // 咨询描述
}

interface InfosProps {
    infos: Infos
    canInputLen: number
    onChangeInfos: <T extends keyof Infos>(key: T, val: Infos[T]) => void
}

const Infos = (props: InfosProps) => {
    const onChangeInfos = props.onChangeInfos
    return (
        <div className="infos">
            <div className="infos-basic">
                <CardTitle text="基本资料" extra="为什么要填写真实信息?" />
                <Input placeholder="请填写真实姓名" onChange={(e) => onChangeInfos('name', e.target.value)} />
                <InputNumber placeholder="年龄" onChange={(val) => onChangeInfos('age', val)} min={1} max={100} />
                <div>
                    <span>性别：</span>
                    <Radio.Group onChange={(e) => onChangeInfos('gender', e.target.value)}>
                        <Radio value={1}>男</Radio>
                        <Radio value={0}>女</Radio>
                    </Radio.Group>
                </div>
                <Input addonBefore="+86" placeholder="输入手机号" onChange={(e) => onChangeInfos('phone', e.target.value)} />
            </div>
            <div className="infos-contact">
                <CardTitle text="紧急联系人" extra="为什么要填写紧急联系人?" />
                <Input placeholder="真实姓名" onChange={(e) => onChangeInfos('contactName', e.target.value)} />
                <Input placeholder="关系(如父亲/妻子)" onChange={(e) => onChangeInfos('contactRel', e.target.value)} />
                <Input placeholder="联系电话" onChange={(e) => onChangeInfos('contactPhone', e.target.value)} />
            </div>
            <div className="infos-desc">
                <CardTitle text="问题类型及描述" />
                <Input.TextArea placeholder="请简要描述你需要咨询的内容，以及期待达到的咨询目标" onChange={(e) => onChangeInfos('desc', e.target.value)} />
                <div className="counters">{props.canInputLen}/300</div>
            </div>
        </div>
    )
}

interface AgreementProps {
    isAgree: boolean
    onToggleAgree: () => void
}

const Agreement = (props: AgreementProps) => (
    <Checkbox checked={props.isAgree} onChange={props.onToggleAgree} >同意<a>《心理咨询预约协议》</a>与<a>《知情同意书》</a></Checkbox>
)

interface IAppointMntModalConnProps {
    dispatch: Dispatch
    appointRes: IApiState
}

interface IAppointMntModalOwnProps {}

type Props = IAppointMntModalOwnProps & IAppointMntModalConnProps

interface IAppointMntModalState {
    visible: boolean
    method?: CounselingMethod // 咨询方式
    times: number // 咨询次数
    infos: Infos // 咨询信息
    canInputLen: number // 问题描述字数限制, 剩余可输入字数
    isAgree: boolean
    counselor?: Counselor // 打开Modal时payload传进来
}

class AppointMntModal extends React.Component<Props, IAppointMntModalState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            visible: false,
            times: 0,
            infos: {},
            canInputLen: 300,
            isAgree: false
        };
    }

    openModal = (counselor: Counselor) => {
        this.setState({
            visible: true,
            counselor
        })
    }

    closeModal = () => {
        this.setState({
            visible: false
        })
    }

    // 咨询次数
    handleSetTimes = (times: number) => {
        this.setState({
            times
        })
    }

    handleSetMethod = (method: CounselingMethod) => {
        this.setState({
            method
        })
    }

    handleChangeInfos: InfosProps['onChangeInfos'] = (key, val) => {
        this.setState({
            infos: {
                ...this.state.infos,
                [key]: val
            }
        })
        if (key === 'desc') {
            const canInputLen = 300 - (val as string).length > -1 ? 300 - (val as string).length : -1
            this.setState({
                canInputLen
            })
        }
    }

    handlePayment = () => {
        const infos = this.state.infos
        const method = this.state.method
        const times = this.state.times
        const isAgree = this.state.isAgree

        if (!this.state.counselor) {
            return
        }

        // check method, times
        if (!method || times === 0) {
            message.warning('请至少选择一种咨询方式和一次咨询！')
            return
        }

        // check infos
        const keys = Object.keys(infos)
        const notpass = keys.some(k => infos[k] === undefined || infos[k] === '' ? true : false)
        if (keys.length !== 8 || notpass) {
            message.warning('请完善相关信息！')
            return
        }

        // check agreements
        if (!isAgree) {
            message.warning('请阅读并同意相关条款！');
            return
        }

        // data 
        const data = {
            cID: this.state.counselor.id,
            method: JSON.stringify(method),
            times,
            ...infos,
        }

        // handle payment
        message.loading('支付中，请稍后', 2.5).then(() => {
            // post record
            this.props.dispatch(fetchAction('operation/appoint', { data }))
            this.closeModal()
        }, () => {
            message.error('支付失败，请稍后重试', 1)
        })
    }

    componentDidUpdate(prevProps: Props, prevState: IAppointMntModalState) {
        // appoint callback
        if (prevProps.appointRes.status === 'loading') {
            const resp = this.props.appointRes.response
            if (this.props.appointRes.status === 'success' && resp && resp.code === 1) {
                notification.open({
                    message: '预约成功！',
                    description: '您已成功预约咨询师，咨询师将在两小时内与您确认，请留意站内短信。',
                    icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
                    duration: null
                });
            } else if (this.props.appointRes.status === 'failed') {
                notification.error({
                    message: '预约失败！',
                    description: '网络错误，请尝试稍后重新预约。',
                    duration: null
                });
            }
        }
    }

    render() {
        const priceTotal = this.state.method ? (this.state.method.price * this.state.times) : 0
        const times = this.state.times
        const infos = this.state.infos
        const canInputLen = this.state.canInputLen
        const isAgree = this.state.isAgree
        const counselor = this.state.counselor
        const method = this.state.method

        const Footer = (
            <div className="footer">
                <div className="left">
                    <span className="total">{priceTotal === 0 ? '' : `￥${priceTotal}`}</span>
                    <span className="method">{method && times && times !== 0 ? `${method.name}X${times}` : ''}</span>
                </div>
                <Button type="primary" onClick={this.handlePayment} >去支付</Button>
            </div>
        )
        return (
            <Modal
                className="appointmnt-modal"
                visible={this.state.visible}
                onCancel={this.closeModal}
                footer={Footer}
            >
                <Header counselor={counselor} />
                <PricePanel counselor={counselor} method={method} total={priceTotal} times={times} onSetTimes={this.handleSetTimes} onSetMethod={this.handleSetMethod} />
                <Infos infos={infos} canInputLen={canInputLen} onChangeInfos={this.handleChangeInfos} />
                <Agreement isAgree={isAgree} onToggleAgree={() => this.setState({ isAgree: !this.state.isAgree })} />
            </Modal>
        )
    }
}

const mapState = (state: IStore) => ({
    appointRes: state['operation/appoint']
})

export default connect(mapState, null, null, { forwardRef: true })(AppointMntModal as React.ComponentClass<IAppointMntModalOwnProps>)