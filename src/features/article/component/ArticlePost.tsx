import React, { ComponentProps } from 'react'
import { OtherAPI, NetworkStatus, NetworkErrorMsg } from '@common/api/config'
import { RouteComponentProps, Redirect } from 'react-router'
import { ArticleProps, ArticleComment } from '@features/common/types'
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
  Tooltip,
  Skeleton
} from 'antd'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'

import './ArticlePost.less'
import { topicMap, articleTopicMap } from '@utils/map'
import moment, { getDate } from '@utils/moment'
import { IStore } from '@common/storeConfig'
import { CommentProps } from 'antd/lib/comment'
import { avatarURL } from '@features/common/fakeData'
import Emitter from '@utils/events'

const TextArea = Input.TextArea

const CommentList = ({ comments }: { comments: CommentProps[] }) => (
  <List
    dataSource={comments}
    header={comments.length > 0 ? `${comments.length}个评论` : ''}
    itemLayout="horizontal"
    renderItem={(props: CommentProps) => <Comment {...props} />}
    locale={{ emptyText: '暂无评论, 写下你的第一条评论吧' }}
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
  auth: boolean
}

type ArticleCmtCounter = Pick<ArticleComment, 'id' | 'likeCount'>[]

interface IArticlePostState {
  data?: ArticleProps
  status?: NetworkStatus

  // comment
  cmtText: string
  ref?: CommentRef
  cmtSubmitting: boolean
  postedComments: ArticleComment[]
  likedCmt: ArticleComment['id'][]
  cmtCounter: ArticleCmtCounter

  // star, like
  isStar?: boolean
  isLike?: boolean
  likeCount?: number
}

class ArticlePost extends React.Component<IArticlePostProps, IArticlePostState> {
  cmtTextAreaRef: React.RefObject<any>
  constructor(props: IArticlePostProps) {
    super(props)
    this.state = {
      cmtSubmitting: false,
      cmtText: '',
      postedComments: [],
      likedCmt: [],
      cmtCounter: []
    }
    this.cmtTextAreaRef = React.createRef()
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

  toggleStarLikeArticle = (t: 'star' | 'like') => {
    if (!this.checkAuthBeforeOp()) {
      return
    }
    const key = t === 'like' ? 'isLike' : 'isStar'
    const val = !this.state[key]
    this.setState({
      ...this.state,
      [key]: val,
      likeCount:
        t === 'like'
          ? val
            ? this.state.likeCount + 1
            : this.state.likeCount - 1
          : this.state.likeCount
    })
    const { id } = this.state.data
    OtherAPI.ToggleStarLike(id, t, 'article')
  }

  toggleLikeComment = (id: number) => {
    if (!this.checkAuthBeforeOp()) {
      return
    }
    const { likedCmt, cmtCounter } = this.state
    let newLikedCmt: ArticleComment['id'][]

    const isLiked = likedCmt.indexOf(id) !== -1
    const newCounter = cmtCounter.map(cc =>
      cc.id === id ? { ...cc, likeCount: isLiked ? cc.likeCount - 1 : cc.likeCount + 1 } : cc
    )

    if (isLiked) {
      newLikedCmt = likedCmt.filter(c => c !== id)
    } else {
      newLikedCmt = [...likedCmt, id]
    }

    this.setState({
      likedCmt: newLikedCmt,
      cmtCounter: newCounter
    })
    OtherAPI.ToggleStarLike(id, 'like', 'article_comment')
  }

  handleReferComment = (refcmt: ArticleComment) => {
    if (!this.checkAuthBeforeOp()) {
      return
    }
    const text = (JSON.parse(refcmt.text) as CommentTextObj).text
    this.setState({
      ref: {
        id: refcmt.id,
        text,
        userName: refcmt.authorName,
        uID: refcmt.authorID
      }
    })
    this.focusCmtInput()
  }

  renderCommentActions = (c: ArticleComment) => {
    const isLike = this.state.likedCmt.indexOf(c.id) !== -1
    const findCounter = this.state.cmtCounter.find(cc => cc.id === c.id)
    const likeCount = findCounter ? findCounter.likeCount : 0
    const actions = [
      <React.Fragment>
        <Icon
          type="like"
          theme={isLike ? 'filled' : 'outlined'}
          onClick={() => this.toggleLikeComment(c.id)}
        />
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{likeCount}</span>
      </React.Fragment>,
      <span onClick={() => this.handleReferComment(c)}># 引用</span>
    ]
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
          const newCmtID: number = data.data
          const newComment: ArticleComment = {
            id: newCmtID,
            text: JSON.stringify(text),
            postTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            authorID: userID,
            authorName: userName,
            isLike: false,
            likeCount: 0
          }
          this.setState({
            postedComments: [...this.state.postedComments, newComment],
            cmtSubmitting: false,
            cmtText: '',
            ref: undefined,
            cmtCounter: [...this.state.cmtCounter, { id: newCmtID, likeCount: 0 }]
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

  checkAuthBeforeOp = () => {
    const pass = this.props.auth
    if (!pass) {
      Emitter.emit('openSigninModal')
      return false
    }
    return true
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

  resetCommentRef = () => {
    this.setState({
      ref: undefined
    })
  }

  focusCmtInput = () => {
    this.cmtTextAreaRef.current.focus()
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
          const { isRead, isLike, isStar, id, comment, likeCount } = (data.data) as ArticleProps
          const wrappedComment = comment ? comment : []
          // 文章设为已读
          if (isRead === false) {
            OtherAPI.CountReadByID(id, 'article')
          }
          // handle star and like, comments
          this.setState({
            isLike: isLike && isLike,
            likeCount,
            isStar: isStar && isStar,
            likedCmt: wrappedComment.filter(c => c.isLike && c.isLike).map(c => c.id),
            cmtCounter: wrappedComment.map(c => ({ id: c.id, likeCount: c.likeCount }))
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
      return (
        <div className="pcs-article-detail">
          <Skeleton active></Skeleton>
        </div>
      )
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
    const { cmtSubmitting, cmtText, postedComments, isLike, isStar, likeCount } = this.state
    // comment list
    const srcCmts: CommentProps[] = data.comment
      ? data.comment.map(c => this.getAntdComment(c))
      : []
    const postedCmts: CommentProps[] = postedComments.map(c => this.getAntdComment(c))
    const commentList = [...srcCmts, ...postedCmts]

    const auth = this.props.auth

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
              {likeCount}赞
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
              {data.readCount}阅读
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
            <div className="like" onClick={() => this.toggleStarLikeArticle('like')}>
              <Icon type="like" theme={isLike ? 'filled' : 'outlined'} />
              <br />
              {isLike ? '取消' : '点赞'}
            </div>
            <div className="collection" onClick={() => this.toggleStarLikeArticle('star')}>
              <Icon type="star" theme={isStar ? 'filled' : 'outlined'} />
              <br />
              {isStar ? '取消' : '收藏'}
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
                    <TextArea rows={4} onChange={this.handleCommentChange} value={cmtText} ref={this.cmtTextAreaRef} />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      loading={cmtSubmitting}
                      onClick={this.handleSubmitComment}
                      type="primary"
                      disabled={!auth}
                    >
                      提交回复
                    </Button>
                    {!auth ? <span className="prompt">请登录以提交回复</span> : null}
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
  auth: state['@global'].auth.isAuth,
  userID: state['@global'].user.id,
  userName: state['@global'].user.userName
})

export default connect(mapState)(ArticlePost)
