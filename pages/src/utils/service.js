import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import { loginTips } from './index'
import { loginUrl } from '@/utils/common-config'
import store from '../store'

// create an axios instance
const service = axios.create({
  baseURL: `${process.env.VUE_APP_BASE_API}`, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  acrossDomain: true,
  timeout: 5000, // request timeout
})
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (getToken('xtoken')) {
      config.headers['X-Token'] = getToken('xtoken')
    }
    const { method } = config
    if (method === 'post') {
      config.headers['Content-Type'] = 'application/json; charset=utf-8'
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * 如果想获取诸如头或状态之类的http信息
   * 可以 return  response => response
  */

  /**
   * 通过自定义代码确定请求状态
   * 可以通过HTTP状态代码判断状态
   */
  response => {
    const res = response.data

    if (!res) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000,
      })
      return Promise.reject(new Error(res.Message || 'Error'))
    } else {
      return res
    }
  },
  ({ response }) => {
    if (!response) {
      return
    }
    const { status, data } = response
    // const currentUrl = location.href
    if (status === 403) {
      // console.log(getToken('userInfo'));
      const confirmTips = document.getElementsByClassName('el-message-box__wrapper')[0]
      if (getToken('userInfo') && (!confirmTips || confirmTips.getAttribute('style').indexOf('none')) !== -1) {
        loginTips(MessageBox.confirm, store, loginUrl, location.href)
      }
    } else {
      Message({
        message: data.Message,
        type: 'error',
        customClass: 'my-message-tips error',
        duration: 5 * 1000,
      })
    }
    return Promise.reject(response)
  }
)

export default service
