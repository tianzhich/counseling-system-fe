import React from 'react';
import NewlyExpert from './component/NewlyExpert';
import { Button, Icon, message } from "antd";
import CounselingPanel, { Filters } from './component/CounselingPanel';

import { newlyExperts } from '../common/fakeData';

import './Counseling.less';
import { ApiKey } from '@common/api/config';
import { connect } from 'react-redux';
import Emitter from '@utils/events';
import { Dispatch } from 'redux';
import { push } from 'connected-react-router';
import { fetchAction } from '@common/api/action';

interface ICounselingProps {
    isAuth: boolean
    isCounselor: boolean
    filters: Filters
    dispatch: Dispatch
}

interface ICounselingState {}

const initialFilters: Filters = {
    city: [],
    method: [],
    topic: []
}

const authKey: ApiKey = 'oauth/auth'
const filtersKey: ApiKey = 'info/counselingFilters'

class Counseling extends React.Component<ICounselingProps, ICounselingState> {
    constructor(props: ICounselingProps) {
        super(props);
        this.state = {};
    }

    isAuth = () => {
        if (this.props.isAuth === false) {
            Emitter.emit('openSigninModal', { ref: "/apply" })
            return false
        } else {
            return true
        }
    }

    componentDidMount() {
        this.props.dispatch(fetchAction('info/counselingFilters'))
    }

    render() {
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
                        if (this.isAuth()) {
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
                <div className="pcs-counseling-newly-expert">
                    <NewlyExpert experts={newlyExperts} />
                    <ApplyButton />
                </div>
                <div className="pcs-counseling">
                    <CounselingPanel filters={this.props.filters} />
                </div>
            </div>
        )
    }
}

const mapState = (state: any) => ({
    // auth
    isAuth: state[authKey].response ? state[authKey].response.code === 0 ? false : true : false,
    isCounselor: state[authKey].response && state[authKey].response.data ? state[authKey].response.data.userType === 1 ? true : false : false, 

    // filters
    filters: state[filtersKey].response && state[filtersKey].response.data ? state[filtersKey].response.data : initialFilters
})

export default connect(mapState)(Counseling)