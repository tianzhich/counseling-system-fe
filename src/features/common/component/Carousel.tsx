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
      <Carousel autoplay >
        <div className="slide slide1" />
        <div className="slide slide2" />
        <div className="slide slide3" />
        <div className="slide slide4" />
        <div className="slide slide5" />
      </Carousel>
    )
  }
}
