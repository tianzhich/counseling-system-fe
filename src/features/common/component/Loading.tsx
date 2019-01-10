import React from 'react';
import { Spin } from "antd";
import './Loading.less';

interface ILoadingProps {}

export default class Loading extends React.Component<ILoadingProps, {}> {
    render() {
        return (
            <div className='pcs-loading'>
                <Spin size="large" />
            </div> 
        )
    }
}