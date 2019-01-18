import React from 'react';
import Quill from "quill";
import { Upload, Icon } from "antd";

import 'quill/dist/quill.snow.css';

interface IPostProps { }

export default class Post extends React.Component<IPostProps, {}> {
    quill: any;
    constructor(props: IPostProps) {
        super(props)
        this.quill = null;
    }
    initQuill() {
        this.quill = new Quill('#editor', {
            theme: 'snow'  // or 'bubble'
        })
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        this.initQuill();
    }
    render() {
        const uploadButton = (
            <div>
              <Icon type='plus' />
              <div className="ant-upload-text">Upload</div>
            </div>
          );
        return (
            <div className="pcs-post">
                <div className="cover">
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="//jsonplaceholder.typicode.com/posts/"
                    >
                        {uploadButton}
                    </Upload>
                </div>
                <div id="editor">

                </div>
                
            </div>

        )
    }
}