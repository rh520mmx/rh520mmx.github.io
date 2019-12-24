import request from '@/utils/service'
/**
 * 获取租户列表
 * @param url
 * @param data
 * @returns {AxiosPromise}
 */
export function getLists(url, data) {
  return request({
    url,
    method: 'post',
    data,
  })
}

/**
 * 导出租户列表
 * @param params
 * @returns {AxiosPromise}
 */
export function exportListTenant(data) {
  return request({
    url: `/tenant/export.svc?data=${data}`,
    method: `get`,
  })
}

export function deleteTenantLine(id) {
  return request({
    url: `/tenant/${id}.svc`,
    method: `delete`,
  })
}
