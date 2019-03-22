import React from 'react';
import { Card, Button, Icon } from 'antd';

import "./FloatCard.less"

interface IFloatCardProps {
    cid: number // counselor id
    audioPrice: number
    videoPrice: number
    ftfPrice: number
    onAppoint: () => void
}

export default class FloatCard extends React.Component<IFloatCardProps, {}> {
    render() {
        const audioPrice = this.props.audioPrice > 0 ? `¥${this.props.audioPrice}/次` : <span className="NaN">不适用</span>
        const videoPrice = this.props.videoPrice > 0 ? `¥${this.props.videoPrice}/次` : <span className="NaN">不适用</span>
        const ftfPrice = this.props.ftfPrice > 0 ? `¥${this.props.ftfPrice}/次` : <span className="NaN">不适用</span>
        return (
            <Card className="float-card">
                <div className="main">
                    <div className="method"><img src={require('@images/phone.svg')} alt="" />语音咨询<span className="price">{audioPrice}</span></div>
                    <div className="method"><img src={require('@images/web_camera.svg')} alt="" />视频咨询<span className="price">{videoPrice}</span></div>
                    <div className="method"><img src={require('@images/face.svg')} alt="" />面对面咨询<span className="price">{ftfPrice}</span></div>
                </div>
                <Button shape="round" type="primary" icon="team" onClick={this.props.onAppoint}>立即预约</Button>
                <div className="assurance">
                    <div className="item">
                        <Icon type="check-circle" theme="filled" />
                        <span className="txt">来访者隐私安全</span>
                    </div>
                    <div className="item">
                        <Icon type="check-circle" theme="filled" />
                        <span className="txt">支持取消预约并退款&nbsp;</span>
                    </div><br />
                    <div className="item">
                        <Icon type="check-circle" theme="filled" />
                        <span className="txt">咨询师资料100%真实</span>
                    </div>
                    <div className="item">
                        <Icon type="check-circle" theme="filled" />
                        <span className="txt">咨询师入驻 5 轮考核</span>
                    </div>
                </div>
            </Card>
        )
    }
}