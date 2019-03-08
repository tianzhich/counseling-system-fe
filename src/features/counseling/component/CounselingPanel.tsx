import React from 'react';
import { Menu, Tag, Skeleton } from "antd";
import { topicMap, methodMap, cityMap } from '@features/common/map';
import ExpertList from './ExpertList';

import './CounselingPanel.less';
import { newlyExperts } from '@features/common/fakeData';

const { CheckableTag } = Tag;

type onConditionChange = <K extends keyof ICondition>(key: K, value: ICondition[K]) => void

interface Filter {
    id: number
    name: string
}

export interface Filters {
    city: Filter[]
    method: Filter[]
    topic: Filter[]
}

interface ICondition {
    topic: number
    method: number
    city: number
    isOnline: boolean
}

interface ICounselingPanelProps {
    filters: Filters
}

interface ICounselingPanelState {
    condition: ICondition
}

interface IConditionPanelProps extends ICondition {
    filters: Filters
    onConditionChange: onConditionChange
}

class ConditionPanel extends React.Component<IConditionPanelProps, {}> {
    onConditionChange: onConditionChange = (key, value) => {
        this.props.onConditionChange(key, value)
    }
    render() {
        let { city, method, topic } = this.props.filters
        const selectedTopic = this.props.topic.toString()
        
        city = [{
            id: -1,
            name: '不限'
        }, ...city]
        method = [{
            id: -1,
            name: '不限'
        }, ...method]

        return (
            <div className="condition-panel">
                <div className="topic">
                    <span>主题</span>
                    {
                        <Skeleton loading={topic.length === 0} paragraph={{ rows: 0 }} >
                            <Menu
                                mode="horizontal"
                                selectedKeys={[selectedTopic]}
                                onClick={({ item, key, keyPath }) =>
                                    this.props.onConditionChange('topic', Number(key))
                                }
                            >
                                {
                                    topic.map(t => <Menu.Item key={t.id}>{t.name}</Menu.Item>)
                                }
                            </Menu>
                        </Skeleton>
                    }
                </div>
                <div className="method">
                    <span>方式</span>
                    {
                        <Skeleton loading={method.length === 1} paragraph={{ rows: 0 }} >
                            <div className="condition-container">
                                {
                                    method.map(m =>
                                        <CheckableTag key={m.id} checked={this.props.method === m.id}
                                            onChange={() => this.props.onConditionChange('method', m.id)}
                                        >
                                            {m.name}
                                        </CheckableTag>
                                    )
                                }
                            </div>
                        </Skeleton>
                    }

                </div>
                <div className="city">
                    <span>城市</span>
                    {
                        <Skeleton loading={city.length === 1} paragraph={{ rows: 0 }} >
                            <div className="condition-container">
                                {
                                    city.map(c =>
                                        <CheckableTag key={c.id} checked={this.props.city === c.id}
                                            onChange={() => this.props.onConditionChange('city', c.id)}
                                        >
                                            {c.name}
                                        </CheckableTag>
                                    )
                                }
                            </div>
                        </Skeleton>
                    }

                </div>
                <div className="isOnline">
                    <span>在线</span>
                    <Skeleton loading={method.length === 1} paragraph={{ rows: 0 }} >
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
                    </Skeleton>
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
                city: -1,
                topic: -1,
                isOnline: false,
                method: -1
            }
        };
    }

    handleConditionChange: onConditionChange = (key, value) => {
        this.setState({
            condition: { ...this.state.condition, [key]: value }
        })
    }

    render() {
        const filters = this.props.filters
        return (
            <div className="counseling-panel">
                <ConditionPanel
                    topic={this.state.condition.topic}
                    city={this.state.condition.city}
                    method={this.state.condition.method}
                    isOnline={this.state.condition.isOnline}
                    onConditionChange={this.handleConditionChange}
                    filters={filters}
                />
                <ExpertList experts={newlyExperts} />
            </div>
        )
    }
}