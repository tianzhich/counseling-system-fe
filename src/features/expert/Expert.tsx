import React from 'react'
import { RouteComponentProps, Redirect } from 'react-router'
import Header from './component/Header'

import './Expert.less'
import { connect } from 'react-redux'
import { IApiStore } from '@common/api/reducer'
import { Counselor } from '@features/common/types'
import { ApiKey, NetworkStatus } from '@common/api/config'
import { Dispatch } from 'redux'
import { fetchAction } from '@common/api/action'
import { Spin, Alert, Empty, Affix, Drawer, Icon } from 'antd'
import CounselorDetail from './component/CounselorDetail'
import FloatCard from './component/FloatCard'
import Emitter from '@utils/events'
import { IStore } from '@common/storeConfig'
import Loading from '@features/common/component/Loading'

const cslInfoActionKey: ApiKey = 'query/counselor'
const authKey: ApiKey = 'oauth/auth'

interface IExpertProps extends RouteComponentProps<{ expertId: string }> {
  counselor: Counselor
  dispatch: Dispatch
  status: NetworkStatus
  isAuth: boolean
}

interface IExpertState {
  cardVisible: boolean
}

/**
 * Expert(访客视角)
 */
class Expert extends React.Component<IExpertProps, IExpertState> {
  constructor(props: IExpertProps) {
    super(props)
    this.state = {
      cardVisible: false
    }
  }

  componentDidMount() {
    const id = this.props.match.params.expertId
    this.props.dispatch(fetchAction('query/counselor', { params: { id } }))
  }

  toggleDrawer = () => {
    this.setState({
      cardVisible: !this.state.cardVisible
    })
  }

  closeDrawer = () => {
    this.setState({
      cardVisible: false
    })
  }

  handleAppoint = () => {
    const counselor = this.props.counselor
    this.closeDrawer()
    if (!this.props.isAuth) {
      Emitter.emit('openSigninModal')
    } else {
      Emitter.emit('openAppointMntModal', { counselor })
    }
  }

  handleLeaveMessage = () => {
    const counselor = this.props.counselor
    const receiverId = counselor.uid
    const receiverName = counselor.name

    Emitter.emit('openMessageModal', { receiverId, receiverName })
  }

  render() {
    const { status, counselor } = this.props
    if (!status || status === 'loading') {
      return <Loading />
    } else if (status === 'failed') {
      return <Empty description="加载失败，请稍后重试" />
    } else if (status === 'success' && !counselor) {
      return <Redirect to="/" />
    }

    return (
      <div className="pcs-expert">
        <Header {...counselor} onLeaveMessage={this.handleLeaveMessage} />
        <CounselorDetail counselor={counselor} />
        <Affix
          offsetTop={100}
          style={{ position: 'absolute', top: '450px', right: '100px' }}
          className="float-card-wrapper"
        >
          <FloatCard
            cid={counselor.id}
            audioPrice={counselor.audioPrice}
            videoPrice={counselor.videoPrice}
            ftfPrice={counselor.ftfPrice}
            onAppoint={this.handleAppoint}
          />
        </Affix>
        <div className="drawer-action" onClick={this.toggleDrawer}>
          <Icon type="caret-left" />
        </div>
        <Drawer
          placement="right"
          onClose={this.closeDrawer}
          visible={this.state.cardVisible}
          getContainer=".pcs-expert"
          width={400}
        >
          <FloatCard
            cid={counselor.id}
            audioPrice={counselor.audioPrice}
            videoPrice={counselor.videoPrice}
            ftfPrice={counselor.ftfPrice}
            onAppoint={this.handleAppoint}
          />
        </Drawer>
      </div>
    )
  }
}

const mapState = (state: IStore) => ({
  isAuth: state['@global'].auth.isAuth,
  counselor: state[cslInfoActionKey].response ? state[cslInfoActionKey].response.data : null,
  status: state[cslInfoActionKey].status
})

export default connect(mapState)(Expert)
