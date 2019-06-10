import React from 'react'
import { Menu, Tag, Spin, Empty } from 'antd'
import { ArticleTopic, ArticleProps } from '@types'
import { articleTopicMap } from '@utils/map'
import InfiniteScroll from 'react-infinite-scroller'

import './ArticleList.less'
import { getDate } from '@utils/moment'
import { NetworkStatus } from '@common/api/config'

interface ITopicBar {
  onSelectTopic: (topic: ArticleTopic) => void
  selectedTopic: ArticleTopic
}

interface IArticleListProps {
  list: ArticleProps[]
  loadData: (c: ArticleTopic, init?: boolean) => void
  status: NetworkStatus
  hasMore: boolean
  gotoArticlePost: (id: string) => void
}

interface IArticleListState {
  topic: ArticleTopic
  list: ArticleProps[]
}

function TopicBar(props: ITopicBar) {
  return (
    <Menu
      mode="horizontal"
      onClick={({ key }) => props.onSelectTopic(key as ArticleTopic)}
      selectedKeys={[props.selectedTopic]}
    >
      {Object.keys(articleTopicMap).map(topic => (
        <Menu.Item key={topic}>{articleTopicMap[topic]}</Menu.Item>
      ))}
    </Menu>
  )
}

export default class ArticleList extends React.Component<IArticleListProps, IArticleListState> {
  constructor(props: IArticleListProps) {
    super(props)
    this.state = {
      topic: 'all',
      list: []
    }
  }

  handleSelectTopic = (topic: ArticleTopic) => {
    if (topic === this.state.topic) {
      return
    }
    this.setState(
      {
        topic,
        list: []
      },
      () => this.props.loadData(topic, true)
    )
  }

  componentDidMount() {
    this.props.loadData('all', true)
  }

  componentDidUpdate(prevProps: IArticleListProps, prevState: IArticleListState) {
    if (prevProps.list !== this.props.list) {
      this.setState(prevState => ({
        list: prevState.list.concat(this.props.list)
      }))
    }
  }

  render() {
    const ArticleItem = (props: ArticleProps) => {
      const tags = props.tags === '' ? [] : props.tags.split(',')
      const excerpt = props.excerpt.length > 80 ? `${props.excerpt.slice(0, 80)}...` : props.excerpt
      return (
        <div className="article-item-wrapper">
          <article>
            <div className="content">
              <h2 className="title" onClick={() => this.props.gotoArticlePost(props.id.toString())}>
                {props.title}
              </h2>
              <p className="excerpt">{excerpt}</p>
              <div className="footer">
                <span className="author">{props.authorName}</span>
                <span className="date">{getDate(props.postTime)}</span>
                <span className="views">{props.readCount}阅读</span>
                <div className="tags">
                  {tags.map(t => (
                    <Tag key={t} color="blue">
                      #{t}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
            <div className="thumbnail">
              <img src={require('@images/thumbnail.jpeg')} alt="" />
            </div>
          </article>
        </div>
      )
    }

    const list = this.state.list
    const status = this.props.status
    const hasMore = this.props.hasMore && status !== 'loading'
    const loading = status === 'loading'
    const category = this.state.topic
    return (
      <div className="article-list">
        <TopicBar onSelectTopic={this.handleSelectTopic} selectedTopic={this.state.topic} />
        <div style={{ height: '560px', overflow: 'auto', position: 'relative' }}>
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={() => this.props.loadData(category)}
            hasMore={hasMore}
            useWindow={false}
          >
            {list.map(l => (
              <ArticleItem {...l} key={l.id} />
            ))}
            {loading && (
              <div className="loading">
                <Spin size="large" />
              </div>
            )}
            {status === 'success' && list.length === 0 && <Empty />}
          </InfiniteScroll>
        </div>
      </div>
    )
  }
}
