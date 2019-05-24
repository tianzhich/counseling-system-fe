import React from 'react'
import CommonArticleList from '@features/common/component/CommonArticleList';
import { Switch, Divider } from 'antd';
import { ArticleProps } from '@features/common/types';

import "./ArticleTab.less"

interface IArticleTabProps {
  cmtList: ArticleProps[]
  postList: ArticleProps[]
}

interface IArticleTabState {
  onPost: boolean
}

export default class ArticleTab extends React.Component<IArticleTabProps, IArticleTabState> {
  constructor(props: IArticleTabProps) {
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
    const {onPost} = this.state
    const {cmtList, postList} = this.props
    const list = onPost ? postList : cmtList
    const llist = list ? list : []
    return (
      <div className="tab-article">
        <Switch
          checkedChildren="我发表的"
          unCheckedChildren="我评论的"
          checked={onPost}
          onChange={this.toggleSwitch}
        />
        <Divider />
        <CommonArticleList list={llist} />
      </div>
    )
  }
}
