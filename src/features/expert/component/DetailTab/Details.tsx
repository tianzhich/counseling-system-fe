import React from 'react'
import { Divider } from 'antd'
import { DetailItem } from '@features/common/types'

interface IDetailsProps {
  details: DetailItem[]
}

interface IDetailsState {}

const DetailItem = ({ id, title, content }: DetailItem) => (
  <div className="item">
    <h2>{title}</h2>
    {/* <Divider /> */}
    <p>{content}</p>
  </div>
)

export default class Details extends React.Component<IDetailsProps, IDetailsState> {
  constructor(props: IDetailsProps) {
    super(props)
    this.state = {}
  }

  render() {
    const { details } = this.props
    return (
      <div className="tab-details">
        {details.map(d => (
          <DetailItem {...d} key={d.id} />
        ))}
      </div>
    )
  }
}
