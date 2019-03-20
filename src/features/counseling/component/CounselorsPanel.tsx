import React from 'react';
import { Menu, Tag, Skeleton } from "antd";
import CounselorList from './CounselorList';

import './CounselorsPanel.less';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { fetchAction } from '@common/api/action';
import { ApiKey } from '@common/api/config';
import { IApiStore, IPageInfo } from '@common/api/reducer';
import { Counselor } from '@features/common/types';
import FiltersPanel, { Filters, ICondition, onConditionChange } from './FiltersPanel';
import { PaginationProps } from 'antd/lib/pagination';
import { push } from 'connected-react-router';

const filtersKey: ApiKey = 'info/counselingFilters'
const ListActionKey: ApiKey = 'query/counselorList'

const pageSize = 5

const initialFilters: Filters = {
    city: [],
    method: [],
    topic: []
}

const initialPageInfo: IPageInfo = {
    totalPageNum: 0,
    pageSize: 5,
    totalNum: 0,
    currentPageNum: 0
}

const initialCondition: ICondition = {
    sCity: -1,
    sTopic: -1,
    isOnline: false,
    sMethod: -1
}

interface ICounselorPanelProps {
    // store map
    dispatch: Dispatch
    filters: Filters
    counselorList: Counselor[]
    pageInfo: IPageInfo

    isAuth: boolean
}

interface ICounselorPanelState {
    // 筛选条件
    condition: ICondition
}

class CounselorPanel extends React.Component<ICounselorPanelProps, ICounselorPanelState> {
    constructor(props: ICounselorPanelProps) {
        super(props);
        this.state = {
            // 初始化查询条件
            condition: initialCondition
        };
    }

    loadMoreByCondition = (p: IPageInfo) => {
        const city = this.state.condition.sCity !== -1 ? this.state.condition.sCity : undefined
        const topic = this.state.condition.sTopic !== -1 ? this.state.condition.sTopic : undefined
        const method = this.state.condition.sMethod !== -1 ? this.state.condition.sMethod : undefined
        const data = {
            city, topic, method
        }
        this.props.dispatch(fetchAction('query/counselorList', { params: { pageNum: p.currentPageNum, pageSize }, data }))
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

        this.setState({
            condition: { ...this.state.condition, [key]: value }
        }, () => this.loadMoreByCondition({ pageSize, currentPageNum: 1 }))
    }

    handleSearchCounselor = (like: string) => {
        this.setState({
            condition: initialCondition
        }, () => this.props.dispatch(fetchAction('query/counselorList', { params: { like: like.trim(), pageNum: 1 } })))   
    }

    toExpertHomepage = (id: number) => {
        this.props.dispatch(push(`/expert/${id}`))
    }

    componentDidMount() {
        // 咨询师搜索查找过滤条件
        this.props.dispatch(fetchAction('info/counselingFilters'))

        // 咨询师列表
        this.props.dispatch(fetchAction('query/counselorList', { params: { pageSize, pageNum: 1 } }))
    }

    render() {
        const filters = this.props.filters
        const counselorList = this.props.counselorList
        const pagination: PaginationProps = {
            current: this.props.pageInfo.currentPageNum,
            pageSize: this.props.pageInfo.pageSize,
            total: this.props.pageInfo.totalNum,
            onChange: (currentPageNum) => this.loadMoreByCondition({ pageSize, currentPageNum })
        }
        const isAuth = this.props.isAuth
        return (
            <div className="counselors-panel">
                <FiltersPanel
                    condition={this.state.condition}
                    onConditionChange={this.handleConditionChange}
                    filters={filters}
                />
                <CounselorList isAuth={isAuth} counselors={counselorList} pagination={pagination} onSearchCounselor={this.handleSearchCounselor} onToExpertPage={this.toExpertHomepage} />
            </div>
        )
    }
}

const mapState = (state: IApiStore) => ({
    filters: state[filtersKey].response && state[filtersKey].response.data ? state[filtersKey].response.data : initialFilters,
    counselorList: state[ListActionKey].response && state[ListActionKey].response.data ? state[ListActionKey].response.data.list : [],
    pageInfo: state[ListActionKey].pageInfo ? state[ListActionKey].pageInfo : initialPageInfo
})

export default connect(mapState)(CounselorPanel)