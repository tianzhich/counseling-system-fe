import React from 'react';
import { Card, Avatar, Button, Input, Icon, Pagination, Tooltip } from "antd";
import { Counselor } from '@types';

import './CounselorList.less';
import { avatarURL } from '@features/common/fakeData';
import { PaginationProps } from 'antd/lib/pagination';
import Emitter from '@utils/events';

const { Meta } = Card;
const Search = Input.Search;

interface ICounselorListItemProps extends Counselor {
    onClick: () => void
    onAppoint: () => void
}

function CounselorListItem(props: ICounselorListItemProps) {
    const Title = (titleProps: Partial<Counselor>) =>
        <React.Fragment>
            <span className="name" onClick={(e) => props.onClick()}>{titleProps.name}</span>
            <span className="description">
                {
                    titleProps.description.length > 20 ? (
                        <Tooltip title={titleProps.description} >{titleProps.description.substr(0, 20)}...</Tooltip>
                    ) : titleProps.description
                }
            </span>
            <Button className="button-reservation" type="primary" onClick={props.onAppoint}>预约</Button>
        </React.Fragment>;

    const Description = (descProps: Partial<Counselor>) =>
        <React.Fragment>
            <div className="motto">{descProps.motto}</div>
            <div className="footer">
                <span className="workYears">
                    <Icon type="idcard" />&nbsp;
                    从业年限 <span className="number-color">{descProps.workYears}</span>
                </span>
                {
                    descProps.goodRate ? <span className="goodRate">
                        <Icon type="like" />&nbsp;
                        好评率 <span className="number-color">{descProps.goodRate}%</span>
                    </span> : null
                }
                <span className="price">
                    <Icon type="dollar" />&nbsp;
                    价格 <span className="number-color">{descProps.audioPrice}</span>/次
                </span>
            </div>
        </React.Fragment>;

    return (
        <Card>
            <Meta
                avatar={
                    <div onClick={(e) => props.onClick()}>
                        <Avatar src={props.avatar ? props.avatar : avatarURL} shape="square" />
                    </div>
                }
                title={<Title {...props} />}
                description={<Description {...props} />}
            />
        </Card>
    )
}

interface ICounselorListProps {
    isAuth: boolean
    counselors: Counselor[]
    pagination: PaginationProps
    onSearchCounselor: (likeStr: string) => void
    onToExpertPage: (id: number) => void
}

interface ICounselorListState {
    queryName: string // 查询条件
}

export default class CounselorList extends React.Component<ICounselorListProps, ICounselorListState> {
    constructor(props: ICounselorListProps) {
        super(props);
        this.state = {
            queryName: ''
        };
    }

    handleAppoint = (counselor: Counselor) => {
        if (!this.props.isAuth) {
            Emitter.emit('openSigninModal')
        } else {
            Emitter.emit('openAppointMntModal', { counselor })
        }
    }

    render() {
        return (
            <div className="counselor-list-wrapper">
                <div className="query-bar">
                    <span>今日推荐</span>
                    <Search placeholder="搜索专家名字" enterButton onSearch={this.props.onSearchCounselor} />
                </div>
                <div className="counselor-list">
                    {
                        this.props.counselors.map(c =>
                            <CounselorListItem key={c.uid} {...c}
                                onClick={() => this.props.onToExpertPage(c.id)}
                                onAppoint={() => this.handleAppoint(c)}
                            />
                        )
                    }
                    <div className="pagination-wrapper">
                        <Pagination {...this.props.pagination} />
                    </div>
                </div>
            </div>
        )
    }
}