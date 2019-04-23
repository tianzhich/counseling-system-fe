import React from 'react'
import { Carousel } from 'antd'
import './Carousel.less'

interface IBaseCarouselProps {}

interface IBaseCarouselState {}

export default class BaseCarousel extends React.Component<IBaseCarouselProps, IBaseCarouselState> {
  constructor(props: IBaseCarouselProps) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Carousel>
        <div>
          <h3>活动1</h3>
        </div>
        <div>
          <h3>活动2</h3>
        </div>
        <div>
          <h3>活动3</h3>
        </div>
        <div>
          <h3>活动4</h3>
        </div>
      </Carousel>
    )
  }
}
