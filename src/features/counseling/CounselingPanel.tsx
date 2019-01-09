import React from 'react';
import { Menu, Tag } from "antd";
import { topicMap, methodMap, cityMap } from '@src/map';

import './CounselingPanel.less';

const { CheckableTag } = Tag;

type topic = keyof typeof topicMap
type method = keyof typeof methodMap
type city = keyof typeof cityMap
type onConditionChange = <K extends keyof ICondition>(key: K, value: ICondition[K]) => void

interface ICondition {
    topic: topic
    method: method
    city: city
    isOnline: boolean
}

interface ICounselingPanelProps { }

interface ICounselingPanelState {
    condition: ICondition
}

interface IConditionPanelProps extends ICondition {
    onConditionChange: onConditionChange
}

class ConditionPanel extends React.Component<IConditionPanelProps, {}> {
    onConditionChange: onConditionChange = (key, value) => {
        this.props.onConditionChange(key, value)
    }
    render() {
        return (
            <div className="condition-panel">
                <div className="topic">
                    <span>主题</span>
                    <Menu
                        mode="horizontal"
                        selectedKeys={[this.props.topic]}
                        onClick={({ item, key, keyPath }) =>
                            this.props.onConditionChange('topic', key as topic)
                        }
                    >
                        {
                            Object.keys(topicMap).map(topic =>
                                <Menu.Item key={topic}>{topicMap[topic]}</Menu.Item>
                            )
                        }
                    </Menu>
                </div>
                <div className="method">
                    <span>方式</span>
                    <div className="condition-container">
                        {
                            Object.keys(methodMap).map(method =>
                                <CheckableTag key={method} checked={this.props.method === method}
                                    onChange={() => this.props.onConditionChange('method', method as method)}
                                >
                                    {methodMap[method]}
                                </CheckableTag>
                            )
                        }
                    </div>
                </div>
                <div className="city">
                    <span>城市</span>
                    <div className="condition-container">
                        {
                            Object.keys(cityMap).map(city =>
                                <CheckableTag key={city} checked={this.props.city === city}
                                    onChange={() => this.props.onConditionChange('city', city as city)}
                                >
                                    {cityMap[city]}
                                </CheckableTag>
                            )
                        }
                    </div>
                </div>
                <div className="isOnline">
                    <span>在线</span>
                    <div className="condition-container">
                        <CheckableTag checked={this.props.isOnline}
                            onChange={() => this.props.onConditionChange('isOnline', true)}
                        >是
                        </CheckableTag>
                        <CheckableTag checked={!this.props.isOnline}
                            onChange={() => this.props.onConditionChange('isOnline', false)}
                        >否
                        </CheckableTag>
                    </div>
                </div>
            </div>
        )
    }
}

export default class CounselingPanel extends React.Component<ICounselingPanelProps, ICounselingPanelState> {
    constructor(props: ICounselingPanelProps) {
        super(props);
        this.state = {
            // 初始化查询条件
            condition: {
                city: 'all',
                topic: 'all',
                isOnline: false,
                method: 'all'
            }
        };
    }

    handleConditionChange: onConditionChange = (key, value) => {
        this.setState({
            condition: { ...this.state.condition, [key]: value }
        })
    }

    render() {
        return (
            <div className="counseling-panel">
                <ConditionPanel
                    topic={this.state.condition.topic}
                    city={this.state.condition.city}
                    method={this.state.condition.method}
                    isOnline={this.state.condition.isOnline}
                    onConditionChange={this.handleConditionChange}
                />
            </div>
        )
    }
}