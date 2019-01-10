// Info about Expert
export interface Expert {
    id: string
    name: string
    avatar: string
    description: string
    workYears: number
    goodRate?: number
    motto: string // 格言
    price: number // 咨询价格
}