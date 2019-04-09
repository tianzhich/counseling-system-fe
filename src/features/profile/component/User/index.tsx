import React from 'react';
import { Tabs } from 'antd';
import CounselingTab from './CounselingTab';
import { IStore } from '@common/storeConfig';
import { connect } from 'react-redux';
import { ICounselingRecord } from '../Counselor/CounselingTab';
import { Dispatch } from 'redux';
import { push } from 'connected-react-router';

const TabPane = Tabs.TabPane

export type UserProfileTab = 'counseling' | 'ask' | 'comment'

interface IindexProps {
    dispatch: Dispatch
    activeTab: UserProfileTab
    counselingRecords: ICounselingRecord[]
    toggleAvtiveTab: (t: UserProfileTab) => void
    gotoDetail: (id: number) => void
}

interface IindexState {}

class index extends React.Component<IindexProps, IindexState> {
    constructor(props: IindexProps) {
        super(props);
        this.state = {};
    }

    gotoExpertHomepage = (id: number) => {
        this.props.dispatch(push(`/expert/${id}`))
    }

    render() {
        const { activeTab } = this.props
        const counselingRecords = this.props.counselingRecords.map(r => ({ ...r, method: JSON.parse(r.method).id }))
        return (
            <Tabs defaultActiveKey={activeTab} activeKey={activeTab} onChange={this.props.toggleAvtiveTab} className="tab-user">
                <TabPane tab={`咨询`} key="counseling">
                    <CounselingTab data={counselingRecords} gotoExpert={this.gotoExpertHomepage} gotoDetail={this.props.gotoDetail} />
                </TabPane>
                <TabPane tab={`问答`} key="ask">Content of Tab Pane 2</TabPane>
                <TabPane tab={`评论`} key="comment">Content of Tab Pane 2</TabPane>
            </Tabs>
        )
    }
}

const mapState = (state: IStore) => ({
    // data
    counselingRecords: state['query/counselingRecords'].response && state['query/counselingRecords'].response.data ? state['query/counselingRecords'].response.data : [],
})

export default connect(mapState)(index)