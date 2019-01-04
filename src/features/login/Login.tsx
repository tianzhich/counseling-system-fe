import React from 'react';
import LoginForm from "./LoginForm";

import './Login.less'

interface ILoginProps {}

export default class Login extends React.Component<ILoginProps, {}> {
    render() {
        return (
            <div className="pcs-login">
                <LoginForm />
            </div>
        )
    }
}