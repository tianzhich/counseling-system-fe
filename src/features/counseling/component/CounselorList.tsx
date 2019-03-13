import React from 'react';
import { Card, Avatar, Button, Input, Icon, Pagination } from "antd";
import { Counselor } from '@types';

import './CounselorList.less';
import { avatarURL } from '@features/common/fakeData';
import { PaginationProps } from 'antd/lib/pagination';

const { Meta } = Card;
const Search = Input.Search;

function CounselorListItem(props: Counselor) {
    const Title = (titleProps: Partial<Counselor>) =>
        <React.Fragment>
            <span className="name">{titleProps.name}</span>
            <span className="description">{titleProps.description}</span>
            <Button className="button-reservation" type="primary">预约</Button>
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
                avatar={<Avatar src={props.avatar ? props.avatar : avatarURL} shape="square" />}
                title={<Title {...props} />}
                description={<Description {...props} />}
            />
        </Card>
    )
}

interface ICounselorListProps {
    counselors: Counselor[]
    pagination: PaginationProps
    onSearchCounselor: (likeStr: string) => void
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
                            <CounselorListItem key={c.uid} {...c} />
                        )
                    }
                    <div className="pagination-wrapper">
                        <Pagination {...this.props.pagination}/>
                    </div>
                </div>
            </div>
        )
    }
}