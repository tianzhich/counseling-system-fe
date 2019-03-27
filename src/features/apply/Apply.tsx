import React from 'react';
import { Steps, Icon, Button, message } from 'antd'
import Agreements from "./component/Agreements";
import Info from "./component/Info";
import Credit from "./component/Credit";
import Settings from "./component/Settings";

import './Apply.less';
import { connect } from 'react-redux';
import { ApiKey, NetworkErrorMsg, IApiResult } from '@common/api/config';
import { Redirect } from 'react-router';
import { fetchAction } from '@common/api/action';
import { Dispatch } from 'redux';
import { IApiStore } from '@common/api/reducer';
import { IStore } from '@common/storeConfig';

const Step = Steps.Step;

const authKey: ApiKey = 'oauth/auth'
const applyKey: ApiKey = 'oauth/apply'

interface IApplyProps {
    isAuth: boolean
    isCounselor: boolean // 是否咨询师账户
    dispatch: Dispatch
    applyRes: IApiResult
}

interface IApplyState {
    currentStep: number
    countdown: number

    personInfo: {}
}

class Apply extends React.Component<IApplyProps, IApplyState> {
    countdownInterval: any
    infoRef: React.RefObject<any>
    settingsRef: React.RefObject<any>
    constructor(props: IApplyProps) {
        super(props);
        this.infoRef = React.createRef();
        this.settingsRef = React.createRef();
        this.state = {
            currentStep: 0,
            countdown: 0, // fake,默认为8s
            personInfo: {},
        };
    }

    componentDidMount() {
        this.countdownInterval = setInterval(() => {
            this.setState((prevState) => ({
                countdown: prevState.countdown - 1
            }))
        }, 1000)
    }

    componentDidUpdate(prevProps: IApplyProps, prevState: IApplyState) {
        if (prevState.countdown === 0) {
            clearInterval(this.countdownInterval)
        }

        // 申请回调结果
        if (prevProps.applyRes.status === 'loading') {
            if (this.props.applyRes.status === 'success') {
                if (this.props.applyRes.response.code === 1) {
                    message.success(this.props.applyRes.response.message)
                    setTimeout(() => {
                        window.location.reload()
                    }, 1500); 
                } else {
                    message.error(this.props.applyRes.response.message)
                }
            } else if (this.props.applyRes.status === 'failed') {
                message.error(NetworkErrorMsg)
            }
        }
    }

    componentWillUnmount() {
        clearInterval(this.countdownInterval)
    }

    goNextStep = () => {
        if (this.state.currentStep === 1) {
            // validate info
            if (!this.infoRef.current.onValidate()) {
                return
            }
        } else if (this.state.currentStep === 3) {
            // validate settings and submit
            this.settingsRef.current.onSubmitSettings();
            return
        }
        const currentStep = this.state.currentStep + 1;
        this.setState({
            currentStep
        })
    }

    handleInfoSubmit = (info: {}) => {
        this.setState({
            personInfo: info
        })
    }

    // 设置完成，使用个人信息、资质、设置信息发起入驻请求
    handleSettingsSubmit = (settings: {}) => {
        const data = {
            ...this.state.personInfo, ...settings
        }

        this.props.dispatch(fetchAction('oauth/apply', { data }))
    }

    render() {
        if (!this.props.isAuth || this.props.isCounselor) {
            return <Redirect to="/" />
        }

        const current = this.state.currentStep;
        const countdown = this.state.countdown;

        const steps = [{
            title: '同意协议',
            icon: <Icon type="file-text" />,
            content: <Agreements />,
        }, {
            title: '个人信息',
            icon: <Icon type="user" />,
            content: <Info wrappedComponentRef={this.infoRef} onSubmitInfo={this.handleInfoSubmit} />,
        }, {
            title: '资质上传',
            icon: <Icon type="profile" />,
            content: <Credit />,
        }, {
            title: '服务设置',
            icon: <Icon type="edit" />,
            content: <Settings ref={this.settingsRef} onSubmitSettings={this.handleSettingsSubmit} />,
        }]

        const renderActionBtn = () => {
            if (current === 0) {
                return <Button type="primary" disabled={countdown >= 0} onClick={this.goNextStep}>{`我知道了${countdown >= 0 ? `(${countdown})` : ''}`}</Button>
            } else {
                return <Button type="primary" onClick={this.goNextStep}>{current === 3 ? '完成' : '下一步'}</Button>
            }
        }
        return (
            <div className="pcs-apply">
                <div className="steps-bar">
                    <Steps current={current}>
                        {
                            steps.map(step => <Step key={step.title} title={step.title} icon={step.icon} />)
                        }
                    </Steps>
                </div>
                <div className="steps-content">
                    {
                        steps[current].content
                    }
                    <div className="steps-action">
                        {
                            renderActionBtn()
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapState = (state: IStore) => ({
    isAuth: state['@global'].auth.isAuth,
    isCounselor: state['@global'].auth.authType === 1,
    applyRes: state[applyKey]
})

export default connect(mapState)(Apply)