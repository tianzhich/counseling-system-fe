import React from 'react';
import { Tabs } from 'antd';
import CounselingTab, { ICounselingRecord } from './CounselingTab';
import { IStore } from '@common/storeConfig';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { fetchAction } from '@common/api/action';
import SettingTab from '../SettingTab';
import { IUserInfo } from '@features/profile/Profile';
import { Counselor } from '@features/common/types';

const TabPane = Tabs.TabPane

export type CounselorProfileTab = 'counseling' | 'ask' | 'article' | 'setting'

interface IindexProps {
    activeTab: CounselorProfileTab
    toggleAvtiveTab: (t: CounselorProfileTab) => void
    counselingRecords: ICounselingRecord[]
    dispatch: Dispatch
    gotoDetail: (id: number) => void
    userInfo: IUserInfo
    counselorInfo: Counselor
}

interface IindexState { }

class index extends React.Component<IindexProps, IindexState> {
    constructor(props: IindexProps) {
        super(props);
        this.state = {};
    }

    handleContactSubmit = (recordID: number, operation: number, data?: any) => {
        this.props.dispatch(fetchAction('operation/appointProcess', { appendPath: `/${recordID}/${operation}`, data }))
    }

    render() {
        const { activeTab, userInfo, counselorInfo } = this.props
        const counselingRecords = this.props.counselingRecords.map(r => ({ ...r, method: JSON.parse(r.method).id }))
        return (
            <Tabs defaultActiveKey={activeTab} activeKey={activeTab} onChange={this.props.toggleAvtiveTab} className="tab-counselor">
                <TabPane tab={`咨询`} key="counseling">
                    <CounselingTab data={counselingRecords} onContactSubmit={this.handleContactSubmit} gotoDetail={this.props.gotoDetail} />
                </TabPane>
                <TabPane tab={`文章`} key="article">Content of Tab Pane 2</TabPane>
                <TabPane tab={`问答`} key="ask"></TabPane>
                <TabPane tab="设置" key="setting">
                    <SettingTab
                        isCounselor
                        userInfo={userInfo}
                        counselorInfo={counselorInfo}
                    />
                </TabPane>
            </Tabs>
        )
    }
}

const mapState = (state: IStore) => ({
    // data
    counselingRecords: state['query/counselingRecords'].response && state['query/counselingRecords'].response.data ? state['query/counselingRecords'].response.data : [],
    userInfo: state['info/pre'].response && state['info/pre'].response.data ? state['info/pre'].response.data : undefined,
    counselorInfo: state['info/preCounselor'].response && state['info/preCounselor'].response.data ? state['info/preCounselor'].response.data : undefined
})

export default connect(mapState)(index)