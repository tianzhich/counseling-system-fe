import React, { ChangeEvent } from 'react';
import Quill from "quill";
import { Upload, Icon, Input, Select, Tag, Tooltip, Button, message } from "antd";

import './Post.less'
import 'quill/dist/quill.snow.css';
import { articleTopicMap } from '@utils/map';

type topicKey = keyof Pick<typeof articleTopicMap, Exclude<keyof typeof articleTopicMap, 'all'>>

interface IPostProps { }

interface IPostState {
    counters: number
    title: string
    topic?: topicKey

    // 用于标签输入
    tags: string[]
    inputVisible: boolean
    inputValue: string
}

const toolbarOptions = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],       // custom dropdown
    [{ 'color': [] as any[] }, { 'background': [] as any[] }],          // dropdown with defaults from theme
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    [{ 'align': [] as any[] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    ['link', 'image'],
    ['clean']                                         // remove formatting button
];

export default class Post extends React.Component<IPostProps, IPostState> {
    quill: Quill;
    input: React.RefObject<any>
    constructor(props: IPostProps) {
        super(props)
        this.quill = null;
        this.input = React.createRef()
        this.state = {
            counters: 1,
            title: '',

            tags: [],
            inputValue: '',
            inputVisible: false
        }
    }
    initQuill = () => {
        this.quill = new Quill('#editor', {
            modules: {
                toolbar: toolbarOptions
            },
            theme: 'snow'  // or 'bubble'
        })

        // quill textChange event
        this.quill.on('text-change', (delta, oldDelta, source) => {
            this.setState({
                counters: delta.length()
            })
        })
    }
    handleClose = (removedTag: string) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({ tags });
    }

    handleTopicChange = (val: topicKey) => {
        this.setState({
            topic: val
        })
    }

    handleTitleChange = (val: string) => {
        this.setState({
            title: val
        })
    }

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.current.focus());
    }

    handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({ inputValue: e.target.value });
    }

    handleSubmit = () => {
        // validation
        const { topic, title, tags } = this.state
        const len = this.quill.getLength() - 1 // 减去quill默认的换行符\n
        if (!topic) {
            message.error('请选择文章类别')
            return
        }
        if (!title) {
            message.error('请填写文章标题')
            return
        }
        if (len === 0) {
            message.error('文章内容不能为空')
            return 
        }

        // post
        const delta = this.quill.getContents()
        const data = {
            title,
            content: JSON.stringify(delta),
            category: topic,
            tags: tags.join(',')
        }
        console.log(delta, data)
    }

    handleInputConfirm = () => {
        const { inputValue } = this.state;
        let { tags } = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    }
    
    componentDidMount() {
        window.scrollTo(0, 0);
        this.initQuill();
    }

    render() {
        const uploadButton = (
            <div>
                <Icon type="instagram" />
                <div className="ant-upload-text">点击更换封面图片<br /><span>最佳尺寸: xxx * xxx</span></div>
            </div>
        );
        const { tags, inputVisible, inputValue, counters } = this.state;
        return (
            <div className="pcs-post">
                <div className="cover">
                    <Upload
                        listType="picture-card"
                        className="cover-uploader"
                        showUploadList={false}
                    >
                        {uploadButton}
                    </Upload>
                </div>
                <div className="type">
                    <Select placeholder="请选择文章类型" onChange={this.handleTopicChange}>
                        {
                            Object.keys(articleTopicMap).filter(k => k !== 'all').map((k) => <Select.Option key={k}>{articleTopicMap[k]}</Select.Option>)
                        }
                    </Select>
                </div>
                <div className="tags">
                    {tags.map((tag, index) => {
                        const isLongTag = tag.length > 20;
                        const tagElem = (
                            <Tag key={tag} closable onClose={() => this.handleClose(tag)}>
                                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                            </Tag>
                        );
                        return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                    })}
                    {inputVisible && (
                        <Input
                            ref={this.input}
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
                            <Tooltip title="标签可作为文章类别的子类别"><Icon type="plus" /> 新增文章标签</Tooltip>
                        </Tag>
                    )}
                </div>
                <div className="titleName">
                    <Input placeholder="请输入文章标题" onChange={(e) => this.handleTitleChange(e.target.value)} />
                </div>
                <div className="editor">
                    <div id="editor" />
                    <div className="counters">{`当前已输入${counters-1}个字符，您还可以输入${50001 - counters}个字符`}</div>
                </div>
                <div className="actions">
                    <Button>保存草稿</Button>
                    <Button type="primary" onClick={this.handleSubmit}>发布文章</Button>
                </div>
            </div>
        )
    }
}