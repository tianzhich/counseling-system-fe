import React from 'react'
import { connect } from 'react-redux'
import { IStore } from '@common/storeConfig'
import { Redirect, RouteComponentProps } from 'react-router'

import './Profile.less'
import { Dispatch } from 'redux'
import { fetchAction } from '@common/api/action'
import { push } from 'connected-react-router'
import CounselorTab, { CounselorProfileTab } from './component/Counselor'
import UserTab, { UserProfileTab } from './component/User'
import { Icon, Button } from 'antd'
import { getDate } from '@utils/moment'
import Loading from '@features/common/component/Loading'
import AskItem from '@features/ask/component/AskItem'

export type ProfileTab = CounselorProfileTab | UserProfileTab

export type MyAskList = {
  postAskList: AskItem[]
  cmtAskList: AskItem[]
}

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
  askList: MyAskList
}

interface IProfileState {}

class Profile extends React.Component<IProfileProps, IProfileState> {
  settingTabRef: React.RefObject<any>
  constructor(props: IProfileProps) {
    super(props)
    this.settingTabRef = React.createRef()
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
        break

      case 'article':
        this.props.dispatch(fetchAction('info/myArticleList'))
        break

      case 'ask':
        this.props.dispatch(fetchAction('info/myAskList'))
        break

      default:
        break
    }
  }

  componentDidMount() {
    this.fetchTabData()

    const activeTab = this.props.match.params.activeTab
    if (activeTab === 'setting') {
      this.scrollToSetting()
    }
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
      return (
        activeTab === 'counseling' ||
        activeTab === 'article' ||
        activeTab === 'ask' ||
        activeTab === 'setting'
      )
    } else {
      return (
        activeTab === 'comment' ||
        activeTab === 'counseling' ||
        activeTab === 'ask' ||
        activeTab === 'setting'
      )
    }
  }

  gotoSetting = () => {
    this.props.dispatch(push('./setting'))
  }

  scrollToSetting = () => {
    const pos = this.settingTabRef.current
    if (pos) {
      window.scrollTo(0, pos.offsetTop - 70)
    }
  }

  reloadSetting = () => {
    const isCounselor = this.props.authType === 1
    if (isCounselor) {
      this.props.dispatch(fetchAction('info/preCounselor'))
    }
    this.props.dispatch(fetchAction('info/pre'))
  }

  render() {
    // auth
    const isCounselor = this.props.authType === 1
    const activeTab = this.props.match.params.activeTab
    if (!this.props.isAuth) {
      return <Redirect to="/" />
    }
    if (!this.isRouterCorrect(activeTab)) {
      return <Redirect to="/profile/counseling" />
    }

    const uInfo = this.props.userInfo
    if (!uInfo) {
      return <Loading />
    }

    const { askList } = this.props

    return (
      <div className="pcs-profile">
        <div className="header">
          <div className="avatar">
            <img src={require('@images/fakeAvatar.png')} alt="" />
          </div>
          <div className="info">
            <div className="item name">
              <Icon type="user" />
              {uInfo.userName}
            </div>
            <div className="item email">
              <Icon type="mail" />
              {uInfo.email}
            </div>
            <div className="item time">
              <Icon type="edit" />
              {getDate(uInfo.createTime)}
            </div>
          </div>
          <div className="action">
            <Button type="default" onClick={this.gotoSetting}>
              编辑个人资料
            </Button>
          </div>
        </div>
        <div className="content" ref={this.settingTabRef}>
          <div className="main">
            {isCounselor ? (
              <CounselorTab
                toggleAvtiveTab={tab => this.toggleAvtiveTab(tab)}
                activeTab={activeTab as CounselorProfileTab}
                gotoDetail={this.gotoDetail}
                onReloadSetting={this.reloadSetting}
                askList={askList}
              />
            ) : (
              <UserTab
                toggleAvtiveTab={tab => this.toggleAvtiveTab(tab)}
                activeTab={activeTab as UserProfileTab}
                gotoDetail={this.gotoDetail}
                onReloadSetting={this.reloadSetting}
                askList={askList}
              />
            )}
          </div>
          <div className="right" />
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
  userInfo:
    state['info/pre'].response && state['info/pre'].response.data
      ? state['info/pre'].response.data
      : undefined,
  askList:
    state['info/myAskList'].response && state['info/myAskList'].response.data
      ? state['info/myAskList'].response.data
      : undefined
})

export default connect(mapState)(Profile)
