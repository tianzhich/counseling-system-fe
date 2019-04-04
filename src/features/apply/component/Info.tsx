import React from 'react';
import {
    Form, Input, Select, Upload, Radio, InputNumber, Divider, Icon, Tooltip, Button, Tag, message
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { RadioChangeEvent } from 'antd/lib/radio';

const { Option } = Select;
const { TextArea } = Input

let genId = 0;

interface IInfoProps {
    form: WrappedFormUtils
    onSubmitInfo: (values: any) => void
}

interface IInfoState {
    confirmDirty: boolean
    autoCompleteResult: any[]

    // 其他领域
    haveOtherTopic: boolean
    topicTags: string[]
    inputVisible: boolean
    inputValue: string
}

const GuideItem = (props: { title: string, content: React.ReactNode }) =>
    <div style={{ marginBottom: "10px" }}>
        <div>{`【${props.title}】`}</div>
        <div>{props.content}</div>
    </div>

const DetailGuide = () => <div className="detail-guide">
    <h3>个人简介 填写指引</h3>
    <p>
        如果你在以下项目中，有一项或多项有优势，请按照小标题【XXXX】+文字描述(第三人称)的方式填写到「个人简介」文本框中。格式如下。建议精简语言。
    </p>
    <GuideItem title="教育背景" content="示例：美国 XX州注册心理咨询师，美国 XX University全职咨询师" />
    <GuideItem title="实习经验" content="示例：在美国修读硕士的过程中，进入到西雅图当地高中，担任实习school counselor半年。" />
    <GuideItem title="工作经验" content="示例：毕业以后进入北京国奥心理医院，担任全职心理咨询师，周咨询量稳定在20个。至今积累超过3000小时的个案时长。" />
    <GuideItem title="擅长领域经验介绍" content={
        <React.Fragment>
            <p>示例1：高校担任专职心理咨询师超过5年，接触过大量与自信心建立和个人成长相关议题的青年个案。尤其对青年女性在成长和独立方面的议题，有独到的见解。曾受邀担任学校女性成长社团特邀讲师/咨询师，陪伴千位现代青年女性发现自己的独特气质，自信面对人生</p>
            <p>示例2：从2007年进入心理咨询行业，先后在三甲医院心理科，心理咨询机构担任高级咨询师。对抑郁症，焦虑症，强迫症等问题有过大量的临床研究和实践。在XX等科学期刊上发表《叙事治疗在抑郁症的优势》《xxx》等文章。</p>
            <p>示例3：2008年从北京师范大学心理学专业硕士毕业，开始在机构担任心理咨询师。随后受聘成为多家世界500强企业做员工心理辅导。长期为白领提供心理咨询服务，对职场人际关系、职业规划以及跳槽辞职等议题有丰富经验</p>
        </React.Fragment>
    } />
    <GuideItem title="个人心路历程" content="示例：心理咨询在我看来是艺术和科学的完美结合，我从20XX年开始学习的心理学……" />
    <GuideItem title="咨询服务流程" content="示例：一般来说我的咨询流程是……" />
    <GuideItem title="其他" content="" />
</div>

class Info extends React.Component<IInfoProps, IInfoState> {
    saveTagRef: React.RefObject<any>
    constructor(props: IInfoProps) {
        super(props);
        this.saveTagRef = React.createRef()
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],

            haveOtherTopic: false,
            topicTags: [],
            inputVisible: false,
            inputValue: ""
        }
    }

    onValidate = () => {
        let isValidate: boolean;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // 校验otherTopic tag
                if (values.topic === "其他" && this.state.topicTags.length === 0) {
                    message.error('请至少选择或输入一个您擅长的领域！')
                    isValidate = false
                    return isValidate
                }

                // 表单处理和上传
                const data = {
                    name: values.name,
                    gender: values.gender,
                    description: values.description,
                    motto: values.motto,
                    workYears: values.workYears,
                    topic: values.topic,
                    otherTopic: values.topic === "其他" ? this.state.topicTags.join(",") : "",
                    detail: values.keys.map((k: any) => ({
                        title: values.title[k],
                        content: values.content[k]
                    }))
                }
                isValidate = true
                this.props.onSubmitInfo(data)
            } else {
                isValidate = false
            }
        });
        return isValidate
    }

    removeDetailItem = (k: any) => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter((key: any) => key !== k),
        });
    }

    addDetailItem = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(genId++);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    }

    handleClose = (removedTag: string) => {
        const topicTags = this.state.topicTags.filter(tag => tag !== removedTag);
        this.setState({ topicTags });
    }

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.saveTagRef.current.focus());
    }

    handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ inputValue: e.target.value });
    }

    handleInputConfirm = () => {
        const state = this.state;
        const inputValue = state.inputValue;
        let topicTags = state.topicTags;
        if (inputValue && topicTags.indexOf(inputValue) === -1) {
            topicTags = [...topicTags, inputValue];
        }
        this.setState({
            topicTags,
            inputVisible: false,
            inputValue: '',
        });
    }

    handleTopicChange = (e: RadioChangeEvent) => {
        this.setState({
            haveOtherTopic: e.target.value === "其他"
        })
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;

        const { topicTags, inputVisible, inputValue } = this.state

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        getFieldDecorator('keys', { initialValue: [] });
        const detailKeys = getFieldValue('keys');
        const detailItems = detailKeys.map((k: any, index: number) => (
            <React.Fragment key={k}>
                <Form.Item
                    {...formItemLayout}
                    label="小标题"
                    required={false}
                    key={`title[${k}]`}
                >
                    {getFieldDecorator(`title[${k}]`, {
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: "请输入小标题或删除该项",
                        }],
                    })(
                        <Input style={{ width: '60%', marginRight: 8 }} />
                    )}
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.removeDetailItem(k)}
                    />
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="文字描述"
                    required={false}
                    key={`content[${k}]`}
                >
                    {getFieldDecorator(`content[${k}]`, {
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: "请输入文字描述或删除该项",
                        }],
                    })(
                        <TextArea style={{ height: "100px" }} />
                    )}
                </Form.Item>
                <Divider />
            </React.Fragment>
        ))

        return (
            <Form>
                <Form.Item
                    {...formItemLayout}
                    label="姓名"
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请填写您的姓名', whitespace: true }],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="性别"
                >
                    {getFieldDecorator('gender', {
                        rules: [{
                            required: true, message: '请选择您的性别'
                        }]
                    })(
                        <Radio.Group>
                            <Radio value={1}>男</Radio>
                            <Radio value={0}>女</Radio>
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="工作年限"
                >
                    {getFieldDecorator('workYears', {
                        rules: [{
                            required: true, message: '请输入您的工作年限'
                        }]
                    })(
                        <InputNumber min={1} max={50} />
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="擅长领域"
                >
                    {getFieldDecorator('topic', {
                        rules: [{
                            required: true, message: '请选择您擅长的领域'
                        }]
                    })(
                        <Radio.Group onChange={this.handleTopicChange}>
                            <Radio.Button value="个人成长">个人成长</Radio.Button>
                            <Radio.Button value="恋爱婚姻">恋爱婚姻</Radio.Button>
                            <Radio.Button value="老年心理">老年心理</Radio.Button>
                            <Radio.Button value="其他">其他</Radio.Button>
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="其他领域"
                    style={{ display: this.state.haveOtherTopic ? "block" : "none" }}
                >
                    {getFieldDecorator('otherTopic')(
                        <div>
                            {topicTags.map(tag => {
                                const isLongTag = tag.length > 20;
                                const tagElem = (
                                    <Tag key={tag} afterClose={() => this.handleClose(tag)}>
                                        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                    </Tag>
                                );
                                return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                            })}
                            {inputVisible && (
                                <Input
                                    ref={this.saveTagRef}
                                    type="text"
                                    size="small"
                                    style={{ width: 78 }}
                                    value={inputValue}
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleInputConfirm}
                                    onPressEnter={this.handleInputConfirm}
                                />
                            )}
                            {!inputVisible && (
                                <Tag
                                    onClick={this.showInput}
                                    style={{ background: '#fff', borderStyle: 'dashed' }}
                                >
                                    <Icon type="plus" /> New Tag
                                </Tag>
                            )}
                        </div>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="个人头衔"
                    extra="请以 / 分隔"
                >
                    {getFieldDecorator('description', {
                        rules: [{
                            required: true, message: '请填写您的个人头衔'
                        }, {
                            type: 'string', max: 40, message: '最多40个字符'
                        }]
                    })(
                        <Input placeholder="限40个字符，示例：XX协会会员/硕士/执业医师/三甲医院心理科医生" />
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="个人签名"
                >
                    {getFieldDecorator('motto', {
                        rules: [{
                            required: true, message: '请填写您的个人签名',
                        }, {
                            type: 'string', max: 50, message: '最多50个字符'
                        }],
                    })(
                        <TextArea
                            placeholder="限50个字符。&#10;方向1：可以写咨询师对咨询的理解（价值观）。示例：有阴影的地方就有阳光。咨询师，就是要让来访者看到更整体、全面的东西。&#10;方向2：咨询师想要对来访者说的话。示例：星洲易渡，心河难逾，与你共觅心河之舟。&#10;方向3：咨询师最想要来访者了解的讯息。示例：十年正念结合心理学实践经验，致力于推动正念禅修结合心理学。"
                            style={{ height: "150px" }}
                        />
                    )}
                </Form.Item>
                <Divider />
                <div style={{ textAlign: "center", fontSize: "16px" }}>
                    个人简介&nbsp;
                    <Tooltip title="请参照下方的 个人简介文本框 填写指引。">
                        <Icon type="question-circle-o" />
                    </Tooltip>
                </div>
                {detailItems}
                <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: "center" }}>
                    <Button type="dashed" onClick={this.addDetailItem} style={{ width: '60%' }}>
                        <Icon type="plus" /> 添加一项
                    </Button>
                </Form.Item>
                <DetailGuide />
            </Form>
        );
    }
}

export default Form.create()(Info);