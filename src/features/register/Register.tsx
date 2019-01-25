import React from 'react';
import RegistrationForm from './component/RegistrationForm'

interface IRegisterProps {}

interface IRegisterState {}

export default class Register extends React.Component<IRegisterProps, IRegisterState> {
    constructor(props: IRegisterProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div><RegistrationForm /></div>
        )
    }
}