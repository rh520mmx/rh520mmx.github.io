import { checkLogin } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { loginUrl } from '@/utils/common-config'
import { resetRouter } from '@/router'

const state = {
  userInfo: getToken('userInfo'),
}

const mutations = {

  SET_USER_INFO: (nowState, name) => {
    nowState.userInfo = name
  },
}

const actions = {
  // user login
  login({ commit }) {
    return new Promise((resolve, reject) => {
      checkLogin().then((data) => {
        commit('SET_USER_INFO', data)
        // removeToken('error')
        setToken('userInfo', JSON.stringify(data))
        resolve(data)
      }).catch((error) => {
        // setToken('error', error.status)
        removeToken('userInfo')
        commit('SET_USER_INFO', '')
        resetRouter()
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, nowState }) {
    return new Promise((resolve, reject) => {
      commit('SET_USER_INFO', '')
      removeToken('userInfo')
      const href = location.href
      window.location.replace(loginUrl(href.split('/#')[0], true))
      resetRouter()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_USER_INFO', '')
      removeToken('userInfo')
      // removeToken('error')
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}

