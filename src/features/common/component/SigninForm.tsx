import React from 'react';
import { Form, Icon, Input, Button, Checkbox, } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';

interface ISigninFormProps {
    form: WrappedFormUtils
}

interface ISigninFormState {
    username: string
    password: string
}

class SigninForm extends React.Component<ISigninFormProps, ISigninFormState> {
    constructor(props: ISigninFormProps) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Form className="signin-form">
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
                    <a className="login-form-forgot" href="javascript:void(0)">忘记密码?</a>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(SigninForm);