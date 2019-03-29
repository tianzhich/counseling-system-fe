import React from 'react';
import { connect } from 'react-redux';
import { IStore } from '@common/storeConfig';
import { Redirect, RouteComponentProps } from 'react-router';

import './Profile.less'
import { Tabs } from 'antd';
import { Dispatch } from 'redux';
import { fetchAction } from '@common/api/action';
import { INotification } from '@features/common/component/Notification';
import { push } from 'connected-react-router';

const TabPane = Tabs.TabPane

type TabKey = 'counseling' | 'ask' | 'article' | 'notification' | 'message'

interface ITabInfo {
    'counseling'?: {}[]
    'notification'?: INotification[]
    'article'?: {}[]
    'ask'?: {}[]
    'message'?: {}[]
}

const initTabInfo: ITabInfo = {
    'notification': []
}

interface IProfileProps extends RouteComponentProps<{ activeTab: TabKey }> {
    isAuth: boolean
    tabInfo: ITabInfo
    dispatch: Dispatch
}

interface IProfileState { }

class Profile extends React.Component<IProfileProps, IProfileState> {
    constructor(props: IProfileProps) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(fetchAction('query/profileAll'))
    }

    componentDidUpdate() {
        
    }

    toggleAvtiveTab = (activeTab: TabKey) => {
        this.props.dispatch(push(`./${activeTab}`))
    }

    render() {
        if (!this.props.isAuth) {
            return <Redirect to='/' />
        }

        const { notification } = this.props.tabInfo
        const notifCount = notification ? notification.length : undefined

        const activeTab = this.props.match.params.activeTab
        console.log(activeTab)

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
                        <Tabs activeKey={activeTab} onChange={this.toggleAvtiveTab}>
                            <TabPane tab={`咨询`} key="counseling">Content of Tab Pane 1</TabPane>
                            <TabPane tab={`文章`} key="article">Content of Tab Pane 2</TabPane>
                            <TabPane tab={`问答`} key="ask"></TabPane>
                            <TabPane tab={`通知 ${notifCount}`} key="notification"></TabPane>
                            <TabPane tab={`消息`} key="message"></TabPane>
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
    tabInfo: state['query/profileAll'].response && state['query/profileAll'].response.data ? state['query/profileAll'].response.data : initTabInfo
})

export default connect(mapState)(Profile)