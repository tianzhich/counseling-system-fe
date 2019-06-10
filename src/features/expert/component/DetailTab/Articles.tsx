import React from 'react'
import CommonArticleList from '@features/common/component/CommonArticleList'
import { ArticleProps } from '@features/common/types'

interface IArticlesProps {
  list: ArticleProps[]
}

interface IArticlesState {}

export default class Articles extends React.Component<IArticlesProps, IArticlesState> {
  constructor(props: IArticlesProps) {
    super(props)
    this.state = {}
  }

  render() {
    const { list } = this.props
    return <CommonArticleList list={list} />
  }
}
