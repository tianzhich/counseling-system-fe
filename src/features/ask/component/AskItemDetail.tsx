import React from 'react'
import { avatarURL, anonyURL } from '@features/common/fakeData'
import { Icon, Comment, Avatar, message, Empty, Button, Modal, Input, Tooltip } from 'antd'
import './AskItemDetail.less'
import {
  OtherAPI,
  IApiResponse,
  NetworkStatus,
  NetworkErrorMsg,
  IApiResult
} from '@common/api/config'
import { AskItemProps, AskComment } from '@features/common/types'
import { RouteComponentProps, Redirect } from 'react-router'
import Loading from '@features/common/component/Loading'
import moment from '@utils/moment'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { IStore } from '@common/storeConfig'
import { platform } from 'os'
import { Dispatch } from 'redux'
import { fetchAction } from '@common/api/action'
import { Link } from 'react-router-dom';

type MockAskCmt = AskComment & { replyToID?: number }

interface IAskItemDetailProps {
  userID: number
  userName: string
  dispatch: Dispatch
  addCmtRes: IApiResult
}

interface IAskItemDetailState {
  data?: AskItemProps
  status?: NetworkStatus
  starCount?: number
  likeCount?: number
  answerCount?: number
  isStar?: boolean
  isLike?: boolean
  activeAnswer?: MockAskCmt // 当前待编辑评论
}

type Props = IAskItemDetailProps & RouteComponentProps<{ id: string }>

class AskItemDetail extends React.Component<Props, IAskItemDetailState> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  handleCmtInput = (val: string) => {
    const activeAnswer = this.state.activeAnswer
    const refID = activeAnswer.id
    if (refID === -1) {
      this.setState({
        activeAnswer: {
          ...activeAnswer,
          text: val
        }
      })
    } else {
      this.setState({
        activeAnswer: {
          ...activeAnswer,
          subComments: [
            {
              ...activeAnswer.subComments[0],
              text: val
            }
          ]
        }
      })
    }
  }

  openCmtModal = (refID?: number, replyToID?: number, replyToName?: string) => {
    const { userName, userID } = this.props
    if (replyToID === userID) {
      message.warning('你不能回复自己的回答')
      return
    }
    let activeAnswer: MockAskCmt
    // mock comment
    if (refID && replyToID) {
      activeAnswer = {
        id: refID,
        text: '',
        authorId: -1,
        authorName: '',
        time: '',
        replyToID,
        subComments: [
          {
            id: -1,
            authorId: userID,
            authorName: userName,
            text: '',
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            replyTo: replyToName
          }
        ]
      }
    } else {
      activeAnswer = {
        id: -1,
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        authorName: userName,
        text: '',
        authorId: userID
      }
    }

    this.setState({
      activeAnswer
    })
  }

  closeCmtModal = () => {
    this.setState({
      activeAnswer: undefined
    })
  }

  toggleStarLike = (t: 'like' | 'star') => {
    const { isLike, isStar, starCount, likeCount, data } = this.state
    const id = data.id
    if (t === 'star') {
      this.setState({
        isStar: !isStar,
        starCount: isStar ? starCount - 1 : starCount + 1
      })
      OtherAPI.ToggleStarLike(id, 'star', 'ask')
    } else {
      this.setState({
        isLike: !isLike,
        likeCount: isLike ? likeCount - 1 : likeCount + 1
      })
      OtherAPI.ToggleStarLike(id, 'like', 'ask')
    }
  }

  renderCommentList = () => {
    let list: AskComment[] = this.state.data.askComment ? this.state.data.askComment : []
    if (list.length === 0) {
      return <div className="extra-text">暂无回答，点击我来回答，写下你的第一条回答吧！</div>
    }

    return (
      <React.Fragment>
        {list.map(cmt => {
          const subCmt = cmt.subComments ? cmt.subComments : []
          return (
            <div className="comment" key={cmt.id}>
              <Comment
                actions={[
                  <span onClick={() => this.openCmtModal(cmt.id, cmt.authorId, cmt.authorName)}>
                    回复
                  </span>
                ]}
                author={<a>{cmt.authorName}</a>}
                avatar={<Avatar src={avatarURL} alt={cmt.authorName} />}
                content={<p>{cmt.text}</p>}
                datetime={
                  <Tooltip title={moment(cmt.time).format('YYYY-MM-DD HH:mm:ss')}>
                    <span>{moment(cmt.time).fromNow()}</span>
                  </Tooltip>
                }
              >
                {subCmt.length > 0
                  ? subCmt.map(subCmt => (
                      <div className="comment" key={subCmt.id}>
                        <Comment
                          actions={[
                            <span
                              onClick={() =>
                                this.openCmtModal(cmt.id, subCmt.authorId, subCmt.authorName)
                              }
                            >
                              回复
                            </span>
                          ]}
                          author={<a>{subCmt.authorName}</a>}
                          avatar={<Avatar src={avatarURL} alt={subCmt.authorName} />}
                          content={
                            <p>
                              回复{subCmt.replyTo}: {subCmt.text}
                            </p>
                          }
                          datetime={
                            <Tooltip title={moment(subCmt.time).format('YYYY-MM-DD HH:mm:ss')}>
                              <span>{moment(subCmt.time).fromNow()}</span>
                            </Tooltip>
                          }
                        />
                      </div>
                    ))
                  : null}
              </Comment>
            </div>
          )
        })}
      </React.Fragment>
    )
  }

  handleAddCmt = () => {
    const activeAnswer = this.state.activeAnswer
    const askID = this.state.data.id
    let data: any
    if (activeAnswer.id === -1) {
      data = {
        text: activeAnswer.text,
        author: activeAnswer.authorId,
        askID
      }
    } else {
      data = {
        text: activeAnswer.subComments[0].text,
        author: activeAnswer.subComments[0].authorId,
        askID,
        replyTo: activeAnswer.replyToID,
        ref: activeAnswer.id
      }
    }
    this.props.dispatch(fetchAction('operation/addAskComment', { data }))
  }

  componentDidUpdate(prevProps: Props) {
    const prevAddCmtRes = prevProps.addCmtRes
    const addCmtRes = this.props.addCmtRes
    // 新增评论
    if (prevAddCmtRes.status === 'loading') {
      const resp = addCmtRes.response
      if (addCmtRes.status === 'success' && resp && resp.code === 1) {
        let newCmt = { ...this.state.activeAnswer }
        const prevCmts = this.state.data.askComment
        let newCmts: AskComment[]
        if (newCmt.id === -1) {
          newCmt.id = resp.data
          newCmts = [...prevCmts, newCmt]
        } else {
          newCmt.subComments[0].id = resp.data
          newCmts = prevCmts.map(cmt =>
            cmt.id === newCmt.id
              ? { ...cmt, subComments: [...cmt.subComments, ...newCmt.subComments] }
              : cmt
          )
        }

        this.setState(
          {
            data: {
              ...this.state.data,
              askComment: newCmts
            }
          },
          this.closeCmtModal
        )
        message.success('评论成功')
      } else if (addCmtRes.status === 'failed') {
        message.error(NetworkErrorMsg)
      } else {
        message.error(resp.message)
      }
    }
  }

  componentDidMount() {
    const askID = this.props.match.params.id
    this.setState({
      status: 'loading'
    })
    OtherAPI.GetAskByID(askID)
      .then(res => {
        const resp: IApiResponse = res.data
        if (resp.code === 1) {
          const data: AskItemProps = resp.data
          const userID = this.props.userID
          const { starCount, likeCount, isStar, isLike, answerCount, isRead } = data
          this.setState({
            data,
            starCount,
            likeCount,
            isStar,
            isLike,
            answerCount
          })
          if (!isRead && userID !== -1) {
            OtherAPI.CountReadByID(data.id, 'ask')
          }
        }
        this.setState({
          status: 'success'
        })
      })
      .catch(() => {
        this.setState({
          status: 'failed'
        })
        message.error(NetworkErrorMsg)
      })
  }

  render() {
    const { status, data } = this.state
    // 非法查询ID
    if (status === 'success' && !data) {
      return <Redirect to="/ask" />
    }
    // 加载失败
    if (status === 'failed') {
      return <Empty />
    }
    // 初始加载
    if (status === 'loading' || !data) {
      return <Loading />
    }

    const { isAnony, title, content, answerCount, time, readCount, tags } = data
    const { starCount, likeCount, isLike, isStar, activeAnswer } = this.state
    const postTime = moment(time).fromNow()
    const tagsArr = tags.map(t => t.subTags[0])

    // modal
    const cmtModalVisible = activeAnswer !== undefined
    const holderStr = activeAnswer
      ? activeAnswer.id === -1
        ? ''
        : `回复${activeAnswer.subComments[0].replyTo}`
      : ''

    return (
      <div className="ask-item-detail">
        <div className="ask">
          <div className="avatar">
            <img src={isAnony ? anonyURL : avatarURL} alt="" width="50px" />
          </div>
          <div className="content">
            <div className="title">
              <span>{title}</span>
              <span>{answerCount}个回答</span>
            </div>
            <div className="desc">
              <span>{postTime}</span>
              <span>
                <Icon type="eye" /> {readCount}阅读
              </span>
            </div>
            <p>{content}</p>
            <div className="tags">
              {tagsArr.map(t => (
                <span key={t.id}>{t.name}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="actions">
          <div
            className={classnames('item', { active: isLike })}
            onClick={() => this.toggleStarLike('like')}
          >
            <span>
              <Icon type="smile" />
              {isLike ? '取消' : '给TA'}抱抱 <br />
            </span>
            <span>{likeCount}个抱抱</span>
          </div>
          <div
            className={classnames('item', { active: isStar })}
            onClick={() => this.toggleStarLike('star')}
          >
            <span>
              <Icon type="star" />
              {isStar ? '取消收藏' : '收藏问题'} <br />
            </span>
            <span>{starCount}个收藏</span>
          </div>
          <div className="item" onClick={() => this.openCmtModal()}>
            <span>
              <Icon type="edit" />
              我来回答 <br />
            </span>
            <span>{answerCount}个回答</span>
          </div>
        </div>
        <div className="comment-list">{this.renderCommentList()}</div>
        <Link to="/ask/post" className="post">
          <Button type="primary">我要提问</Button>
        </Link>
        <Modal
          visible={cmtModalVisible}
          onCancel={this.closeCmtModal}
          onOk={this.handleAddCmt}
          closable={false}
          className="askcmt-modal"
          destroyOnClose={true}
        >
          <Input.TextArea
            placeholder={holderStr}
            onChange={e => this.handleCmtInput(e.target.value)}
          />
        </Modal>
      </div>
    )
  }
}

const mapState = (state: IStore) => ({
  userID: state['@global'].user.id,
  userName: state['@global'].user.userName,
  addCmtRes: state['operation/addAskComment']
})

export default connect(mapState)(AskItemDetail)
