import React from 'react';
import { Carousel } from "antd";

interface IBaseCarouselProps {}

interface IBaseCarouselState {}

export default class BaseCarousel extends React.Component<IBaseCarouselProps, IBaseCarouselState> {
  constructor(props: IBaseCarouselProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Carousel autoplay></Carousel>
    )
  }
}