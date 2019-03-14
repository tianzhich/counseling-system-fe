import React from 'react';
import { Card, Avatar, message, Spin } from "antd";
import { Counselor } from "@types";
import './NewlyCounselors.less';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { IApiStore, IPageInfo } from '@common/api/reducer';
import { fetchAction } from '@common/api/action';
import { ApiKey, NetworkStatus } from '@common/api/config';
import { avatarURL } from '@features/common/fakeData';
import { push } from 'connected-react-router';

const { Meta } = Card;

const newlClsActionKey: ApiKey = 'query/newlyCounselors'

interface INewlyCounselorsProps {
    // store mapping
    dispatch: Dispatch
    counselors: Counselor[]
    pageInfo: IPageInfo
    loadingStatus: NetworkStatus
}

const initialPageInfo: IPageInfo = {
    currentPageNum: 0,
    totalNum: 0,
    pageSize: 4,
    totalPageNum: 0
}

interface InfoProps extends Partial<Counselor> {
    onClick: () => void
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

function Title(props: InfoProps) {
    const name = props.name;
    const rate = props.goodRate;

    return (
        <React.Fragment>
            <span className="name" onClick={props.onClick} >{name}</span>
            <span className="rate">{rate ? <span>好评率 <span className="number-color">{`${rate}%`}</span></span> : null}</span>
        </React.Fragment>
    )
}

class Newlycounselors extends React.Component<INewlyCounselorsProps, {}> {
    componentDidMount() {
        this.props.dispatch(fetchAction('query/newlyCounselors', { params: { pageSize: 4, pageNum: 1 } }))
    }
    loadMore = () => {
        const pageSize = this.props.pageInfo.pageSize
        const pageNum = this.props.pageInfo.currentPageNum
        const totalPageNum = this.props.pageInfo.totalPageNum
        if (pageNum < totalPageNum) {
            this.props.dispatch(fetchAction('query/newlyCounselors'))
        } else {
            this.props.dispatch(fetchAction('query/newlyCounselors', { params: { pageSize, pageNum: 1 } }))
        }
    }
    toExpertHomepage = (id: number) => {
        this.props.dispatch(push(`/expert/${id}`))
    }

    render() {
        const counselors = this.props.counselors
        return (
            <div className="newly-counselors">
                <div className="newly-counselors-header">
                    新加入的专家 {this.props.loadingStatus === 'loading' ? <Spin /> : null}
                </div>
                <div className="newly-counselors-content">
                    {
                        counselors.map(c =>
                            <Card key={c.id}>
                                <Meta
                                    avatar={
                                        <div onClick={(e) => this.toExpertHomepage(c.id)}>
                                            <Avatar src={c.avatar ? c.avatar : avatarURL} />
                                        </div>
                                    }
                                    title={<Title name={c.name} goodRate={c.goodRate} onClick={() => this.toExpertHomepage(c.id)} />}
                                    description={<Description description={c.description} workYears={c.workYears} />}
                                />
                            </Card>
                        )
                    }
                </div>
                <div className="newly-counselors-footer" onClick={this.loadMore}>换一批 ></div>
            </div>
        )
    }
}

const mapState = (state: IApiStore) => ({
    counselors: state[newlClsActionKey].response ? state[newlClsActionKey].response.data.list : [],
    loadingStatus: state[newlClsActionKey].status,
    pageInfo: state[newlClsActionKey].pageInfo ? state[newlClsActionKey].pageInfo : initialPageInfo,
})

export default connect(mapState)(Newlycounselors)