import React from 'react';
import { Menu, Tag, Skeleton, Tooltip, Icon } from "antd";

const CheckableTag = Tag.CheckableTag

interface Filter {
    id: number
    name: string
}

export interface Filters {
    city: Filter[]
    method: Filter[]
    topic: Filter[]
}

export interface ICondition {
    sTopic: number
    sMethod: number
    sCity: number
    isOnline: boolean
}

export type onConditionChange = <K extends keyof ICondition>(key: K, value: ICondition[K]) => void

interface IFiltersPanelProps {
    condition: ICondition
    filters: Filters
    onConditionChange: onConditionChange
}


export default class FiltersPanel extends React.Component<IFiltersPanelProps, {}> {
    onConditionChange: onConditionChange = (key, value) => {
        this.props.onConditionChange(key, value)
    }

    render() {
        let { city, method, topic } = this.props.filters
        let { sTopic, sCity, sMethod, isOnline } = this.props.condition

        city = [{
            id: -1,
            name: '不限'
        }, ...city]
        method = [{
            id: -1,
            name: '不限'
        }, ...method]
        topic = [{
            id: -1,
            name: '不限'
        }, ...topic]

        return (
            <div className="condition-panel">
                <div className="topic">
                    <span>主题</span>
                    {
                        <Skeleton loading={topic.length === 0} paragraph={{ rows: 0 }} >
                            <Menu
                                mode="horizontal"
                                selectedKeys={[sTopic.toString()]}
                                onClick={({ item, key, keyPath }) =>
                                    this.props.onConditionChange('sTopic', Number(key))
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
                                        <CheckableTag key={m.id} checked={sMethod === m.id}
                                            onChange={() => this.props.onConditionChange('sMethod', m.id)}
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
                    <span>城市<Tooltip title="需要面对面咨询时请选择城市"><Icon type="question-circle" /></Tooltip></span>
                    {
                        <Skeleton loading={city.length === 1} paragraph={{ rows: 0 }} >
                            <div className="condition-container">
                                {
                                    city.map(c =>
                                        <CheckableTag key={c.id} checked={sCity === c.id}
                                            onChange={() => this.props.onConditionChange('sCity', c.id)}
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
                            <CheckableTag checked={isOnline}
                                onChange={() => this.props.onConditionChange('isOnline', true)}
                            >是
                        </CheckableTag>
                            <CheckableTag checked={!isOnline}
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