import React from 'react';

interface IHomeProps {}

interface IHomeState {}

export default class Home extends React.Component<IHomeProps, IHomeState> {
    constructor(props: IHomeProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <h2>My Home</h2>
        )
    }
}