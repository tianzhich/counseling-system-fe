import React from "react";
import ContentHeader from "./ContentHeader";

import './LectureContent.less';

interface ILectureContentProps {}



export default class LectureContent extends React.Component<ILectureContentProps, {}> {
  render() {
    return (
      <div className="lecture-content-wrapper">
        <div className="lecture-content">
          <ContentHeader type='lecture' />
          <main></main>
        </div>
      </div>
    )
  }
}