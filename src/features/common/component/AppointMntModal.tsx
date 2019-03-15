import React from 'react';
import { Modal, Divider, Avatar, Button, Radio, InputNumber, Icon } from 'antd';
import { avatarURL } from '../fakeData';
import { Counselor } from '../types';

const Title = (props: Counselor) => (
    <div className="title">
        <h3>你当前正在预约</h3>
        <Divider />
        <div className="expert">
            <Avatar shape="square" size={64} src={avatarURL} />
            <div className="name">{props.name}</div>
            <Button icon="mail">私信</Button>
        </div>
    </div>
)


type CounselingMethod = {
    id: 'audio' | 'video' | 'ftf'
    name: string
    price: number
}

interface PriceProps extends Counselor {
    total: number
    times: number
    onSetTimes: (t: number) => void
    method?: CounselingMethod
    onSetMethod: (m: CounselingMethod) => void
}

const PricePanel = (props: PriceProps) => {
    const methods: CounselingMethod[] = [{
        id: 'audio',
        name: '语音咨询',
        price: props.audioPrice
    }, {
        id: 'video',
        name: '视频咨询',
        price: props.videoPrice
    }, {
        id: 'ftf',
        name: '面对面咨询',
        price: props.ftfPrice
    }]
    const method = props.method ? props.method.id : 'audio'
    return (
        <div className="Price">
            <h3>咨询方式 <span>每次50分钟</span></h3>
            <Radio.Group value={method} buttonStyle="solid" onChange={e => props.onSetMethod(methods.find(m => m.id === e.target.value))} >
                {
                    methods.map(m =>
                        <Radio.Button value={m.id} disabled={m.price === 0}>{`${m.name}（${m.price}/次）`}</Radio.Button>
                    )
                }
            </Radio.Group>
            <div className="times">咨询次数<InputNumber className="right" value={props.times} onChange={props.onSetTimes} /></div>
            <div className="discount">优惠券<span className="right">暂无可用<Icon type="right" /></span></div>
            <div className="total">总计<span className="right">￥ {props.total}</span></div>
        </div>
    )
}

interface IAppointMntModalProps {
    counselor: Counselor
}

interface IAppointMntModalState {
    visible: boolean
    method?: CounselingMethod
    times: number
}

export default class AppointMntModal extends React.Component<IAppointMntModalProps, IAppointMntModalState> {
    constructor(props: IAppointMntModalProps) {
        super(props);
        this.state = {
            visible: false,
            times: 1
        };
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

    render() {
        const priceTotal = this.state.method ? (this.state.method.price * this.state.times) : 0
        const times = this.state.times
        return (
            <Modal
                className="appointmnt-modal"
            >
                <Title {...this.props.counselor} />
                <PricePanel {...this.props.counselor} total={priceTotal} times={times} onSetTimes={this.handleSetTimes} onSetMethod={this.handleSetMethod} />
            </Modal>
        )
    }
}