import React from 'react';
import { Table, Modal, Row, Col, Input, Divider } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from "@utils/moment";
import { CounselingRecordStatusMap, CounselingMethodMap } from '@utils/map';
import CounselorContactModal from './ContactModal';

export type ICounselingRecordStatus = keyof typeof CounselingRecordStatusMap

export interface ICounselingRecord {
    id: number
    method: string
    times: number
    name: string
    age: number
    gender: number
    phone: number
    contactName: string
    contactPhone: string
    contactRel: string
    desc: string
    status: ICounselingRecordStatus
    createTime: string
}

interface ICounselingTabProps {
    data: ICounselingRecord[]
    onContactSubmit: (recordID: number, op: number, data?: any) => void
}

interface ICounselingTabState {
    showContactModal: boolean
    isContactPass?: boolean
    activeRecord?: ICounselingRecord

    keyword: string
}

export default class CounselingTab extends React.Component<ICounselingTabProps, ICounselingTabState> {
    columns: ColumnProps<ICounselingRecord>[] = [{
        title: '咨询人信息',
        children: [{
            dataIndex: 'name',
            title: '姓名'
        }, {
            dataIndex: 'age',
            title: '年龄'
        }, {
            dataIndex: 'gender',
            title: '性别',
            render: (val) => val === 0 ? '女' : '男'
        }, {
            dataIndex: 'phone',
            title: '电话'
        }]
    }, {
        dataIndex: 'contactName',
        title: '紧急联系人',
        render: (val, record) => <a onClick={() => this.openContactModal(record)} >{val}</a>
    }, {
        title: '咨询信息',
        children: [{
            dataIndex: 'method',
            title: '方式',
            filters: Object.keys(CounselingMethodMap).map(k => ({ text: CounselingMethodMap[k], value: k })),
            onFilter: (value, record) => record.method.indexOf(value) === 0,
            render: (val) => CounselingMethodMap[val]
        }, {
            dataIndex: 'times',
            title: '次数'
        }, {
            dataIndex: 'desc',
            title: '详细描述',
            render: (val, record) => <a onClick={() => this.openDescModal(record)} >查看</a>
        }]
    }, {
        dataIndex: 'status',
        title: '进度',
        filters: Object.keys(CounselingRecordStatusMap).map(s => ({ text: CounselingRecordStatusMap[s], value: s })),
        onFilter: (value, record) => record.method.indexOf(value) === 0,
        render: (val) => CounselingRecordStatusMap[val]
    }, {
        dataIndex: 'createTime',
        title: '申请时间',
        sorter: (rowA, rowB) => moment(rowB.createTime).valueOf() - moment(rowA.createTime).valueOf(),
        render: (val) => moment(val).fromNow(),
    }, {
        title: '操作',
        key: 'action',
        render: (text, record) => this.getAction(record)
    }]

    constructor(props: ICounselingTabProps) {
        super(props);
        this.state = {
            keyword: '',
            showContactModal: false,
        };
    }

    getAction = (record: ICounselingRecord) => {
        switch (record.status) {
            case 'wait_contact':
                return (
                    <React.Fragment>
                        <a onClick={() => this.toggleContactWindow(true, record)}>同意</a>
                        <a onClick={() => this.toggleContactWindow(true, record)}>拒绝</a>
                    </React.Fragment>
                )

            default:
                break;
        }
    }

    // wait_contact -> wait_confirm
    toggleContactWindow = (show: boolean, record?: ICounselingRecord) => {
        this.setState({ showContactModal: show, activeRecord: record })
    }

    // 咨询协商
    onContact = (op: number, time?: string, location?: string) => {
        const record = this.state.activeRecord
        if (!record) {
            return
        }

        if (op === 1) {
            const data = {time, location}
            this.props.onContactSubmit(record.id, op, data)
        } else {
            this.props.onContactSubmit(record.id, op)
        } 
    }

    // 查看紧急联系人详情
    openContactModal(r: ICounselingRecord) {
        Modal.info({
            title: '紧急联系人',
            content: (
                <div>
                    <Row>
                        <Col span={8}>姓名：</Col>
                        <Col span={16}>{r.contactName}</Col>
                    </Row>
                    <Row>
                        <Col span={8}>联系方式：</Col>
                        <Col span={16}>{r.contactPhone}</Col>
                    </Row>
                    <Row>
                        <Col span={8}>关系：</Col>
                        <Col span={16}>{r.contactRel}</Col>
                    </Row>
                </div>
            )
        })
    }

    // 查看咨询描述详情
    openDescModal(r: ICounselingRecord) {
        Modal.info({
            title: '咨询描述详情',
            content: (
                <div>
                    {r.desc}
                </div>
            )
        })
    }

    // 按姓名搜索, 暂时前端完成
    handleSearch = (keyword: string) => {
        this.setState({
            keyword
        })
    }

    render() {
        const data = this.props.data.filter(d => d.name.includes(this.state.keyword))
        const showContactModal = this.state.showContactModal
        return (
            <div className="tab-counseling">
                <Input.Search placeholder="输入姓名搜索" onSearch={this.handleSearch} />
                <Table
                    columns={this.columns}
                    dataSource={data}
                    bordered
                    rowKey={(r) => r.id.toString()}
                />
                <CounselorContactModal
                    visible={showContactModal}
                    closeModal={() => this.toggleContactWindow(false)}
                    onPass={(time, location) => this.onContact(1, time, location)}
                    isPass={true}
                />
            </div>
        )
    }
}