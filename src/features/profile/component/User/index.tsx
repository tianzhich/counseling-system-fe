import React from 'react'
import { Tabs, message } from 'antd'
import CounselingTab from './CounselingTab'
import { IStore } from '@common/storeConfig'
import { connect } from 'react-redux'
import { ICounselingRecord } from '../Counselor/CounselingTab'
import { Dispatch } from 'redux'
import { push } from 'connected-react-router'
import SettingTab from '../SettingTab'
import { IUserInfo, MyAskList } from '@features/profile/Profile'
import { OtherAPI, IApiResponse } from '@common/api/config'
import ArticleTab from './ArticleTab'
import { ArticleProps } from '@features/common/types';
import AskTab from '../AskTab';

const TabPane = Tabs.TabPane

export type UserProfileTab = 'counseling' | 'ask' | 'comment' | 'setting'

interface IindexProps {
  dispatch: Dispatch
  activeTab: UserProfileTab
  counselingRecords: ICounselingRecord[]
  userInfo: IUserInfo
  toggleAvtiveTab: (t: UserProfileTab) => void
  gotoDetail: (id: number) => void
  onReloadSetting: () => void
  articleCmtList: ArticleProps[]
  askList: MyAskList
}

interface IindexState {}

class index extends React.Component<IindexProps, IindexState> {
  constructor(props: IindexProps) {
    super(props)
    this.state = {}
  }

  gotoExpertHomepage = (id: number) => {
    this.props.dispatch(push(`/expert/${id}`))
  }

  updateSetting = (data: any) => {
    OtherAPI.UpdateUserInfo(data).then(res => {
      const data: IApiResponse = res.data
      if (data.code !== 1) {
        message.error(data.message)
      } else {
        message.success('更新成功')
        this.props.onReloadSetting()
      }
    })
  }

  render() {
    const { activeTab, userInfo, onReloadSetting, articleCmtList, askList } = this.props
    const counselingRecords = this.props.counselingRecords.map(r => ({
      ...r,
      method: JSON.parse(r.method).id
    }))
    const { cmtAskList, postAskList } = askList ? askList : { cmtAskList: [], postAskList: []}
    return (
      <Tabs
        defaultActiveKey={activeTab}
        activeKey={activeTab}
        onChange={this.props.toggleAvtiveTab}
        className="tab-user"
      >
        <TabPane tab={`咨询`} key="counseling">
          <CounselingTab
            data={counselingRecords}
            gotoExpert={this.gotoExpertHomepage}
            gotoDetail={this.props.gotoDetail}
          />
        </TabPane>
        <TabPane tab={`文章`} key="comment">
          <ArticleTab cmtList={articleCmtList} />
        </TabPane>
        <TabPane tab={`问答`} key="ask">
          <AskTab cmtList={cmtAskList} postList={postAskList} />
        </TabPane>
        <TabPane tab="设置" key="setting">
          <SettingTab
            userInfo={userInfo}
            onReloadSetting={onReloadSetting}
            updateUserInfo={this.updateSetting}
          />
        </TabPane>
      </Tabs>
    )
  }
}

const mapState = (state: IStore) => ({
  // data
  counselingRecords:
    state['query/counselingRecords'].response && state['query/counselingRecords'].response.data
      ? state['query/counselingRecords'].response.data
      : [],
  userInfo:
    state['info/pre'].response && state['info/pre'].response.data
      ? state['info/pre'].response.data
      : undefined,
  articleCmtList:
    state['info/myArticleList'].response && state['info/myArticleList'].response.data
      ? state['info/myArticleList'].response.data.cmtList
      : undefined,
})

export default connect(mapState)(index)
