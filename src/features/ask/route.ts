import App from '../common/component/App'
import { IRoute } from '@common/routeConfig'

const loader = (name: string) => async () => {
  const entrance = await import('./')
  return entrance[name]
}

const childRoutes: IRoute[] = [
  {
    path: '/ask',
    name: 'Ask',
    loader: loader('Ask'),
    exact: true
  },
  {
    path: '/ask/post',
    name: 'Ask Post',
    loader: loader('AskPost')
  },
  {
    path: '/ask/:id',
    name: 'AskItem Detail',
    loader: loader('AskItemDetail')
  }
]

export default {
  path: '/ask',
  name: '',
  component: App,
  childRoutes
}
