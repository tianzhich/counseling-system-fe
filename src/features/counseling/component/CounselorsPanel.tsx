import React from 'react'
import CounselorList from './CounselorList'

import './CounselorsPanel.less'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { fetchAction } from '@common/api/action'
import { ApiKey } from '@common/api/config'
import { IPageInfo, defaultInitPageInfo, IApiState } from '@common/api/reducer'
import { Counselor } from '@features/common/types'
import FiltersPanel, { Filters, ICondition, onConditionChange } from './FiltersPanel'
import { PaginationProps } from 'antd/lib/pagination'
import { push } from 'connected-react-router'
import { IStore } from '@common/storeConfig'

const initialPageInfo = {
  ...defaultInitPageInfo,
  pageSize: 5
}

const initialCondition: ICondition = {
  sCity: -1,
  sTopic: -1,
  isOnline: false,
  sMethod: -1
}

interface ICounselorPanelProps {
  isAuth: boolean
  apiData: IApiState
  filters: Filters
  fetchData: (params: any, data?: any) => void
  gotoExpertHomepage: (e: number) => void
}

interface ICounselorPanelState {
  // 筛选条件
  condition: ICondition
}

export default class CounselorPanel extends React.Component<
  ICounselorPanelProps,
  ICounselorPanelState
> {
  constructor(props: ICounselorPanelProps) {
    super(props)
    this.state = {
      // 初始化查询条件
      condition: initialCondition
    }
  }

  loadMoreByCondition = (p: IPageInfo) => {
    const city = this.state.condition.sCity !== -1 ? this.state.condition.sCity : undefined
    const topic = this.state.condition.sTopic !== -1 ? this.state.condition.sTopic : undefined
    const method = this.state.condition.sMethod !== -1 ? this.state.condition.sMethod : undefined
    const data = {
      city,
      topic,
      method
    }

    this.props.fetchData({ pageNum: p.currentPageNum, pageSize: p.pageSize }, data)
  }

  handleConditionChange: onConditionChange = (key, value) => {
    if (this.state.condition[key] === value) {
      return
    }

    // 在线暂时不做
    if (key === 'isOnline') {
      this.setState({
        condition: { ...this.state.condition, [key]: value }
      })
      return
    }

    const pageSize = this.props.apiData.pageInfo ? this.props.apiData.pageInfo.pageSize : 5

    this.setState(
      {
        condition: { ...this.state.condition, [key]: value }
      },
      () => this.loadMoreByCondition({ pageSize, currentPageNum: 1 })
    )
  }

  handleSearchCounselor = (like: string) => {
    const params = { like: like.trim(), pageNum: 1 }
    this.setState(
      {
        condition: initialCondition
      },
      () => this.props.fetchData(params)
    )
  }

  render() {
    const filters = this.props.filters
    const isAuth = this.props.isAuth
    const { response, pageInfo = initialPageInfo } = this.props.apiData
    const counselorList = response && response.data ? response.data.list : []
    const pagination: PaginationProps = {
      current: pageInfo.currentPageNum,
      pageSize: pageInfo.pageSize,
      total: pageInfo.totalNum,
      onChange: currentPageNum =>
        this.loadMoreByCondition({ pageSize: pageInfo.pageSize, currentPageNum })
    }
    return (
      <div className="counselors-panel">
        <FiltersPanel
          condition={this.state.condition}
          onConditionChange={this.handleConditionChange}
          filters={filters}
        />
        <CounselorList
          isAuth={isAuth}
          counselors={counselorList}
          pagination={pagination}
          onSearchCounselor={this.handleSearchCounselor}
          onToExpertPage={this.props.gotoExpertHomepage}
        />
      </div>
    )
  }
}
