import React from 'react'
import { Divider, List, Comment, Tooltip, Button } from 'antd'
import moment from '@utils/moment'
import { Letter } from '@features/common/types'
import { avatarURL, anonyURL } from '@features/common/fakeData'

const data = [
  {
    author: '匿名',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content: (
      <p>
        这是我们第二次的咨询，老师给我的感觉是特别耐心，我们做的是亲子咨询，这个时候我有一点想下一次单独与老师咨询了，因为觉得母亲从小就没有给我一种
        在我们这段关系中你是足够安全的 的感觉，我觉得她恶心，想要逃开
      </p>
    ),
    datetime: (
      <Tooltip
        title={moment()
          .subtract(50, 'days')
          .format('YYYY-MM-DD HH:mm:ss')}
      >
        <span>
          {moment()
            .subtract(50, 'days')
            .fromNow()}
        </span>
      </Tooltip>
    )
  },
  {
    author: '匿名',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content: (
      <p>
        第一次在这个app上咨询，老师是一个很好的倾听者，感觉到自己被理解，对我的帮助很大。非常感谢。
      </p>
    ),
    datetime: (
      <Tooltip
        title={moment()
          .subtract(20, 'days')
          .format('YYYY-MM-DD HH:mm:ss')}
      >
        <span>
          {moment()
            .subtract(20, 'days')
            .fromNow()}
        </span>
      </Tooltip>
    )
  },
  {
    author: '银月莹',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content: (
      <p>
        谢谢老师，似乎您更多的是带领我，更加的了解我自己，让未发现的问题被我自己发掘到，让我自己在生活中积攒经验，更快的改变我所拥有的问题以及解决问题的答案。至于，经验，道理，需要我自己在生活中悟出，解决问题需要我在生活中体悟和解决。
        俗话说的好，生活是最好的老师。
        我相信，在生活中积累满经验的我，会选择回来和老师分享的。我会努力的，就是这样了。
      </p>
    ),
    datetime: (
      <Tooltip
        title={moment()
          .subtract(2, 'days')
          .format('YYYY-MM-DD HH:mm:ss')}
      >
        <span>
          {moment()
            .subtract(2, 'days')
            .fromNow()}
        </span>
      </Tooltip>
    )
  }
]

interface ILettersProps {
  letters: Letter[]
}

export default class Letters extends React.Component<ILettersProps, {}> {
  render() {
    const letters = this.props.letters
    const lletters = letters.length > 3 ? letters.slice(0, 3) : letters
    return (
      <div className="tab-letters">
        <List
          className="comment-list"
          header={<h2>最近收到的感谢信</h2>}
          itemLayout="horizontal"
          dataSource={lletters}
          renderItem={(item: Letter) => {
            const time = (
              <Tooltip title={item.time}>
                <span>{moment(item.time).fromNow()}</span>
              </Tooltip>
            )
            return (
              <React.Fragment>
                <Comment
                  author="匿名"
                  avatar={require('@images/anonyAvatar.png')}
                  content={item.text}
                  datetime={time}
                />
                <Divider />
              </React.Fragment>
            )
          }}
        />
      </div>
    )
  }
}
