import React from 'react';
import { connect } from 'react-redux';
import { IStore } from '@common/storeConfig';
import { Redirect, RouteComponentProps } from 'react-router';

import './Profile.less'
import { Tabs } from 'antd';
import { Dispatch } from 'redux';
import { fetchAction } from '@common/api/action';
import { push } from 'connected-react-router';
import CounselingTab, { ICounselingRecord } from './ProfileTab/CounselingTab';

const TabPane = Tabs.TabPane

export type ProfileTabKey = 'counseling' | 'ask' | 'article' | 'message'

interface IProfileProps extends RouteComponentProps<{ activeTab: ProfileTabKey }> {
    isAuth: boolean
    counselingRecords: ICounselingRecord[]
    dispatch: Dispatch
}

interface IProfileState { }

class Profile extends React.Component<IProfileProps, IProfileState> {
    constructor(props: IProfileProps) {
        super(props);
    }

    toggleAvtiveTab = (activeTab: ProfileTabKey) => {
        this.props.dispatch(push(`./${activeTab}`))
    }

    fetchTabData = () => {
        const activeTab = this.props.match.params.activeTab
        switch (activeTab) {
            case 'counseling':
                this.props.dispatch(fetchAction('query/counselingRecords'))
                break;
        
            default:
                break;
        }
    }

    componentDidMount() {
        this.fetchTabData()
    }

    componentDidUpdate(prevProps: IProfileProps) {
        // location更新后数据重新fetch
        if (prevProps.match.params.activeTab !== this.props.match.params.activeTab) {
            this.fetchTabData()
        }
    }

    render() {
        if (!this.props.isAuth) {
            return <Redirect to='/' />
        }

        const activeTab = this.props.match.params.activeTab
        const counselingRecords = this.props.counselingRecords.map(r => ({ ...r, method: JSON.parse(r.method).id }))

        return (
            <div className="pcs-profile">
                <div className="header">
                    <div className="avatar">
                        <img src="" alt="" />
                    </div>
                    <div className="info">
                        <div className="name"></div>
                    </div>
                    <div className="action"></div>
                </div>
                <div className="content">
                    <div className="main">
                        <Tabs defaultActiveKey={activeTab} activeKey={activeTab} onChange={this.toggleAvtiveTab}>
                            <TabPane tab={`咨询`} key="counseling">
                                <CounselingTab data={counselingRecords} />
                            </TabPane>
                            <TabPane tab={`文章`} key="article">Content of Tab Pane 2</TabPane>
                            <TabPane tab={`问答`} key="ask"></TabPane>
                            <TabPane tab={`留言`} key="message"></TabPane>
                        </Tabs>
                    </div>
                    <div className="right"></div>
                </div>
            </div>
        )
    }
}

const mapState = (state: IStore) => ({
    isAuth: state['@global'].auth.isAuth,
    counselingRecords: state['query/counselingRecords'].response && state['query/counselingRecords'].response.data ? state['query/counselingRecords'].response.data : []
})

export default connect(mapState)(Profile)