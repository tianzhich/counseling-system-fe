import React from 'react';
import { connect } from 'react-redux';
import { IStore } from '@common/storeConfig';
import { Redirect, RouteComponentProps } from 'react-router';

import './Profile.less'
import { Dispatch } from 'redux';
import { fetchAction } from '@common/api/action';
import { push } from 'connected-react-router';
import CounselingTab, { ICounselingRecord } from './component/Counselor/CounselingTab';
import CounselorTab, { CounselorProfileTab } from "./component/Counselor";
import UserTab, { UserProfileTab } from "./component/User";

export type ProfileTab = CounselorProfileTab | UserProfileTab

interface IProfileProps extends RouteComponentProps<{ activeTab: ProfileTab }> {
    isAuth: boolean
    authType: number
    dispatch: Dispatch
}

interface IProfileState { }

class Profile extends React.Component<IProfileProps, IProfileState> {
    constructor(props: IProfileProps) {
        super(props);
    }

    toggleAvtiveTab = (activeTab: ProfileTab) => {
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

    // 判断路由合法性
    isRouterCorrect(activeTab: ProfileTab) {
        const isCounselor = this.props.authType === 1
        if (isCounselor) {
            return activeTab === 'counseling' || activeTab === 'message' || activeTab === 'article' || activeTab === 'ask'
        } else {
            return activeTab === 'xxx' || activeTab === 'counseling'
        }
    }

    render() {
        // auth
        const isCounselor = this.props.authType === 1
        const activeTab = this.props.match.params.activeTab
        if (!this.props.isAuth) {
            return <Redirect to='/' />
        }
        if (!this.isRouterCorrect(activeTab)) {
            return <Redirect to='/profile/counseling' />
        }

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
                        {
                            isCounselor ?
                                <CounselorTab 
                                    toggleAvtiveTab={(tab) => this.toggleAvtiveTab(tab)}
                                    activeTab={activeTab as CounselorProfileTab}
                                /> :
                                <UserTab />}
                    </div>
                    <div className="right"></div>
                </div>
            </div>
        )
    }
}

const mapState = (state: IStore) => ({
    // auth
    isAuth: state['@global'].auth.isAuth,
    authType: state['@global'].auth.authType,
})

export default connect(mapState)(Profile)