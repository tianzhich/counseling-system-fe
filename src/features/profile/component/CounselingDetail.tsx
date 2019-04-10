import React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';
import { connect } from 'react-redux';
import { OtherAPI, IApiResponse } from '@common/api/config';
import { ICounselingRecord } from './Counselor/CounselingTab';
import Loading from '@features/common/component/Loading';

import './CounselingDetail.less'
import { CounselingMethodMap, CounselingRecordStatusMap } from '@utils/map';
import { Tag, Button, notification, Modal, Icon, Rate } from 'antd';
import { avatarURL } from '@features/common/fakeData';
import { IStore } from '@common/storeConfig';
import ActionModal from './ActionModal';
import { Dispatch } from 'redux';
import { fetchAction } from '@common/api/action';
import { IApiState } from '@common/api/reducer';
import moment from '@utils/moment';

type ActionMap = {
    [key in keyof typeof CounselingRecordStatusMap]: React.ReactNode
}

interface ICounselingDetailProps extends RouteComponentProps<{ recordID: string }> {
    authType: number
    dispatch: Dispatch
    processRes: IApiState
}

interface ICounselingDetailState {
    loading: boolean
    isValid?: boolean
    data?: ICounselingRecord

    showActionModal: boolean
    modalOp?: 0 | 1
}

class CounselingDetail extends React.Component<ICounselingDetailProps, ICounselingDetailState> {
    constructor(props: ICounselingDetailProps) {
        super(props)
        this.state = {
            loading: true,
            showActionModal: false
        }
    }

    closeActionModal = () => {
        this.setState({ showActionModal: false })
    }

    openActionModal = (op: 0 | 1) => {
        this.setState({
            modalOp: op,
            showActionModal: true
        })
    }

    handleProcess = (op: 0 | 1, data?: any) => {
        console.log(data)

        const rID = this.state.data.id
        const appendPath = `/${rID}/${op}`
        this.props.dispatch(fetchAction('operation/appointProcess', { data, appendPath }))
    }

    fetchData = (rID: number, callback?: () => void) => {
        OtherAPI.GetRecordDetail(rID).then(res => {
            const resp: IApiResponse = res.data
            this.setState({
                loading: false,
                isValid: resp.code === 1,
                data: resp.code === 1 ? { ...resp.data, method: JSON.parse(resp.data.method).id } : undefined
            }, callback)
        }).catch(err => {
            this.setState({
                loading: false,
                isValid: false
            })
        })
    }

    handleCompleteCounseling = () => {
        const startTime = moment(this.state.data.startTime).valueOf()
        const now = moment().valueOf()
        if (now <= startTime) {
            Modal.confirm({
                title: "咨询时间未到，您确认完成本次咨询吗？",
                onOk: () => this.handleProcess(1)
            })
        } else {
            this.handleProcess(1)
        }
    }

    componentDidUpdate = (prevProps: ICounselingDetailProps, prevState: ICounselingDetailState) => {
        if (!this.state.data) {
            return
        }

        // 完成咨询时的回调单独处理
        const prevRecordStatus = this.state.data.status
        const prevRes = prevProps.processRes
        const curRes = this.props.processRes
        const rID = this.state.data.id
        if (prevRecordStatus === 'wait_counseling' && prevRes.status === 'loading') {
            if (curRes.status === 'success' && curRes.response && curRes.response.code === 1) {
                notification.open({
                    message: "操作成功",
                    description: "您现在可以对本次咨询进行评价",
                    icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
                });
                this.fetchData(rID, () => this.openActionModal(1))
            } else if (curRes.response && curRes.response.code !== 1) {
                notification.error({
                    message: '操作失败',
                    description: curRes.response.message,
                    duration: null
                });
            } else {
                notification.error({
                    message: '操作失败',
                    description: '网络错误，请尝试稍后重试',
                    duration: null
                });
            }
        }
    }

    componentDidMount() {
        const recordID = parseInt(this.props.match.params.recordID)
        if (isNaN(recordID)) {
            this.setState({
                loading: false,
                isValid: false
            })
        } else {
            this.fetchData(recordID)
        }
    }

    render() {
        const { loading, isValid, data } = this.state
        if (loading) {
            return <Loading />
        }

        if (!loading && isValid === false) {
            return <Redirect to="/" />
        }

        const userActionMap: ActionMap = {
            'wait_contact': <Button type='danger' onClick={() => this.openActionModal(0)}>取消订单</Button>,
            'wait_confirm': (
                <React.Fragment>
                    <Button type='danger' onClick={() => this.openActionModal(0)}>取消</Button>
                    <Button type="primary" onClick={() => this.openActionModal(1)}>确认</Button>
                </React.Fragment>
            ),
            'wait_counseling': (
                <React.Fragment>
                    <Button type='danger' onClick={() => this.openActionModal(0)}>取消</Button>
                    <Button type="primary" onClick={this.handleCompleteCounseling}>咨询已完成</Button>
                </React.Fragment>
            ),
            'wait_comment': <Button type="primary" onClick={() => this.openActionModal(1)}>评价咨询师</Button>,
            'finish': data.letter === '' ? <Button type='primary' onClick={() => this.openActionModal(1)}>写封感谢信</Button> : null,
            'cancel': null
        }

        const counselorActionMap: ActionMap = {
            'wait_contact': (
                <React.Fragment>
                    <Button type='danger' onClick={() => this.openActionModal(0)}>拒绝</Button>
                    <Button type="primary" onClick={() => this.openActionModal(1)}>同意</Button>
                </React.Fragment>
            ),
            'wait_confirm': null,
            'wait_counseling': null,
            'wait_comment': null,
            'finish': null,
            'cancel': null
        }

        const isCounselor = this.props.authType === 1

        const InfoOthers = (
            data.status === 'cancel' ? (
                <div className="section">
                    <div className="title">其他</div>
                    <div className="content">
                        {data.cancelReason1 ? <div><span>咨询者取消理由</span> {data.cancelReason1}</div> : null}
                        {data.cancelReason2 ? <div><span>咨询师取消理由</span> {data.cancelReason2}</div> : null}
                    </div>
                </div>
            ) : data.status === 'finish' && (data.letter !== '' || data.ratingScore !== -1) && !isCounselor ? (
                <div className="section">
                    <div className="title">其他</div>
                    <div className="content">
                        {
                            data.ratingScore !== -1 ? (
                                <React.Fragment>
                                    <div><span>咨询评分</span> {data.ratingScore !== -1 ? <Rate disabled value={data.ratingScore} /> : null}</div>
                                    <div><span>咨询评价</span> {data.ratingText !== '' ? data.ratingText : '空'}</div>
                                </React.Fragment>
                            ) : null
                        }
                        {
                            data.letter !== '' ? (
                                <div>
                                    <span>感谢信</span>
                                    <p>{data.letter}</p>
                                </div>
                            ) : null
                        }
                    </div>
                </div>
            ) : null
        )

        const recordID = parseInt(this.props.match.params.recordID)

        return (
            <div className="counseling-detail">
                <div className="header">
                    <div className="avatar">
                        <img src={avatarURL} alt="" />
                    </div>
                    <div className="name">{data.counselorName}</div>
                    <div className="status">
                        <Tag color={CounselingRecordStatusMap[data.status].color}>
                            {CounselingRecordStatusMap[data.status].text}
                        </Tag>
                    </div>
                </div>
                <div className="main">
                    <div className="section">
                        <div className="title">基本信息</div>
                        <div className="content">
                            <div><span>姓名</span> {data.name}</div>
                            <div><span>性别</span> {data.gender === 1 ? '男' : '女'}</div>
                            <div><span>年龄</span> {data.age}</div>
                            <div><span>电话</span> {data.phone}</div>
                        </div>
                    </div>
                    <div className="section">
                        <div className="title">紧急联系人信息</div>
                        <div className="content">
                            <div><span>姓名</span> {data.contactName}</div>
                            <div><span>关系</span> {data.contactRel}</div>
                            <div><span>电话</span> {data.contactPhone}</div>
                        </div>
                    </div>
                    <div className="section">
                        <div className="title">咨询信息</div>
                        <div className="content">
                            <div><span>咨询方式</span> {CounselingMethodMap[data.method]}</div>
                            <div><span>咨询次数</span> {data.times}次</div>
                            <div><span>咨询时间</span> {data.startTime ? data.startTime : '暂无'}</div>
                            <div><span>咨询地点</span> {data.location ? data.location : '暂无'}</div>
                            <div>
                                <span>咨询描述</span>
                                <p>{data.desc}</p>
                            </div>
                        </div>
                    </div>
                    {InfoOthers}
                </div>
                <div className="footer">
                    <div className="actions">
                        {
                            isCounselor ? counselorActionMap[data.status] : userActionMap[data.status]
                        }
                    </div>
                </div>
                <ActionModal
                    visible={this.state.showActionModal}
                    closeModal={this.closeActionModal}
                    isCounselor={isCounselor}
                    record={data}
                    operation={this.state.modalOp}
                    onProcess={this.handleProcess}
                    processRes={this.props.processRes}
                    onReload={() => this.fetchData(recordID)}
                />
            </div>
        )
    }
}

const mapState = (state: IStore) => ({
    // auth
    authType: state['@global'].auth.authType,

    // 回调
    processRes: state['operation/appointProcess']
})

export default connect(mapState)(CounselingDetail)