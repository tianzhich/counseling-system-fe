import React, { ComponentProps } from 'react'
import { OtherAPI, NetworkStatus, NetworkErrorMsg } from '@common/api/config'
import { RouteComponentProps, Redirect } from 'react-router'
import { Article, ArticleComment } from '@features/common/types'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { push } from 'connected-react-router'
import {
  message,
  Empty,
  Spin,
  Tag,
  Icon,
  Divider,
  Comment,
  Avatar,
  Form,
  Input,
  Button,
  List,
  Tooltip
} from 'antd'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'

import './ArticlePost.less'
import { topicMap, articleTopicMap } from '@utils/map'
import moment, { getDate } from '@utils/moment'
import { IStore } from '@common/storeConfig'
import { CommentProps } from 'antd/lib/comment'
import { avatarURL } from '@features/common/fakeData'

const TextArea = Input.TextArea

const CommentList = ({ comments }: { comments: CommentProps[] }) => (
  <List
    dataSource={comments}
    header={comments.length > 0 ? `${comments.length}个评论` : ''}
    itemLayout="horizontal"
    renderItem={(props: CommentProps) => <Comment {...props} />}
    locale={{ emptyText: '暂无评论, 写下你的第一评论吧' }}
  />
)

interface CommentPostForm {
  text: string
  aID: number
  refID?: number
  authorID: number
}

interface CommentRef {
  id: number
  text: string
  userName: string
  uID: number
}

interface CommentTextObj {
  text: string
  refText?: string
  refUser?: string
}

interface IArticlePostProps extends RouteComponentProps<{ id?: string }> {
  dispatch: Dispatch
  userID: number
  userName: string
}

interface IArticlePostState {
  data?: Article
  status?: NetworkStatus

  // comment
  cmtText: string
  ref?: CommentRef
  cmtSubmitting: boolean
  postedComments: ArticleComment[]
}

class ArticlePost extends React.Component<IArticlePostProps, IArticlePostState> {
  constructor(props: IArticlePostProps) {
    super(props)
    this.state = {
      cmtSubmitting: false,
      cmtText: '',
      postedComments: []
    }
  }

  isIDValidate = () => {
    const id = Number(this.props.match.params.id)
    return !isNaN(id) && id > 0
  }

  getContentHtml = (deltaOps: any) => {
    const qc = new QuillDeltaToHtmlConverter(deltaOps, {})
    const html = qc.convert()
    return html
  }

  handleLikeComment = () => {}

  handleReferComment = (refcmt: ArticleComment) => {
    const text = (JSON.parse(refcmt.text) as CommentTextObj).text
    this.setState({
      ref: {
        id: refcmt.id,
        text,
        userName: refcmt.authorName,
        uID: refcmt.authorID
      }
    })
  }

  renderCommentActions = (c: ArticleComment) => {
    const actions = [<span onClick={() => this.handleReferComment(c)}># 引用</span>]
    return actions
  }

  handleSubmitComment = () => {
    const { cmtText, ref } = this.state
    const article = this.state.data
    const aID = article.id
    const { userID, userName } = this.props

    if (cmtText.trim() === '') {
      return
    }

    const text: CommentTextObj = {
      text: cmtText,
      refText: ref ? ref.text : undefined,
      refUser: ref ? ref.userName : undefined
    }
    const data: CommentPostForm = {
      refID: ref ? ref.id : undefined,
      text: JSON.stringify(text),
      aID,
      authorID: userID
    }

    // post
    this.setState({
      cmtSubmitting: true
    })
    OtherAPI.AddArticleComment(data)
      .then(({ data }) => {
        if (data.code === 1) {
          const newComment: ArticleComment = {
            id: data.data,
            text: JSON.stringify(text),
            postTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            authorID: userID,
            authorName: userName
          }
          this.setState({
            postedComments: [...this.state.postedComments, newComment],
            cmtSubmitting: false,
            cmtText: '',
            ref: undefined
          })
        } else {
          this.setState({
            cmtSubmitting: false
          })
          message.error(data.message)
        }
      })
      .catch(err => {
        this.setState({
          cmtSubmitting: false
        })
        message.error(NetworkErrorMsg)
      })
  }

  handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      cmtText: e.target.value
    })
  }

  getAntdComment = (c: ArticleComment) => {
    const text: CommentTextObj = JSON.parse(c.text)
    return {
      content: (
        <div className="comment-ref">
          {text.refUser ? (
            <blockquote>
              <pre>引用{text.refUser}的发言：</pre>
              {text.refText}
            </blockquote>
          ) : null}
          {text.text}
        </div>
      ),
      author: c.authorName,
      avatar: avatarURL,
      datetime: moment(c.postTime).fromNow(),
      actions: this.renderCommentActions(c)
    }
  }

  handleCommentRefChange = () => {}

  resetCommentRef = () => {
    this.setState({
      ref: undefined
    })
  }

  componentDidMount() {
    if (this.isIDValidate()) {
      const id = this.props.match.params.id
      this.setState({
        status: 'loading'
      })
      OtherAPI.GetArticleByID(id)
        .then(({ data }) => {
          if (data.code === 0) {
            this.props.dispatch(push('/article'))
            return
          }
          this.setState({
            data: data.data,
            status: 'success'
          })
        })
        .catch(err => {
          this.setState({
            status: 'failed'
          })
          message.error('加载失败，请稍后重试')
        })
    }
  }

  render() {
    const status = this.state.status
    if (!this.isIDValidate()) {
      return <Redirect to="/article" />
    }

    if (!status || status === 'loading') {
      return <Spin />
    }
    if (status === 'failed') {
      return <Empty />
    }

    const data = this.state.data
    const deltaOps = JSON.parse(data.content).ops
    const ctntHtml = this.getContentHtml(deltaOps)
    const tags = data.tags === '' ? [] : data.tags.split(',')
    const refCmt = this.state.ref

    // comment post
    const { cmtSubmitting, cmtText, postedComments } = this.state
    // comment list
    const srcCmts: CommentProps[] = data.comment
      ? data.comment.map(c => this.getAntdComment(c))
      : []
    const postedCmts: CommentProps[] = postedComments.map(c => this.getAntdComment(c))
    const commentList = [...srcCmts, ...postedCmts]

    return (
      <div className="pcs-article-detail">
        <article>
          <div className="category">{articleTopicMap[data.category]}</div>
          <h1 className="title">{data.title}</h1>
          <div className="tags">
            {tags.map(t => (
              <Tag color="blue" key={t}>
                {t}
              </Tag>
            ))}
          </div>
          <div className="infos">
            <div>
              <span>发布时间：</span>
              {getDate(data.postTime)}
            </div>
            <div>
              <span>
                <Icon type="like" />
              </span>
              {200}赞
            </div>
            <div>
              <span>
                <Icon type="message" />
              </span>
              {commentList.length}评论
            </div>
            <div>
              <span>
                <Icon type="eye" />
              </span>
              {2015}阅读
            </div>
          </div>
          <div>
            <img src={data.cover} alt="" />
          </div>
          <div className="content" dangerouslySetInnerHTML={{ __html: ctntHtml }} />
          <div className="author">
            <div>文：{data.authorName}</div>
          </div>
          <div className="operation">
            <div className="like">
              <Icon type="like" />
              <br />
              点赞
            </div>
            <div className="collection">
              <Icon type="star" />
              <br />
              收藏
            </div>
          </div>
          {commentList.length === 0 ? <Divider /> : null}
          <div className="comment">
            <CommentList comments={commentList} />
            <Comment
              avatar={
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  alt="Han Solo"
                />
              }
              content={
                <div>
                  {refCmt ? (
                    <div className="comment-ref">
                      <blockquote>
                        <pre>
                          引用{refCmt.userName}的发言：
                          <span className="remove" onClick={this.resetCommentRef}>
                            {' '}
                            # 清除引用
                          </span>
                        </pre>
                        {refCmt.text}
                      </blockquote>
                    </div>
                  ) : null}
                  <Form.Item>
                    <TextArea rows={4} onChange={this.handleCommentChange} value={cmtText} />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      loading={cmtSubmitting}
                      onClick={this.handleSubmitComment}
                      type="primary"
                    >
                      提交回复
                    </Button>
                  </Form.Item>
                </div>
              }
            />
          </div>
        </article>
      </div>
    )
  }
}

const mapState = (state: IStore) => ({
  userID: state['@global'].user.id,
  userName: state['@global'].user.userName
})

export default connect(mapState)(ArticlePost)
