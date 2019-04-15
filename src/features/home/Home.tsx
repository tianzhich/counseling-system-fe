import React from 'react';
import axios from 'axios';
import emitter from "@utils/events";

import './Home.less'

interface IHomeProps { }

interface IHomeState { }

export default class Home extends React.Component<IHomeProps, IHomeState> {
    constructor(props: IHomeProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // axios.get('http://172.17.29.96:8080/api').then(res => {
        //     console.log(res);
        // })
    }

    login() {
        emitter.emit("login")
    }

    render() {
        return (
            <div className="pcs-home">
                <h2>My Home</h2>
                <button onClick={this.login}>此操作需要先登录</button>
            </div>

        )
    }
}