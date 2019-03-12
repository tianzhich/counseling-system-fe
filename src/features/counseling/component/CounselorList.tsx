import React from 'react';
import { Card, Avatar, Button, Input, Icon, Pagination } from "antd";
import { Expert, Counselor } from '@types';

import './CounselorList.less';

const { Meta } = Card;
const Search = Input.Search;

function ExpertListItem(props: Counselor) {
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
                avatar={<Avatar src={props.avatar} shape="square" />}
                title={<Title {...props} />}
                description={<Description {...props} />}
            />
        </Card>
    )
}

interface IExpertListProps {
    counselors: Counselor[]
}

interface IExpertListState {
    queryName: string // 查询条件
}

export default class ExpertList extends React.Component<IExpertListProps, IExpertListState> {
    constructor(props: IExpertListProps) {
        super(props);
        this.state = {
            queryName: ''
        };
    }

    componentDidMount() {
        // Todo: get all counselorlist
    }

    render() {
        return (
            <div className="expert-list-wrapper">
                <div className="query-bar">
                    <span>今日推荐</span>
                    <Search placeholder="搜索专家名字" enterButton />
                </div>
                <div className="expert-list">
                    {
                        this.props.counselors.map(c =>
                            <ExpertListItem key={c.id} {...c} />
                        )
                    }
                    <div className="pagination-wrapper">
                        <Pagination total={120} />
                    </div>
                </div>
            </div>
        )
    }
}