import React from 'react';
import NewlyExpert from './component/NewlyExpert';
import { Button, Icon, message } from "antd";
import CounselingPanel from './component/CounselingPanel';

import { newlyExperts } from '../common/fakeData';

import './Counseling.less';
import { withRouter, Redirect } from 'react-router';
import { ApiKey } from '@common/api/config';
import { connect } from 'react-redux';
import Emitter from '@utils/events';

interface ICounselingProps {
    isAuth: boolean
    isCounselor: boolean
}

interface ICounselingState { }

const authKey: ApiKey = 'oauth/auth'

class Counseling extends React.Component<ICounselingProps, ICounselingState> {
    constructor(props: ICounselingProps) {
        super(props);
        this.state = {};
    }

    isAuth = () => {
        if (this.props.isAuth === false) {
            Emitter.emit('openSigninModal')
            return false
        } else {
            return true
        }
    }

    render() {
        const ApplyButton = withRouter(({ history }) => (
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
                            history.push('/apply')
                        }
                    }}
                >
                    <Icon type="edit" />咨询师入驻
                </Button>
            </div>
        ))

        return (
            <div className="pcs-counseling-wrapper">
                <div className="pcs-counseling-newly-expert">
                    <NewlyExpert experts={newlyExperts} />
                    <ApplyButton />
                </div>
                <div className="pcs-counseling">
                    <CounselingPanel />
                </div>
            </div>
        )
    }
}

const mapState = (state: any) => ({
    isAuth: state[authKey].response ? state[authKey].response.code === 0 ? false : true : false,
    isCounselor: state[authKey].response && state[authKey].response.data ? state[authKey].response.data.userType === 1 ? true : false : false, 
})

export default connect(mapState)(Counseling)