import React from 'react'
import { OtherAPI, NetworkStatus } from '@common/api/config'
import { RouteComponentProps, Redirect } from 'react-router'
import { Article } from '@features/common/types'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { push } from 'connected-react-router'
import { message, Empty, Spin } from 'antd'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'

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

    return (
      <div className="pcs-article-detail">
        <article dangerouslySetInnerHTML={{ __html: ctntHtml }} />
      </div>
    )
  }
}

export default connect()(ArticlePost)
