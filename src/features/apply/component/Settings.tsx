import React from 'react';
import { Tooltip, Icon, InputNumber, Radio, Cascader, message } from "antd";
import { RadioChangeEvent } from 'antd/lib/radio';
import { cities } from '@utils/cities';

const RadioGroup = Radio.Group

interface ISettingsProps { 
    onSubmitSettings: (settings: {}) => void
}

interface ISettingsState {
    audioPrice: number
    videoPrice: number

    // 面对面咨询
    ftf: {
        price: number
        city: string
    } | null
}

type SubmitData = {
    videoPrice: number
    audioPrice: number
    ftfPrice?: number
    city?: string
}

export default class Settings extends React.Component<ISettingsProps, ISettingsState> {
    constructor(props: ISettingsProps) {
        super(props);
        this.state = {
            audioPrice: 0,
            videoPrice: 0,
            ftf: null
        };
    }

    handleSetPrice = (type: Exclude<keyof ISettingsState, 'haveFtf' | 'ftf'>, value: any) => {
        this.setState({
            ...this.state,
            [type]: value
        })
    }

    handleSetFtf = (type: keyof ISettingsState['ftf'], value: any) => {
        this.setState({
            ftf: {
                ...this.state.ftf,
                [type]: value
            }
        })
    }

    toggleFtf = (e: RadioChangeEvent) => {
        this.setState({
            ftf: e.target.value === 0 ? null : {
                price: 0,
                city: ''
            }
        })
    }

    onSubmitSettings = () => {
        // 数据验证和提交
        if (this.state.audioPrice === 0 || this.state.videoPrice === 0 || (this.state.ftf && this.state.ftf.price === 0)) {
            message.error('请完善收费标准！');
            return
        } else if(this.state.ftf && this.state.ftf.city === "") {
            message.error('请选择面对面咨询城市！');
            return
        }
        let data: SubmitData = {
            videoPrice: this.state.videoPrice,
            audioPrice: this.state.audioPrice,
        }

        if(this.state.ftf) {
            data = {
                ...data, ftfPrice: this.state.ftf.price, city: this.state.ftf.city
            }
        }
        this.props.onSubmitSettings(data);
    }

    render() {
        return (
            <div className="apply-settings">
                <div>
                    请设置您每次咨询的收费标准
                    <Tooltip title="每次咨询为50分钟,设置完成在个人中心仍可以修改">
                        <Icon type="question-circle-o" />
                    </Tooltip>
                </div>
                <div>
                    <div>
                        <span>电话咨询</span>
                        <InputNumber
                            value={this.state.audioPrice}
                            min={0}
                            formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => isNaN(Number(value.replace(/¥\s?|(,*)/g, ''))) ? 0 : Number(value.replace(/¥\s?|(,*)/g, ''))}
                            onChange={(value) => this.handleSetPrice('audioPrice', value)}
                        />
                    </div>
                    <div>
                        <span>视频咨询</span>
                        <InputNumber
                            min={0}
                            value={this.state.videoPrice}
                            formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => isNaN(Number(value.replace(/¥\s?|(,*)/g, ''))) ? 0 : Number(value.replace(/¥\s?|(,*)/g, ''))}
                            onChange={(value) => this.handleSetPrice('videoPrice', value)}
                        />
                    </div>
                    <div>
                        <span>是否支持面对面咨询</span>
                        <RadioGroup onChange={this.toggleFtf} defaultValue={this.state.ftf ? 1 : 0}>
                            <Radio value={1}>是</Radio>
                            <Radio value={0}>否</Radio>
                        </RadioGroup>
                        <div style={{ display: this.state.ftf ? 'block' : 'none' }}>
                            <span>价格</span>
                            <InputNumber
                                min={0}
                                value={this.state.ftf ? this.state.ftf.price : 0}
                                formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => isNaN(Number(value.replace(/¥\s?|(,*)/g, ''))) ? 0 : Number(value.replace(/¥\s?|(,*)/g, ''))}
                                onChange={(value) => this.handleSetFtf('price', value)}
                            />
                            <span>城市</span>
                            <Cascader
                                options={cities}
                                expandTrigger="hover"
                                displayRender={(label) => label[label.length - 1]}
                                onChange={(value) => this.handleSetFtf('city', value[value.length - 1].replace('市', ''))}
                                placeholder="请选择"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}