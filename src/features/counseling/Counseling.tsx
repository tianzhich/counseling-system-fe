import React from 'react';
import Newlycounselors from './component/NewlyCounselors';
import { Button, Icon, message } from "antd";
import CounselorsPanel from './component/CounselorsPanel';
import './Counseling.less';
import Emitter from '@utils/events';
import { push } from 'connected-react-router';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { IStore } from '@common/storeConfig';
import { fetchAction } from '@common/api/action';
import { IApiState } from '@common/api/reducer';
import { Filters } from './component/FiltersPanel';

const initialFilters: Filters = {
    city: [],
    method: [],
    topic: []
}

interface ICounselingProps {
    isAuth: boolean
    isCounselor: boolean
    filters: Filters
    newlyList: IApiState
    counselorList: IApiState
    dispatch: Dispatch
}

interface ICounselingState { }

class Counseling extends React.Component<ICounselingProps, ICounselingState> {
    constructor(props: ICounselingProps) {
        super(props);
        this.state = {};
    }

    getAuth = () => {
        if (this.props.isAuth === false) {
            Emitter.emit('openSigninModal', { ref: "/apply" })
            return false
        } else {
            return true
        }
    }

    gotoExpertHomepage = (id: number) => {
        this.props.dispatch(push(`/expert/${id}`))
    }

    fetchNewlyList = (params: any) => {
        this.props.dispatch(fetchAction('query/newlyCounselors', { params }))
    }

    fetchCounselorList = (params: any, data?: any) => {
        this.props.dispatch(fetchAction('query/counselorList', { params, data }))
    }

    componentDidMount() {
        // 筛选选项
        this.props.dispatch(fetchAction('info/counselingFilters'))
        // 新加入专家列表
        this.props.dispatch(fetchAction('query/newlyCounselors', { params: { pageSize: 4, pageNum: 1 } }))
        // 推荐专家列表
        this.props.dispatch(fetchAction('query/counselorList', { params: { pageSize: 5, pageNum: 1 } }))
    }

    render() {
        const { isAuth, newlyList, counselorList, filters = initialFilters } = this.props
        const ApplyButton = () => (
            <div className="apply-button-wrapper">
                <Button
                    type="primary"
                    size="large"
                    className="apply-button"
                    onClick={() => {
                        if (this.props.isCounselor) {
                            message.warning("您已入驻咨询师！")
                            return
                        }
                        if (this.getAuth()) {
                            this.props.dispatch(push('/apply'))
                        }
                    }}
                >
                    <Icon type="edit" />咨询师入驻
                </Button>
            </div>
        )

        return (
            <div className="pcs-counseling-wrapper">
                <div className="pcs-counseling-newly-counselors">
                    <Newlycounselors
                        apiData={newlyList}
                        fetchData={this.fetchNewlyList}
                        gotoExpertHomepage={this.gotoExpertHomepage}
                    />
                    <ApplyButton />
                </div>
                <div className="pcs-counseling">
                    <CounselorsPanel
                        isAuth={isAuth}
                        apiData={counselorList}
                        filters={filters}
                        fetchData={this.fetchCounselorList}
                        gotoExpertHomepage={this.gotoExpertHomepage}
                    />
                </div>
            </div>
        )
    }
}

const mapState = (state: IStore) => ({
    // auth
    isAuth: state['@global'].auth.isAuth,
    isCounselor: state['@global'].auth.authType === 1,

    // data
    filters: state['info/counselingFilters'].response && state['info/counselingFilters'].response.data ? state['info/counselingFilters'].response.data : initialFilters,
    newlyList: state['query/newlyCounselors'],
    counselorList: state['query/counselorList'],
})

export default connect(mapState)(Counseling)