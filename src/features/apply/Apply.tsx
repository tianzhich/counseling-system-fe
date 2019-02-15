import React from 'react';
import { Steps, Icon, Button } from 'antd'
import Agreements from "./component/Agreements";
import Info from "./component/Info";

import './Apply.less';

const Step = Steps.Step;

interface IApplyProps { }

interface IApplyState {
    currentStep: number
    countdown: number

    personInfo: {}
}

export default class Apply extends React.Component<IApplyProps, IApplyState> {
    countdownInterval: any
    infoRef: React.RefObject<any>
    constructor(props: IApplyProps) {
        super(props);
        this.infoRef = React.createRef();
        this.state = {
            currentStep: 0,
            countdown: 8,
            personInfo: {}
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
    }

    componentWillUnmount() {
        clearInterval(this.countdownInterval)
    }

    goNextStep = () => {
        console.log(this.infoRef)
        if(this.state.currentStep === 1) {
            // validate
            if(!this.infoRef.current.onValidate()) {
                return
            }
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

    render() {
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
            content: '',
        }, {
            title: '服务设置',
            icon: <Icon type="edit" />,
            content: '',
        }]

        const renderActionBtn = () => {
            if (current === 3) {
                return null
            }
            if (current === 0) {
                return <Button type="primary" disabled={countdown >= 0} onClick={this.goNextStep}>{`我知道了${countdown >= 0 ? `(${countdown})` : ''}`}</Button>
            } else {
                return <Button type="primary" onClick={this.goNextStep}>下一步</Button>
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