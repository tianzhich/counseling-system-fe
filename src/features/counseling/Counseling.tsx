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
import { IStore } from '@common/storeConfig';
import { fetchAction } from '@common/api/action';

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

    componentDidMount() {
        this.props.dispatch(fetchAction('info/counselingFilters'))
    }

    render() {
        const isAuth = this.props.isAuth
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
                    <CounselorsPanel isAuth={isAuth} />
                </div>
            </div>
        )
    }
}

const mapState = (state: IStore) => ({
    // auth
    isAuth: state['@global'].auth.isAuth,
    isCounselor: state['@global'].auth.authType === 1,
})

export default connect(mapState)(Counseling)