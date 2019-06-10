import React from 'react'
import AskList, { AskListType } from './component/AskList'
import './Ask.less'
import Sider from './component/Sider'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { push } from 'connected-react-router'
import { IStore } from '@common/storeConfig'
import Emitter from '@utils/events'
import { fetchAction } from '@common/api/action'
import { AskItemProps } from '@features/common/types'
import { NetworkStatus } from '@common/api/config'

interface IAskProps {
  dispatch: Dispatch
  isLoggin: boolean
  askList: AskItemProps[]
  listStatus: NetworkStatus
  cmtCount: number
  postCount: number
}

interface IAskState {
  listType: AskListType
  featured: string
}

class Ask extends React.Component<IAskProps, IAskState> {
  constructor(props: IAskProps) {
    super(props)
    this.state = {
      listType: 'answerFirst',
      featured: ''
    }
  }

  handleGotoAskPost = () => {
    const isLoggin = this.props.isLoggin
    if (!isLoggin) {
      Emitter.emit('openSigninModal', { ref: '/ask/post' })
      return
    }
    this.props.dispatch(push('./ask/post'))
  }

  handleToggleListType = (type: AskListType) => {
    const prevType = this.state.listType
    if (prevType === type) {
      return
    }

    this.setState(
      {
        listType: type
      },
      this.fetchAskList
    )
  }

  fetchAskList = () => {
    const { listType } = this.state
    const isAnswer = listType === 'answerFirst'
    const featured = listType === 'featured'
    const params = {
      isAnswer,
      featured
    }
    this.props.dispatch(fetchAction('query/askList', { params }))
  }

  componentDidMount() {
    this.fetchAskList()
  }

  toggleFeatured = (id: string) => {
    this.setState(prevState => ({
      featured: prevState.featured === id ? '' : id
    }))
  }

  render() {
    const { listType, featured } = this.state
    const { askList, listStatus, isLoggin, postCount, cmtCount } = this.props
    return (
      <div className="ask">
        <AskList
          type={listType}
          onToggleType={this.handleToggleListType}
          list={askList}
          loadingStatus={listStatus}
          featued={featured}
        />
        <Sider
          onToggleFeatured={this.toggleFeatured}
          featured={featured}
          isLoggin={isLoggin}
          cmtCount={cmtCount}
          postCount={postCount}
        />
      </div>
    )
  }
}

const mapState = (state: IStore) => ({
  isLoggin: state['@global'].auth.isAuth,
  askList:
    state['query/askList'].response && state['query/askList'].response.data
      ? state['query/askList'].response.data
      : [],
  listStatus: state['query/askList'].status,
  cmtCount:
    state['info/pre'].response && state['info/pre'].response.data
      ? state['info/pre'].response.data.askCmtCount
      : 0,
  postCount:
    state['info/pre'].response && state['info/pre'].response.data
      ? state['info/pre'].response.data.askPostCount
      : 0
})

export default connect(mapState)(Ask)
