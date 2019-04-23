import React from 'react';
import './Home.less'
import BaseCarousel from '@features/common/component/Carousel';

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

    render() {
        return (
            <div className="pcs-home">
                <header>
                    <BaseCarousel />
                </header>
                
            </div>
        )
    }
}