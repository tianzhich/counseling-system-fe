import React from 'react';
import { Upload, Icon, message } from "antd";
import { UploadChangeParam } from 'antd/lib/upload';

const Dragger = Upload.Dragger

interface ICreditProps { }

interface ICreditState { }

export default class Credit extends React.Component<ICreditProps, ICreditState> {
    constructor(props: ICreditProps) {
        super(props);
        this.state = {};
    }

    render() {
        const uploadProps = {
            name: 'file',
            multiple: true,
            action: '//jsonplaceholder.typicode.com/posts/',
            onChange(info: UploadChangeParam) {
                const status = info.file.status;
                if (status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    message.success(`${info.file.name} 文件上传成功!`);
                } else if (status === 'error') {
                    message.error(`${info.file.name} 文件上传失败!`);
                }
            },
        }
        return (
            <div className="apply-credit">
                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">点击或拖拽文件来上传</p>
                    <p className="ant-upload-hint">支持上传多个文件，尽量上传PDF格式或图片格式</p>
                </Dragger>
            </div>
        )
    }
}