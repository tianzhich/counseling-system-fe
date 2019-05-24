import React from 'react'
import CommonAskList from '@features/common/component/CommonAskList'
import AskItem from '@features/ask/component/AskItem'
import { Switch, Divider } from 'antd'

import "./AskTab.less"

interface IAskTabProps {
  cmtList: AskItem[]
  postList: AskItem[]
}

interface IAskTabState {
  onPost: boolean
}

export default class AskTab extends React.Component<IAskTabProps, IAskTabState> {
  constructor(props: IAskTabProps) {
    super(props)
    this.state = {
      onPost: true
    }
  }

  toggleSwitch = (onPost: boolean) => {
    this.setState({
      onPost
    })
  }

  render() {
    const { onPost } = this.state
    const { cmtList, postList } = this.props
    const list = onPost ? postList : cmtList
    const llist = list ? list : []
    return (
      <div className="tab-ask">
        <Switch
          checkedChildren="我发表的"
          unCheckedChildren="我评论的"
          checked={onPost}
          onChange={this.toggleSwitch}
        />
        <Divider />
        <CommonAskList list={llist} />
      </div>
    )
  }
}
