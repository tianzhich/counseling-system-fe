import React from 'react';

export type UserProfileTab = 'counseling' | 'xxx'

interface IindexProps {}

interface IindexState {}

export default class index extends React.Component<IindexProps, IindexState> {
    constructor(props: IindexProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>用户Tab</div> 
        )
    }
}