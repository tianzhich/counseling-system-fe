import React from 'react';

import './SettingTab.less'
import { IUserInfo } from '../Profile';
import { Counselor } from '@features/common/types';
import { Divider } from 'antd';

interface ISettingTabProps {
    userInfo: IUserInfo
    counselorInfo?: Counselor
    isCounselor?: boolean

}

interface ISettingTabState {}

export default class SettingTab extends React.Component<ISettingTabProps, ISettingTabState> {
    constructor(props: ISettingTabProps) {
        super(props);
        this.state = {};
    }

    render() {
        const isCounselor = this.props.isCounselor
        return (
            <div className="tab-setting">
                <h3>个人资料</h3>
                <div>

                </div>
                <Divider />
                {
                    isCounselor ? (
                        <React.Fragment>
                            <h3>咨询设置</h3>
                        </React.Fragment>
                    ) : null
                }
            </div>
        )
    }
}