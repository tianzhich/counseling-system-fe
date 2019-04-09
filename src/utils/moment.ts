import moment from "moment";
import "moment/locale/zh-cn";

moment.locale('zh-cn')

export function getDate(time: string) {
    return moment(time).format('YYYY-MM-DD')
}

export default moment