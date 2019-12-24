
/**
 * constantRoutes
 * 不需要鉴权的页面
 * 所有权限的用户均可访问
 */

/* Layout *//* Layout */
const Layout = () => import('@/layout')
import { manager } from '../manager/manager'

// 懒加载的loading 避免点击跳转路由之后js没有被下载完成之前造成的点击无效问题
import { Loading } from 'element-ui'

let LoadingService = null
const spinRoute = {
  show() { // 加载中显示loading组件
    if (!LoadingService) {
      LoadingService = Loading.service({
        text: '模块载入中, 请稍后...',
        spinner: '',
        background: 'rgba(0,0,0,.5)',
      })
    }
  },
  resolve(resolve) { // 加载完成隐藏loading组件
    return component => {
      if (LoadingService) {
        LoadingService.close()
        LoadingService = null
      }
      resolve(component)
    }
  },
}
export const constantRoutes = [
  {
    path: '/login',
    component: resolve => {
      spinRoute.show()
      require(['@/views/login/index'], spinRoute.resolve(resolve))
    },
    hidden: true,
  },

  {
    path: '/404',
    component: resolve => {
      spinRoute.show()
      require(['@/views/404'], spinRoute.resolve(resolve))
    },
    hidden: true,
  },
  {
    path: '/401',
    component: resolve => {
      spinRoute.show()
      require(['@/views/401'], spinRoute.resolve(resolve))
    },
    hidden: true,
  },
  manager(Layout, spinRoute),
]
