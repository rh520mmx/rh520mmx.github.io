import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false,
  },
  device: 'desktop',
}

const mutations = {
  TOGGLE_SIDEBAR: nowState => {
    nowState.sidebar.opened = !nowState.sidebar.opened
    nowState.sidebar.withoutAnimation = false
    if (nowState.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (nowState, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    nowState.sidebar.opened = false
    nowState.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (nowState, device) => {
    nowState.device = device
  },
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
