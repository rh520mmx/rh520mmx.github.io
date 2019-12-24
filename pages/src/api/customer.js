import request from '@/utils/service'

export function getMdmkhList(data) {
  return request({
    url: `/mdmkh/searchnames.svc`,
    method: 'post',
    data,
  })
}

export function getMdmkhDetail(khGuid) {
  return request({
    url: `/mdmkh/${khGuid}.svc`,
    method: 'get',
  })
}

export function getCustomerDetail(id) {
  return request({
    url: `/tenant/${id}.svc`,
    method: 'get',
  })
}

export function createCustomer(data) {
  return request({
    url: '/tenant/add.svc',
    method: 'post',
    data,
  })
}

export function updateCustomer(id, data) {
  return request({
    url: `/tenant/${id}.svc`,
    method: 'put',
    data,
  })
}

export function getApps(data) {
  return request({
    url: '/module/list.svc',
    method: 'get',
    data,
  })
}

export function auth(tenant_id, data) {
  return request({
    url: `/tenant/${tenant_id}/module/authorize.svc`,
    method: 'post',
    data,
  })
}

