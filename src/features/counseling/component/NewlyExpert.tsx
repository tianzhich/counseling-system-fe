import React from 'react';
import { Card, Avatar } from "antd";

import { Expert } from "@types";

import './NewlyExpert.less';

const { Meta } = Card;

interface INewlyExpertProps { 
    experts: Expert[]
}

function Description(props: Partial<Expert>) {
    const description = props.description;
    const workYears = props.workYears;

    return (
        <React.Fragment>
            <div className="description">{description}</div>
            <div className='work-years'>从业年限 <span className="number-color">{workYears}</span></div>
        </React.Fragment>
    );
}

function Title(props: Partial<Expert>) {
    const name = props.name;
    const rate = props.goodRate;

    return (
        <React.Fragment>
            <span className="name">{name}</span>
            <span className="rate">{rate ? <span>好评率 <span className="number-color">{`${rate}%`}</span></span> : null}</span>
        </React.Fragment>
    )
}

export default class NewlyExpert extends React.Component<INewlyExpertProps, {}> {
    componentDidMount() {
        // Todo: get newly experts
    }
    render() {
        return (
            <div className="newly-expert">
                <div className="newly-expert-header">新加入的专家</div>
                <div className="newly-expert-content">
                    {
                        this.props.experts.map(expert =>
                            <Card key={expert.id}>
                                <Meta
                                    avatar={<Avatar src={expert.avatar} />}
                                    title={<Title name={expert.name} goodRate={expert.goodRate}/>}
                                    description={<Description description={expert.description} workYears={expert.workYears} />}
                                />
                            </Card>
                        )
                    }
                </div>
                <div className="newly-expert-footer">换一批 ></div>
            </div>
        )
    }
}