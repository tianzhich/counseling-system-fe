import React from 'react'
import CommonArticleList from '@features/common/component/CommonArticleList';
import { Switch, Divider } from 'antd';
import { ArticleProps } from '@features/common/types';

import "./ArticleTab.less"

interface IArticleTabProps {
  cmtList: ArticleProps[]
}

interface IArticleTabState {}

export default class ArticleTab extends React.Component<IArticleTabProps, IArticleTabState> {
  constructor(props: IArticleTabProps) {
    super(props)
    this.state = {
      onPost: true
    }
  }

  render() {
    const {cmtList} = this.props
    const list = cmtList ? cmtList : []
    return (
      <div className="tab-article">
        <h3>我评论的</h3>
        <Divider />
        <CommonArticleList list={list} />
      </div>
    )
  }
}
