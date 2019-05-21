import React from 'react'
import './AskPost.less'
import { Switch, Input, Divider, Button, Skeleton, message } from 'antd'
import { connect } from 'react-redux'
import { IStore } from '@common/storeConfig'
import { AskTags } from '@features/common/types'
import { Dispatch } from 'redux'
import { fetchAction } from '@common/api/action'
import { IApiState } from '@common/api/reducer'
import { push } from 'connected-react-router'
import { NetworkErrorMsg } from '@common/api/config'

interface IAskPostProps {
  askTags: AskTags[]
  dispatch: Dispatch
  askPostRes: IApiState
}

interface IAskPostState {
  activeTag?: string
  activeSubTag?: string[]
  title?: string
  content?: string
  isAnony: boolean // 是否匿名
}

class AskPost extends React.Component<IAskPostProps, IAskPostState> {
  constructor(props: IAskPostProps) {
    super(props)
    this.state = {
      isAnony: false
    }
  }

  componentDidMount() {
    this.props.dispatch(fetchAction('info/askTags'))
  }

  toggleActiveTag = (activeTag: string) => {
    this.setState({
      activeTag
    })
  }

  toggleActiveSubTag = (tag: string) => {
    const activeSubTag = this.state.activeSubTag ? this.state.activeSubTag : []
    const isExist = activeSubTag.find(t => t === tag)
    if (activeSubTag && activeSubTag.length === 3 && !isExist) {
      message.warning('您最多只可以选择三个标签')
      return
    }

    this.setState({
      activeSubTag: isExist ? activeSubTag.filter(t => t !== tag) : [...activeSubTag, tag]
    })
  }

  toggleAnony = () => {
    this.setState(prevState => ({
      isAnony: !prevState.isAnony
    }))
  }

  handleTitleInput = (title: string) => {
    this.setState({
      title
    })
  }

  handleContentInput = (content: string) => {
    this.setState({
      content
    })
  }

  handlePostAsk = () => {
    // 验证
    const { title, content, isAnony, activeSubTag } = this.state
    if (!title || title.trim().length === 0) {
      message.warning('请输入标题')
      return
    }
    if (!content || content.trim().length === 0) {
      message.warning('内容不能为空')
      return
    }
    if (!activeSubTag || activeSubTag.length === 0) {
      message.warning('请至少选择一个问题标签')
      return
    }

    // 提交
    const data = {
      title,
      content,
      isAnony,
      tags: activeSubTag.join(',')
    }
    this.props.dispatch(fetchAction('operation/addAsk', { data }))
  }

  componentDidUpdate(prevProps: IAskPostProps) {
    // 提交问答回调
    const prevState = prevProps.askPostRes
    const curState = this.props.askPostRes
    if (prevState.status === 'loading') {
      const success = curState.response && curState.response.code === 1
      const curStatus = curState.status
      if (curStatus === 'success') {
        if (success) {
          message.success('发布成功')
          setTimeout(() => {
            this.props.dispatch(push('/ask'))
          }, 500)
        } else {
          message.error('发布失败，' + curState.response.message)
        }
      } else if (curStatus === 'failed') {
        message.error(NetworkErrorMsg)
      }
    }
  }

  render() {
    const tags = this.props.askTags
    const activeTag = tags.find(t => t.id === this.state.activeTag)
    const activeSubTag = this.state.activeSubTag ? this.state.activeSubTag : []
    const subTags = activeTag ? activeTag.subTags : null
    return (
      <div className="ask-post">
        <header>
          <span className="title">发布提问</span>
          <Switch
            checkedChildren="实名"
            unCheckedChildren="匿名"
            defaultChecked
            onChange={this.toggleAnony}
          />
          <span className="extra-text">即时倾诉，倾听你的故事</span>
        </header>
        <Input
          className="post-title"
          placeholder="问题标题，5个字～25个字以内，必填"
          onChange={e => this.handleTitleInput(e.target.value)}
        />
        <Input.TextArea
          className="post-content"
          onChange={e => this.handleContentInput(e.target.value)}
          placeholder="描述问题（40个字～400字以内，必填）
建议：
【年龄-性别】
【大致经过】
【内心感受】
【经历多长时间】
回答者们才能给出相对准确的解答和建议

收到满意的回答后，也记得给回答者点赞哦～"
        />
        <div className="tags">
          <div>选择1-3个问题标签（必选）</div>
          <Skeleton paragraph={{ rows: 1 }} loading={tags.length === 0}>
            <div className="panel">
              {tags.map(t => (
                <div
                  key={t.id}
                  onClick={() => this.toggleActiveTag(t.id)}
                  className={activeTag && t.id === activeTag.id ? 'active' : ''}
                >
                  {t.name}
                </div>
              ))}
            </div>
          </Skeleton>
          {subTags ? (
            <React.Fragment>
              <div className="sub-panel">
                {subTags.map(st => (
                  <div
                    className={activeSubTag.find(t => t === st.id) ? 'active' : ''}
                    onClick={() => this.toggleActiveSubTag(st.id)}
                    key={st.id}
                  >
                    {st.name}
                  </div>
                ))}
              </div>
              <div>点击一次选中，再点一次取消</div>
            </React.Fragment>
          ) : null}
        </div>
        <div className="post-btn">
          <Button type="primary" onClick={this.handlePostAsk}>
            发布提问
          </Button>
        </div>
      </div>
    )
  }
}

const mapState = (state: IStore) => ({
  askTags:
    state['info/askTags'].response && state['info/askTags'].response.data
      ? state['info/askTags'].response.data
      : [],
  askPostRes: state['operation/addAsk']
})

export default connect(mapState)(AskPost)
