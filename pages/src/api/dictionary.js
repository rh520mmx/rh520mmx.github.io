import request from '@/utils/service'

/**
 * 获取是否授权
 * @returns {*}
 */
export function getIsAthor() {
  return request({
    url: `/app/list.svc`,
    type: 'get',
  })
}

/**
 * 获取所有区域
 * @returns {*}
 */
export function getAllAreaUrl() {
  return request({
    url: `/area/list.svc`,
    type: 'get',
  })
}
