import React from 'react'

import './SettingTab.less'
import { IUserInfo } from '../Profile'
import { Counselor } from '@features/common/types'
import { Divider, Input, InputNumber, Button, Switch, Cascader, message } from 'antd'
import { cities } from '@utils/cities'

interface ISettingTabProps {
  userInfo: IUserInfo
  counselorInfo?: Counselor

  onReloadSetting: () => void
  updateUserInfo: (data: any) => void
  updateCounselorInfo?: (data: any) => void
}

interface ISettingTabState {
  userInfo: UserInfo
  counselorInfo: CounselorInfo

  showFtfSetting: boolean
}

type UserInfo = Pick<IUserInfo, 'email' | 'phone'>
type CounselorInfo = Pick<Counselor, 'audioPrice' | 'videoPrice' | 'ftfPrice' | 'motto'> & {
  city: string
}
type StateKey = 'userInfo' | 'counselorInfo'
type InfoKey<T> = T extends 'userInfo' ? keyof UserInfo : keyof CounselorInfo

export default class SettingTab extends React.Component<ISettingTabProps, ISettingTabState> {
  constructor(props: ISettingTabProps) {
    super(props)
    const { userInfo, counselorInfo } = props
    this.state = {
      userInfo: {
        email: userInfo.email,
        phone: userInfo.phone
      },
      counselorInfo: counselorInfo
        ? {
            audioPrice: counselorInfo.audioPrice,
            videoPrice: counselorInfo.videoPrice,
            ftfPrice: counselorInfo.ftfPrice,
            motto: counselorInfo.motto,
            city: counselorInfo.city ? counselorInfo.city.name : ''
          }
        : undefined,
      showFtfSetting: counselorInfo && counselorInfo.ftfPrice !== 0
    }
  }

  handleToggleFtfSetting = () => {
    this.setState({
      showFtfSetting: !this.state.showFtfSetting
    })
  }

  handleUpdateUserInfo = () => {
    const phone = this.state.userInfo.phone
    const email = this.state.userInfo.email
    const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

    if (phone.length !== 11) {
      message.error('请填写正确的号码')
      return
    }
    if (!emailReg.test(email)) {
      message.error('请填写正确的邮箱格式')
      return
    }

    const data = { email, phone }
    this.props.updateUserInfo(data)
  }

  handleChangeInfos = <T extends StateKey, K extends InfoKey<T>>(
    type: T,
    key: K,
    val: ISettingTabState[T] extends { [key: string]: any } ? ISettingTabState[T][K] : never
  ) => {
    this.setState({
      ...this.state,
      [type]: {
        ...this.state[type],
        [key]: val
      }
    })
  }

  render() {
    const isCounselor = this.props.counselorInfo ? true : false
    const { counselorInfo, userInfo } = this.props
    const showFtf = this.state.showFtfSetting
    const cityName = counselorInfo && counselorInfo.city ? counselorInfo.city.name : ''
    return (
      <div className="tab-setting">
        <h3>个人资料</h3>
        <div className="item">
          <div>电话</div>
          <Input
            defaultValue={userInfo.phone}
            onChange={e => this.handleChangeInfos('userInfo', 'phone', e.target.value)}
          />
        </div>
        <div className="item">
          <div>邮箱</div>
          <Input
            defaultValue={userInfo.email}
            onChange={e => this.handleChangeInfos('userInfo', 'email', e.target.value)}
          />
        </div>
        <div className="action">
          <Button type="primary" onClick={this.handleUpdateUserInfo}>
            更新个人资料
          </Button>
        </div>
        {isCounselor ? (
          <React.Fragment>
            <Divider />
            <h3>咨询设置</h3>
            <div>
              <div className="item">
                <div>个人签名(必填)</div>
                <Input.TextArea
                  placeholder="限50个字符。&#10;方向1：可以写咨询师对咨询的理解（价值观）。示例：有阴影的地方就有阳光。咨询师，就是要让来访者看到更整体、全面的东西。&#10;方向2：咨询师想要对来访者说的话。示例：星洲易渡，心河难逾，与你共觅心河之舟。&#10;方向3：咨询师最想要来访者了解的讯息。示例：十年正念结合心理学实践经验，致力于推动正念禅修结合心理学。"
                  style={{ height: '150px' }}
                  defaultValue={counselorInfo.motto}
                />
              </div>
              <h4>咨询价格</h4>
              <div>
                <div className="item">
                  <span>电话咨询</span>
                  <InputNumber
                    defaultValue={counselorInfo.audioPrice}
                    min={0}
                    formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value =>
                      isNaN(Number(value.replace(/¥\s?|(,*)/g, '')))
                        ? 0
                        : Number(value.replace(/¥\s?|(,*)/g, ''))
                    }
                  />
                </div>
                <div className="item">
                  <span>视频咨询</span>
                  <InputNumber
                    defaultValue={counselorInfo.videoPrice}
                    min={0}
                    formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value =>
                      isNaN(Number(value.replace(/¥\s?|(,*)/g, '')))
                        ? 0
                        : Number(value.replace(/¥\s?|(,*)/g, ''))
                    }
                  />
                </div>
                <div className="item">
                  <span>{showFtf ? '关闭' : '开通'}面对面咨询</span>{' '}
                  <Switch checked={showFtf} onChange={this.handleToggleFtfSetting} />
                </div>
                {this.state.showFtfSetting ? (
                  <React.Fragment>
                    <div className="item">
                      <span>价格</span>
                      <InputNumber
                        min={0}
                        defaultValue={counselorInfo.ftfPrice}
                        formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value =>
                          isNaN(Number(value.replace(/¥\s?|(,*)/g, '')))
                            ? 0
                            : Number(value.replace(/¥\s?|(,*)/g, ''))
                        }
                      />
                    </div>
                    <div className="item">
                      <span>城市</span>
                      <Cascader
                        options={cities}
                        expandTrigger="hover"
                        displayRender={label => label[label.length - 1]}
                        // onChange={(value) => this.handleSetFtf('city', value[value.length - 1].replace('市', ''))}
                        placeholder={
                          counselorInfo.ftfPrice === 0 ? '请选择' : cityName
                        }
                      />
                    </div>
                  </React.Fragment>
                ) : null}
              </div>
            </div>
            <div className="action">
              <Button type="primary">更新咨询设置</Button>
            </div>
          </React.Fragment>
        ) : null}
      </div>
    )
  }
}
