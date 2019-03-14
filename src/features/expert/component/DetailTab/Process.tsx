import React from 'react';
import { Steps, Icon } from 'antd';

const Step = Steps.Step

export default function () {
    return (
        <div className="tab-process">
            <Steps direction="vertical" >
                <Step status="finish" title="预约咨询师" description="选择咨询师并进行预约" icon={<Icon type="schedule" />} />
                <Step status="finish" title="支付订单" description="选择咨询方式并下单" icon={<Icon type="dollar" />} />
                <Step status="finish" title="咨询师确认" description="咨询师确认订单" icon={<Icon type="check-square" />} />
                <Step status="finish" title="协商并进行咨询" description="和咨询师协商咨询时间以及咨询地点（如果选择面对面咨询）" icon={<Icon type="team" />} />
                <Step status="finish" title="咨询者确认完成" description="咨询者咨询完成后确认，评价本次咨询"icon={<Icon type="like" />} />
            </Steps>
        </div>
    )
}