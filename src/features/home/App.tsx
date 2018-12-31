import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import Navigator from './Navigator';

const { Header, Content, Footer } = Layout;

interface IAppProps extends RouteComponentProps {}

export default class App extends React.Component<IAppProps, {}> {
    render() {
        return (
            <Layout>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                    <div className="logo" />
                    <Navigator />
                </Header>
                <Content style={{ padding: '0 50px', marginTop: 64 }}>
                    <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>{this.props.children}</div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2018 Created by Ant UED
                </Footer>
            </Layout>
        )
    }
}
