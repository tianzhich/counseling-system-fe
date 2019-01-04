import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import Navigator from './Navigator';

import './App.less'

const { Header, Content, Footer } = Layout;

interface IAppProps extends RouteComponentProps { }

export default class App extends React.Component<IAppProps, {}> {
    render() {
        return (
            <div className="pcs-app">
                <Layout>
                    <Header>
                        <Navigator />
                    </Header>
                    <Content>
                        <div className="pcs-content">{this.props.children}</div>
                    </Content>
                    <Footer>
                        Ant Design ©2018 Created by Ant UED
                    </Footer>
                </Layout>
            </div>
        )
    }
}
