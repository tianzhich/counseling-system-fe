import React from 'react';
import { Card } from 'antd';

import "./CounselorDetail.less"

const tabListTitle = [{
    key: 'basics',
    tab: '基本信息',
}, {
    key: 'letters',
    tab: '感谢信',
}, {
    key: 'column',
    tab: '专栏',
}, {
    key: 'intro',
    tab: '个人简介',
}, {
    key: 'process',
    tab: '咨询流程',
}];

interface ICounselorDetailProps { }

interface ICounselorDetailState {
    activeTab: string
}

export default class CounselorDetail extends React.Component<ICounselorDetailProps, ICounselorDetailState> {
    constructor(props: ICounselorDetailProps) {
        super(props);
        this.state = {
            activeTab: "basics"
        };
    }

    onTabChange = (activeTab: string) => {
        this.setState({
            activeTab
        })
    }

    render() {
        const contentList = {
            basics: <div>基本信息</div>,
            letters: <div>感谢信</div>,
            column: <div>专栏</div>,
            intro: <div>个人简介</div>,
            process: <div>咨询流程</div>,
        }
        return (
            <div className="tab">
                <Card
                    style={{ width: '100%' }}
                    tabList={tabListTitle}
                    activeTabKey={this.state.activeTab}
                    onTabChange={this.onTabChange}
                >
                    {contentList[this.state.activeTab]}
                </Card>
            </div>
        )
    }
}