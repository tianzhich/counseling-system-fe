import React from 'react';
import { Menu } from "antd";
import { NavLink, Route } from 'react-router-dom';

interface INavigatorProps { }

export default class Navigator extends React.Component<INavigatorProps, {}> {
    render() {
        return (
            <Route children={({location}) => (
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[location.pathname]}
                    style={{ lineHeight: '64px' }}
                >
                    <Menu.Item key="/">
                        <NavLink to="/">首页</NavLink>
                    </Menu.Item>
                    <Menu.Item key="/article">
                        <NavLink to="/article">阅读</NavLink>
                    </Menu.Item>
                    <Menu.Item key="/forum">
                        <NavLink to="/forum">论坛</NavLink>
                    </Menu.Item>
                    <Menu.Item key="/todo">
                        <NavLink to="/todo">待办</NavLink>
                    </Menu.Item>
                </Menu>
            )} />
        )
    }
}