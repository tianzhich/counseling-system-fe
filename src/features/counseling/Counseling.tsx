import React from 'react';
import Newlycounselors from './component/NewlyCounselors';
import { Button, Icon, message } from "antd";
import CounselorsPanel from './component/CounselorsPanel';
import './Counseling.less';
import Emitter from '@utils/events';
import { push } from 'connected-react-router';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ApiKey } from '@common/api/config';
import { IApiStore } from '@common/api/reducer';

interface ICounselingProps {
    isAuth: boolean
    isCounselor: boolean
    dispatch: Dispatch
}

interface ICounselingState {}

const authKey: ApiKey = 'oauth/auth'

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
                <div className="pcs-counseling-newly-counselors">
                    <Newlycounselors />
                    <ApplyButton />
                </div>
                <div className="pcs-counseling">
                    <CounselorsPanel />
                </div>
            </div>
        )
    }
}

const mapState = (state: IApiStore) => ({
    // auth
    isAuth: state[authKey].response ? state[authKey].response.code === 0 ? false : true : false,
    isCounselor: state[authKey].response && state[authKey].response.data ? state[authKey].response.data.userType === 1 ? true : false : false, 
})

export default connect(mapState)(Counseling)