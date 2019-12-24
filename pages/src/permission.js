import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { loginUrl } from '@/utils/common-config'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/404', '/401'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  next()
  // 判断是否已经登录
  const hasToken = getToken('userInfo')
  // 首先判断是否存在该路由
  // if (hasToken && hasToken !== 'undefined') {
  //   const userInfoObj = JSON.parse(hasToken)
  //   if (to.redirectedFrom === '/?1' && to.path !== '/') {
  //     next({ path: '/' })
  //   }
  //   if (to.matched.length === 0) {
  //     to.name ? next({ name: to.name }) : next('/404')
  //   } else {
  //     if (to.path === '/login') {
  //       next({ path: '/' })
  //       NProgress.done()
  //     } else {
  //       // 如果已经登录  获取用户信息， 如果可以取到就直接登录，如果取不到则重定向到登录页面
  //       if (userInfoObj.UserRole === 'unknown' && to.path !== '/401') {
  //         next('/401')
  //       } else if (userInfoObj.UserRole === 'default') {
  //         next()
  //       } else {
  //         try {
  //           // get user info
  //           await store.dispatch('user/login')
  //           next()
  //         } catch (error) {
  //           // remove token and go to login page to re-login
  //           await store.dispatch('user/resetToken')
  //           Message.error(error || 'Has Error')
  //           next(`/login?redirect=${to.path}`)
  //           NProgress.done()
  //         }
  //       }
  //     }
  //   }
  // } else {
  //   /* 没有登录*/
  //   const currentUrl = location.href
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // in the free login whitelist, go directly
  //     next()
  //     NProgress.done()
  //     return
  //   } else {
  //     // console.log(currentUrl);
  //     const isLoginCb = currentUrl.indexOf('?')
  //     if (isLoginCb === -1) {
  //       window.location.replace(loginUrl(`${currentUrl}?1`))
  //     } else {
  //       next(`/login`)
  //     }
  //   }
  //   NProgress.done()
  // }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
