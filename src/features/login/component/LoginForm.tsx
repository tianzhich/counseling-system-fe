import React from 'react';
import { Form, Icon, Input, Button, Checkbox, } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';

import './LoginForm.less'

interface ILoginFormProps {
    form: WrappedFormUtils
}

interface ILoginFormState {
    username: string
    password: string
}

class LoginForm extends React.Component<ILoginFormProps, ILoginFormState> {
    constructor(props: ILoginFormProps) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: '请输入用户名!' }],
                    })(
                        <Input prefix={<Icon type="user" className="login-form-icon-username" />} placeholder="用户名" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码!' }],
                    })(
                        <Input prefix={<Icon type="lock" className="login-form-icon-password" />} placeholder="密码" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox>记住密码</Checkbox>
                    )}
                    <a className="login-form-forgot" href="">忘记密码?</a>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                    </Button>
                    或者 <a href="">现在注册!</a>
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(LoginForm);