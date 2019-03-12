import React from 'react';
import { Card, Avatar } from "antd";
import { Counselor } from "@types";
import './NewlyCounselors.less';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { IApiStore } from '@common/api/reducer';
import { fetchAction } from '@common/api/action';
import { ApiKey } from '@common/api/config';

const { Meta } = Card;

const newlClsActionKey: ApiKey = 'query/newlyCounselors'

interface INewlyCounselorsProps {
    // store mapping
    dispatch: Dispatch
    counselors: Counselor[]
}

function Description(props: Partial<Counselor>) {
    const description = props.description;
    const workYears = props.workYears;

    return (
        <React.Fragment>
            <div className="description">{description}</div>
            <div className='work-years'>从业年限 <span className="number-color">{workYears}</span></div>
        </React.Fragment>
    );
}

function Title(props: Partial<Counselor>) {
    const name = props.name;
    const rate = props.goodRate;

    return (
        <React.Fragment>
            <span className="name">{name}</span>
            <span className="rate">{rate ? <span>好评率 <span className="number-color">{`${rate}%`}</span></span> : null}</span>
        </React.Fragment>
    )
}

class Newlycounselors extends React.Component<INewlyCounselorsProps, {}> {
    componentDidMount() {
        this.props.dispatch(fetchAction('query/newlyCounselors'))
    }
    render() {
        return (
            <div className="newly-counselors">
                <div className="newly-counselors-header">新加入的专家</div>
                <div className="newly-counselors-content">
                    {
                        this.props.counselors.map(c=>
                            <Card key={c.id}>
                                <Meta
                                    avatar={<Avatar src={c.avatar} />}
                                    title={<Title name={c.name} goodRate={c.goodRate}/>}
                                    description={<Description description={c.description} workYears={c.workYears} />}
                                />
                            </Card>
                        )
                    }
                </div>
                <div className="newly-counselors-footer">换一批 ></div>
            </div>
        )
    }
}

const mapState = (state: IApiStore) => ({
    counselors: state[newlClsActionKey].response ? state[newlClsActionKey].response.data.list : []
})

export default connect(mapState)(Newlycounselors)