import React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';
import { connect } from 'react-redux';
import { OtherAPI, IApiResponse } from '@common/api/config';
import { ICounselingRecord } from './Counselor/CounselingTab';
import Loading from '@features/common/component/Loading';

import './CounselingDetail.less'

interface IItem {
    label: string
    content: string
}

interface ISectionProps {
    title: string
    items: IItem[]
}

const Section = (props: ISectionProps) => (
    <div className="section">
        <h2>{props.title}</h2>
        <div className="section-items">
            {
                props.items.map((v, i) => (
                    <div key={i}>
                        <span className="section-label">{v.label}</span>
                        <span className="section-content">{v.content}</span>
                    </div>
                ))
            }
        </div>

    </div>
)

interface ICounselingDetailProps extends RouteComponentProps<{ recordID: string }> { }

interface ICounselingDetailState {
    loading: boolean
    isValid?: boolean
    data?: ICounselingRecord
}

class CounselingDetail extends React.Component<ICounselingDetailProps, ICounselingDetailState> {
    constructor(props: ICounselingDetailProps) {
        super(props)
        this.state = {
            loading: true
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
            OtherAPI.GetRecordDetail(recordID).then(res => {
                const resp: IApiResponse = res.data
                this.setState({
                    loading: false,
                    isValid: resp.code === 1,
                    data: resp.code === 1 ? { ...resp.data, method: JSON.parse(resp.data.method).id } : undefined
                })
            })
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

        const Details: ISectionProps[] = [{
            title: "基本信息",
            items: [{
                label: "姓名",
                content: data.name
            }, {
                label: "性别",
                content: data.gender === 0 ? '女' : '男'
            }, {
                label: '年龄',
                content: data.age.toString()
            }, {
                label: '联系方式',
                content: data.phone
            }, {
                label: '紧急联系人',
                content: data.contactName
            }, {
                label: '紧急联系人关系',
                content: data.contactRel
            }, {
                label: '紧急联系人电话',
                content: data.contactPhone
            }]
        }]

        return (
            <div className="counseling-detail">
                {
                    Details.map((v, i) => (
                        <Section key={i} title={v.title} items={v.items} />
                    ))
                }
            </div>
        )
    }
}

export default connect()(CounselingDetail)