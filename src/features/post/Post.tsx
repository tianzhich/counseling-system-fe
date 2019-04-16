import React, { ChangeEvent } from 'react';
import Quill from "quill";
import { Upload, Icon, Input, Select, Tag, Tooltip, Button, message } from "antd";

import './Post.less'
import 'quill/dist/quill.snow.css';
import { articleTopicMap } from '@utils/map';
import { OtherAPI, IApiResponse, NetworkErrorMsg } from '@common/api/config';
import { IStore } from '@common/storeConfig';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Dispatch } from 'redux';
import { fetchAction } from '@common/api/action';
import { IApiState } from '@common/api/reducer';

type topicKey = keyof Pick<typeof articleTopicMap, Exclude<keyof typeof articleTopicMap, 'all'>>

interface IPostProps {
    isCounselor: boolean
    dispatch: Dispatch
    operationStatus: IApiState
}

interface IPostState {
    draftID?: number
    counters: number
    title: string
    topic?: topicKey

    // 用于标签输入
    tags: string[]
    inputVisible: boolean
    inputValue: string

    // 当前操作
    curOperation?: 'submit' | 'draft'
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

class Post extends React.Component<IPostProps, IPostState> {
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
        const { topic, title, tags, draftID } = this.state
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
        const excerpt = delta.ops[0].insert ? delta.ops[0].insert.toString().split('\n')[0] : ''
        const data = {
            title,
            excerpt,
            content: JSON.stringify(delta),
            category: topic,
            tags: tags.join(','),
            id: draftID
        }

        this.setState({
            curOperation: 'submit'
        }, () => this.props.dispatch(fetchAction('operation/article', { data })))
    }

    handleSaveDraft = () => {
        const { topic, title, tags, draftID } = this.state
        // post
        const delta = this.quill.getContents()
        const excerpt = delta.ops[0].insert ? delta.ops[0].insert.toString().split('\n')[0] : ''
        const data = {
            title,
            excerpt,
            content: JSON.stringify(delta),
            category: topic ? topic : "_blank",
            tags: tags.join(','),
            isDraft: 1,
            id: draftID
        }

        this.setState({
            curOperation: 'draft'
        }, () => this.props.dispatch(fetchAction('operation/article', { data })))
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

    reload = () => {
        this.setState({
            counters: 1,
            title: '',
            tags: [],
            topic: undefined,
            draftID: undefined,
            curOperation: undefined
        })
        const delta: any = {
            ops: [{
                insert: "\n"
            }]
        }
        this.quill.setContents(delta)
    }

    initDraft = () => {
        OtherAPI.GetArticleDraft().then(({ data }) => {
            const res: IApiResponse = data
            if (res.code === 1) {
                // 草稿初始化
                const a = res.data
                const delta = JSON.parse(a.content)
                this.quill.setContents(delta)
                const tags = a.tags === '' ? [] : a.tags.split(',')

                this.setState({
                    counters: this.quill.getLength(),
                    title: a.title,
                    draftID: a.id,
                    tags,
                    topic: a.category === '_blank' ? undefined : a.category
                })
            }
        })
    }

    componentDidUpdate(prevProps: IPostProps) {
        // 操作结果
        const op = this.state.curOperation
        const prevState = prevProps.operationStatus
        const curState = this.props.operationStatus
        if (op && prevState.status === 'loading') {
            if (curState.status === 'success' && curState.response) {
                if (curState.response.code === 1) {
                    const msg = op === 'draft' ? '草稿已保存' : '发表成功'
                    message.success(msg)
                    if (op === 'submit') {
                        this.reload()
                    }
                } else {
                    message.error(curState.response.message)
                }
            } else {
                message.error(NetworkErrorMsg)
            }
        }
    }

    componentDidMount() {
        if (!this.props.isCounselor) {
            return
        }

        window.scrollTo(0, 0);
        this.initQuill();

        // init draft
        this.initDraft()
    }

    render() {
        if (!this.props.isCounselor) {
            return <Redirect to="/" />
        }

        const uploadButton = (
            <div>
                <Icon type="instagram" />
                <div className="ant-upload-text">点击更换封面图片<br /><span>最佳尺寸: xxx * xxx</span></div>
            </div>
        );
        const { tags, inputVisible, inputValue, counters, title, topic } = this.state;
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
                    <Select placeholder="请选择文章类型" onChange={this.handleTopicChange} value={topic}>
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
                    <Input placeholder="请输入文章标题" onChange={(e) => this.handleTitleChange(e.target.value)} value={title} />
                </div>
                <div className="editor">
                    <div id="editor" />
                    <div className="counters">{`当前已输入${counters - 1}个字符，您还可以输入${50001 - counters}个字符`}</div>
                </div>
                <div className="actions">
                    <Button onClick={this.handleSaveDraft}>保存草稿</Button>
                    <Button type="primary" onClick={this.handleSubmit}>发布文章</Button>
                </div>
            </div>
        )
    }
}

const mapState = (state: IStore) => ({
    isCounselor: state['@global'].auth.authType === 1,
    operationStatus: state['operation/article']
})

export default connect(mapState)(Post)