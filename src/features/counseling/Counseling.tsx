import React from 'react';
import NewlyExpert from './component/NewlyExpert';
import { Button, Icon } from "antd";
import CounselingPanel from './component/CounselingPanel';

import { newlyExperts } from '../common/fakeData';

import './Counseling.less';

interface ICounselingProps { }

interface ICounselingState { }

function ApplyButton() {
    return (
        <div className="apply-button-wrapper">
            <Button type="primary" size="large" className="apply-button"><Icon type="edit" />咨询师入驻</Button>
        </div>
    )
}

export default class Counseling extends React.Component<ICounselingProps, ICounselingState> {
    constructor(props: ICounselingProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="psc-counseling-wrapper">
                <div className="psc-counseling-newly-expert">
                    <NewlyExpert experts={newlyExperts} />
                    <ApplyButton />
                </div>
                <div className="psc-counseling">
                    <CounselingPanel />
                </div>
            </div>
        )
    }
}