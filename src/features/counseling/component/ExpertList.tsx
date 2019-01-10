import React from 'react';
import { Card, Avatar, Button, Input, Icon, Pagination } from "antd";
import { Expert } from '@types';

import './ExpertList.less';

const { Meta } = Card;
const Search = Input.Search;

function ExpertListItem(props: Expert) {
    const Title = (props: Partial<Expert>) =>
        <React.Fragment>
            <span className="name">{props.name}</span>
            <span className="description">{props.description}</span>
            <Button className="button-reservation" type="primary">预约</Button>
        </React.Fragment>;

    const Description = (prosp: Partial<Expert>) =>
        <React.Fragment>
            <div className="motto">{props.motto}</div>
            <div className="footer">
                <span className="workYears">
                    <Icon type="idcard" />&nbsp;
                    从业年限 <span className="number-color">{props.workYears}</span>
                </span>
                {
                    props.goodRate ? <span className="goodRate">
                        <Icon type="like" />&nbsp;
                        好评率 <span className="number-color">{props.goodRate}%</span>
                    </span> : null
                }
                <span className="price">
                    <Icon type="dollar" />&nbsp;
                    价格 <span className="number-color">{prosp.price}</span>/次
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
    experts: Expert[]
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
        // Todo: get all expert list
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
                        this.props.experts.map(expert =>
                            <ExpertListItem key={expert.id} {...expert} />
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