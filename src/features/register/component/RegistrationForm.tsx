import React, { FormEvent } from 'react';
import {
    Form, Input, Select, Checkbox, Button, message, 
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import * as API from '@src/common/api';

const { Option } = Select;
interface IRegistrationFormProps {
    form: WrappedFormUtils
}

interface IRegistrationFormState {
    confirmDirty: boolean
    autoCompleteResult: any[]
}

class RegistrationForm extends React.Component<IRegistrationFormProps, IRegistrationFormState> {
    constructor(props: IRegistrationFormProps) {
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
                    message.error('请同意注册协议！');
                    return;
                }

                const data = {
                    username: values.username,
                    password: values.password,
                    phone: values.phone,
                    email: values.email
                }

                API.register(data).then(res => {
                    if(res.data.code === 1) {
                        message.success(res.data.message)
                    } else if(res.data.code === 0) {
                        message.warn(res.data.message)
                    } else {
                        message.error(res.data.message)
                    }
                }).catch(err => {
                    message.error('网络错误, 请稍后重试！')
                })
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
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
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
            <Form onSubmit={this.handleSubmit}>
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
                        rules: [{ required: true, message: '请输入手机号码!' }],
                    })(
                        <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                    )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    {getFieldDecorator('agreement', {
                        valuePropName: 'checked',
                    })(
                        <Checkbox>我已阅读 <a href="">注册协议</a></Checkbox>
                    )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">注册</Button>
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create()(RegistrationForm);
