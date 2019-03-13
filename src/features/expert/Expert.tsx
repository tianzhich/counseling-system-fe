import React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';
import Header from './component/Header';

import "./Expert.less"
import { connect } from 'react-redux';
import { IApiStore } from '@common/api/reducer';
import { Counselor } from '@features/common/types';
import { ApiKey, NetworkStatus } from '@common/api/config';
import { Dispatch } from 'redux';
import { fetchAction } from '@common/api/action';
import { Spin, Alert, Empty, Affix } from 'antd';
import CounselorDetail from './component/CounselorDetail';
import FloatCard from './component/FloatCard';

const cslInfoActionKey: ApiKey = 'query/counselor'

interface IExpertProps extends RouteComponentProps<{ expertId: string }> {
    counselor: Counselor
    dispatch: Dispatch
    status: NetworkStatus
}

interface IExpertState { }

class Expert extends React.Component<IExpertProps, IExpertState> {
    constructor(props: IExpertProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const id = this.props.match.params.expertId
        this.props.dispatch(fetchAction('query/counselor', { params: { id } }))
    }

    render() {
        const { status, counselor } = this.props
        if (!status || status === 'loading') {
            return <Spin />
        } else if (status === 'failed') {
            return <Empty description="加载失败，请稍后重试" />
        } else if (status === "success" && !counselor) {
            return <Redirect to="/" />
        }
        return (
            <div className="pcs-expert">
                <Header {...counselor} />
                <CounselorDetail />
                <Affix offsetTop={100} style={{ position: 'absolute', top: "450px", right: "100px"}} >
                    <FloatCard cid={counselor.id} audioPrice={counselor.audioPrice} videoPrice={counselor.videoPrice} ftfPrice={counselor.ftfPrice} />
                </Affix>
            </div>
        )
    }
}

const mapState = (state: IApiStore) => ({
    counselor: state[cslInfoActionKey].response ? state[cslInfoActionKey].response.data : null,
    status: state[cslInfoActionKey].status
})

export default connect(mapState)(Expert)