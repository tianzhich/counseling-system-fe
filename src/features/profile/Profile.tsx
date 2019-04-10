import React from 'react';
import { connect } from 'react-redux';
import { IStore } from '@common/storeConfig';
import { Redirect, RouteComponentProps } from 'react-router';

import './Profile.less'
import { Dispatch } from 'redux';
import { fetchAction } from '@common/api/action';
import { push } from 'connected-react-router';
import CounselorTab, { CounselorProfileTab } from "./component/Counselor";
import UserTab, { UserProfileTab } from "./component/User";
import { avatarURL } from '@features/common/fakeData';
import { Icon, Button } from 'antd';
import { getDate } from "@utils/moment";

export type ProfileTab = CounselorProfileTab | UserProfileTab

export interface IUserInfo {
    id: number
    cID: number
    userName: string
    phone: string
    email: string
    createTime: string
}

interface IProfileProps extends RouteComponentProps<{ activeTab: ProfileTab }> {
    isAuth: boolean
    authType: number
    dispatch: Dispatch
    userInfo: IUserInfo
}

interface IProfileState { }

class Profile extends React.Component<IProfileProps, IProfileState> {
    constructor(props: IProfileProps) {
        super(props);
    }

    toggleAvtiveTab = (activeTab: ProfileTab) => {
        this.props.dispatch(push(`./${activeTab}`))
    }

    gotoDetail = (id: number) => {
        this.props.dispatch(push(`./counseling/${id}`))
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
            return activeTab === 'counseling' || activeTab === 'article' || activeTab === 'ask' || activeTab === 'setting'
        } else {
            return activeTab === 'comment' || activeTab === 'counseling' || activeTab === 'ask' || activeTab === 'setting'
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

        const uInfo = this.props.userInfo

        return (
            <div className="pcs-profile">
                <div className="header">
                    <div className="avatar">
                        <img src={avatarURL} alt="" />
                    </div>
                    <div className="info">
                        <div className="item name"><Icon type="user" />{uInfo.userName}</div>
                        <div className="item email"><Icon type="mail" />{uInfo.email}</div>
                        <div className="item time"><Icon type="edit" />{getDate(uInfo.createTime)}</div>
                    </div>
                    <div className="action">
                        <Button type='default' >编辑个人资料</Button>
                    </div>
                </div>
                <div className="content">
                    <div className="main">
                        {
                            isCounselor ? (
                                <CounselorTab
                                    toggleAvtiveTab={(tab) => this.toggleAvtiveTab(tab)}
                                    activeTab={activeTab as CounselorProfileTab}
                                    gotoDetail={this.gotoDetail}
                                />
                            ) : (
                                <UserTab 
                                    toggleAvtiveTab={(tab) => this.toggleAvtiveTab(tab)}
                                    activeTab={activeTab as UserProfileTab}
                                    gotoDetail={this.gotoDetail}
                                />
                            )
                        }
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

    // data
    userInfo: state['info/pre'].response && state['info/pre'].response.data ? state['info/pre'].response.data : undefined,
})

export default connect(mapState)(Profile)