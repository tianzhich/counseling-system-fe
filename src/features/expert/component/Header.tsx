import React from 'react';
import "./Header.less"
import { Counselor } from '@features/common/types';
import { avatarURL } from '@features/common/fakeData';
import { Button } from 'antd';

interface IHeaderProps extends Counselor {
    onLeaveMessage: () => void
}

export default class Header extends React.Component<IHeaderProps, {}> {
    render() {
        const { avatar = avatarURL, name, description, city, onLeaveMessage } = this.props
        return (
            <div className="expert-header">
                <div className="bg-banner" />
                <div className="info">
                    <img className="avatar" src={avatar} alt="" />
                    <div className="detail">
                        <div className="detail-top">
                            <div className="name">{name}</div>
                            <div className="desc">{description}</div>
                        </div>
                        <div className="detail-bottom">
                            <div className="serve">
                                <span className="title">在智心理服务过</span><br /><span className="bold">{683}</span>人
                            </div>
                            <div className="letter">
                                <span className="title">收到感谢信</span><br /><span className="bold">{451}</span>封
                            </div>
                            <div className="location">
                                <span className="title">所在地</span><br /><span className="bold">{city ? `${city.name}市` : "中国"}</span>
                            </div>
                        </div>
                        <div className="action">
                            <Button shape="round" icon="plus" >关注</Button>
                            <Button shape="round" icon="mail" onClick={onLeaveMessage} >私信</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}