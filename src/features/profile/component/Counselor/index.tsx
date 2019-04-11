import React from 'react';
import { Tabs, message } from 'antd';
import CounselingTab, { ICounselingRecord } from './CounselingTab';
import { IStore } from '@common/storeConfig';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { fetchAction } from '@common/api/action';
import SettingTab from '../SettingTab';
import { IUserInfo } from '@features/profile/Profile';
import { Counselor } from '@features/common/types';
import { OtherAPI, IApiResponse } from '@common/api/config';
import { AxiosPromise } from 'axios';

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

    onReloadSetting: () => void
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

    updateSetting = (data: any, type: 1 | 2) => {
        let prom: AxiosPromise<any>
        if (type === 1) {
            prom = OtherAPI.UpdateCounselorInfo(data)
        } else if (type === 2) {
            prom = OtherAPI.UpdateUserInfo(data)
        } else {
            return
        }
        prom.then(res => {
            const data: IApiResponse = res.data
            if (data.code !== 1) {
                message.error(data.message)
            } else {
                message.success("更新成功")
                this.props.onReloadSetting()
            }
        })
    }

    render() {
        const { activeTab, userInfo, counselorInfo, onReloadSetting } = this.props
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
                        userInfo={userInfo}
                        counselorInfo={counselorInfo}
                        onReloadSetting={onReloadSetting}
                        updateUserInfo={(data) => this.updateSetting(data, 2)}
                        updateCounselorInfo={(data) => this.updateSetting(data, 1)}
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