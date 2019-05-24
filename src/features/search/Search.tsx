import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Icon, List, Avatar, Spin, Empty, Input, Tag } from 'antd'

import './Search.less'
import { Dispatch } from 'redux'
import { fetchAction } from '@common/api/action'
import { IStore } from '@common/storeConfig'
import AskItem from '@features/ask/component/AskItem'
import { ArticleProps, Counselor, AskItemProps } from '@features/common/types'
import { NetworkStatus } from '@common/api/config'
import { fakeCoverURL, avatarURL } from '@features/common/fakeData'
import { Link } from 'react-router-dom'
import CommonAskList from '@features/common/component/CommonAskList';
import CommonArticleList from '@features/common/component/CommonArticleList';

const typeBarOption = [
  {
    id: 'article',
    name: '文章',
    icon: <Icon type="file-search" />
  },
  {
    id: 'ask',
    name: '问答',
    icon: <Icon type="team" />
  },
  {
    id: 'counselor',
    name: '咨询师',
    icon: <Icon type="smile" />
  }
]

const listData = []
for (let i = 0; i < 23; i++) {
  listData.push({
    href: 'http://ant.design',
    title: `ant design part ${i}`,
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description:
      'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
  })
}

const IconText = (props: { type: string; text: string; onClick?: () => void }) => (
  <span onClick={props.onClick}>
    <Icon type={props.type} style={{ marginRight: 8 }} />
    {props.text}
  </span>
)

type QueryType = 'ask' | 'article' | 'counselor'
type SearchList = AskItem[] | ArticleProps[] | Counselor[]

interface ISearchProps {
  dispatch: Dispatch
  list: SearchList
  status: NetworkStatus
}

interface ISearchState {
  keyword: string
  type: QueryType
  onLoading: boolean
}

type Props = ISearchProps & RouteComponentProps<{}, undefined, { keyword: string }>

class Search extends React.Component<Props, ISearchState> {
  constructor(props: Props) {
    super(props)
    this.state = {
      keyword: '',
      type: 'article',
      onLoading: true
    }
  }

  renderSearchList = () => {
    const { type, onLoading } = this.state
    const { list, status } = this.props

    if (status === 'loading' || onLoading) {
      return <Spin size="large" />
    } else if ((status === 'success' && !list) || status === 'failed') {
      return <Empty />
    } else if (!list) {
      return null
    }

    switch (type) {
      case 'article': {
        return (
          <CommonArticleList list={list as ArticleProps[]} />
        )
      }

      case 'ask': {
        return (
          <CommonAskList list={list as AskItem[]} />
        )
      }

      case 'counselor': {
        return (
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              pageSize: 3
            }}
            dataSource={list}
            renderItem={(item: Counselor) => {
              const major = item.topic.id === 4 ? item.topicOther : item.topic.name
              return (
                <List.Item
                  key={item.id}
                  actions={[
                    <Link to={`/expert/${item.id}`}>
                      <IconText type="smile" text="发起预约" />
                    </Link>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={avatarURL} />}
                    title={<Link to={`/expert/${item.id}`}>{item.name}</Link>}
                    description={
                      <div>
                        <div>
                          累计帮助：<span>{53}人</span>
                        </div>
                        <div>
                          头衔：<span>{item.description}</span>
                        </div>
                        <div>
                          擅长：<span>{major}</span>
                        </div>
                      </div>
                    }
                  />
                  {item.motto}
                </List.Item>
              )
            }}
          />
        )
      }

      default:
        break
    }
  }

  toggleSearchType = (type: QueryType) => {
    this.setState(
      {
        type,
        onLoading: true
      },
      this.fetchList
    )
  }

  componentDidMount() {
    const keyword = this.props.location.state.keyword
    this.setState(
      {
        keyword
      },
      this.fetchList
    )
  }

  componentDidUpdate(prevProps: ISearchProps) {
    if (prevProps.status === 'loading') {
      if (this.props.status === 'failed' || this.props.status === 'success') {
        this.setState({
          onLoading: false
        })
      }
    }
  }

  fetchList = () => {
    const { type, keyword } = this.state
    const params = {
      keyword,
      type
    }
    this.props.dispatch(fetchAction('query/search', { params }))
  }

  handleKeywordChange = (keyword: string) => {
    this.setState({
      keyword
    })
  }

  render() {
    const { keyword, type } = this.state
    return (
      <div className="pcs-search">
        <h3>关键字: {keyword}</h3>
        <div className="search-input">
          <Input.Search
            placeholder="请输入关键字"
            onChange={e => this.handleKeywordChange(e.target.value)}
            onSearch={this.fetchList}
          />
        </div>
        <div className="type-bar">
          {typeBarOption.map(item => (
            <div
              key={item.id}
              className={item.id === type ? 'active' : ''}
              onClick={() => this.toggleSearchType(item.id as QueryType)}
            >
              {item.icon} {item.name}
            </div>
          ))}
        </div>
        <div className={`list-panel ${type}`}>{this.renderSearchList()}</div>
      </div>
    )
  }
}

const mapState = (state: IStore) => ({
  list: state['query/search'].response ? state['query/search'].response.data : null,
  status: state['query/search'].status
})

export default connect(mapState)(Search)
