import React from 'react'
import { OtherAPI, NetworkStatus } from '@common/api/config'
import { RouteComponentProps, Redirect } from 'react-router'
import { Article } from '@features/common/types'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { push } from 'connected-react-router'
import { message, Empty, Spin, Tag, Icon, Divider, Comment, Avatar, Form, Input, Button } from 'antd'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'

import './ArticlePost.less'
import { topicMap, articleTopicMap } from '@utils/map'
import { getDate } from '@utils/moment'

const TextArea = Input.TextArea

const Editor = ({
  onChange, onSubmit, submitting, value,
}: any) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        提交回复
      </Button>
    </Form.Item>
  </div>
);

interface IArticlePostProps extends RouteComponentProps<{ id?: string }> {
  dispatch: Dispatch
}

interface IArticlePostState {
  data?: Article
  status?: NetworkStatus


}

class ArticlePost extends React.Component<IArticlePostProps, IArticlePostState> {
  constructor(props: IArticlePostProps) {
    super(props)
    this.state = {}
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

    return (
      <div className="pcs-article-detail">
        <article>
          <div className="category">{articleTopicMap[data.category]}</div>
          <h2 className="title">{data.title}</h2>
          <div className="tags">
            {tags.map(t => (
              <Tag color="blue" key={t}>
                {t}
              </Tag>
            ))}
          </div>
          <div className="infos">
            <span>发布时间：</span>
            {getDate(data.postTime)}
            <span>
              <Icon type="like" />
            </span>
            {200}赞
            <span>
              <Icon type="message" />
            </span>
            {3}评论
            <span>
              <Icon type="eye" />
            </span>
            {2015}阅读
          </div>
          <div>
            <img src={data.cover} alt="" />
          </div>
          <div className="author">
            <div>文：{data.authorName}</div>
          </div>
          <div className="content" dangerouslySetInnerHTML={{ __html: ctntHtml }} />
          <div className="operation">
            <div className="like">
              <Icon type="like" />
            </div>
            <div className="collection">
              <Icon type="star" />
            </div>
          </div>
          <Divider />
          <div className="comment">
            <Comment
              avatar={
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  alt="Han Solo"
                />
              }
              content={
                <Editor
                  // onChange={this.handleChange}
                  // onSubmit={this.handleSubmit}
                  // submitting={submitting}
                  // value={value}
                />
              }
            />
          </div>
        </article>
      </div>
    )
  }
}

export default connect()(ArticlePost)
