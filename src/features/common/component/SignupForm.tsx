import React, { FormEvent } from 'react';
import {
    Form, Input, Select, Checkbox, Button, message, 
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import * as API from '@common/api/config';
import { fetchAction } from '@common/api/action';
import { Dispatch } from 'redux';

const { Option } = Select;
interface ISignupFormProps {
    form: WrappedFormUtils
    dispatch: Dispatch
}

interface ISignupFormState {
    confirmDirty: boolean
    autoCompleteResult: any[]
}

class SignupForm extends React.Component<ISignupFormProps, ISignupFormState> {
    constructor(props: ISignupFormProps) {
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
        }
    }

    handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if(!values.agreement) {
                    message.error('请阅读并同意注册协议！');
                    return;
                }

                const data = {
                    username: values.username,
                    password: values.password,
                    phone: values.phone,
                    email: values.email
                }

                this.props.dispatch(fetchAction('oauth/signup', {data}))
            }
        });
    }

    handleConfirmBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule: any, value: any, callback: any) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('密码不一致!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule: any , value: any, callback: any) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };

        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
            </Select>
        );

        return (
            <Form onSubmit={this.handleSubmit} className='signup-form'>
                <Form.Item
                    {...formItemLayout}
                    label="用户名"
                >
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: '请输入用户名!', whitespace: true }],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="密码"
                >
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: '请输入密码!',
                        }, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                        <Input type="password" />
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="确认密码"
                >
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: '请二次确认密码!',
                        }, {
                            validator: this.compareToFirstPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur} />
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="电子邮箱"
                >
                    {getFieldDecorator('email', {
                        rules: [{
                            type: 'email', message: '不符合邮箱地址规范!',
                        }, {
                            required: true, message: '请输入电子邮箱!',
                        }],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="手机号码"
                >
                    {getFieldDecorator('phone', {
                        rules: [{ 
                            required: true, message: '请输入手机号码!' 
                        }, {
                            type: 'string', len: 11, message: '请输入合法手机号码!'
                        }],
                    })(
                        <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('agreement', {
                        valuePropName: 'checked',
                    })(
                        <Checkbox>我已阅读 <a href="javascript:void(0)">注册协议</a></Checkbox>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">注册</Button>
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create()(SignupForm);
