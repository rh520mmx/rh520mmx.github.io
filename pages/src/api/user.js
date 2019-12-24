import request from '@/utils/service'

export function checkLogin() {
  return request({
    url: `/auth/check.svc`,
    method: 'get',
  })
}

