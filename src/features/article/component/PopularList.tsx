import React from 'react'
import { Affix, Button } from 'antd'
import { fakeArticle, ArticleProps } from '@types'

import './PopularList.less'
import { Link } from 'react-router-dom'
import { getDate } from '@utils/moment';

interface IPopularListProps {
  articles: ArticleProps[]
  isCounselor: boolean
}

function ListItem(
  props: Pick<ArticleProps, 'id' | 'authorName' | 'title' | 'postTime' | 'excerpt'> & { number: string }
) {
  const excerpt = props.excerpt.length > 30 ? `${props.excerpt.slice(0, 30)}...` : props.excerpt
  return (
    <li className="list-item">
      <div className="number">{props.number}</div>
      <div className="content">
        <Link to={`/article/${props.id}`}>
          <h4 className="title">{props.title}</h4>
        </Link>
        <p className="excerpt">{excerpt}</p>
        <div>
          <span className="date">{getDate(props.postTime)}</span>
          <span className="author">{props.authorName}</span>
        </div>
      </div>
    </li>
  )
}

export default class PopularList extends React.Component<IPopularListProps, {}> {
  render() {
    return (
      <Affix offsetTop={100}>
        <div className="popular-list">
          <div className="title-bar">阅读最多</div>
          <ol>
            {this.props.articles.map((article, i) => (
              <ListItem {...article} number={`0${i + 1}`} key={article.id} />
            ))}
          </ol>
          <div
            className="post-button"
            style={{ display: this.props.isCounselor ? 'block' : 'none' }}
          >
            <Link to="/post">
              <Button type="primary">发表文章</Button>
            </Link>
          </div>
        </div>
      </Affix>
    )
  }
}
