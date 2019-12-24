import Cookies from 'js-cookie'

export function getToken(name) {
  return Cookies.get(name)
}

export function setToken(name, value) {
  return Cookies.set(name, value)
}

// 清除所有cookie函数
function clearAllCookie() {
  const keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  console.log(keys)
  if (keys) {
    for (let i = keys.length; i--;) { document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString() }
  }
}
export function removeToken(name) {
  if (name) {
    return Cookies.remove(name)
  } else {
    return clearAllCookie()
  }
}
