import React from 'react';
import axios from 'axios';

interface IHomeProps {}

interface IHomeState {}

export default class Home extends React.Component<IHomeProps, IHomeState> {
    constructor(props: IHomeProps) {
        super(props);
        this.state = {};
    }

    public componentDidMount() {
        // axios.get('http://172.17.29.96:8080/api').then(res => {
        //     console.log(res);
        // })
    }

    render() {
        return (
            <h2>My Home</h2>
        )
    }
}