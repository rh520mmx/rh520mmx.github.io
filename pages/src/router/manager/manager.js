export function manager(Layout, spinRoute) {
  return {
    path: '/',
    component: Layout,
    redirect: '/tenant',
    name: 'Manager',
    meta: { title: '租户管理', icon: '', activeMenu: '/tenant' },
    children: [
      {
        path: 'tenant',
        name: 'Tenant',
        component: resolve => {
          spinRoute.show()
          require(['@/views/manager/index'], spinRoute.resolve(resolve))
        },
        meta: { title: '租户列表', icon: 'manager_default', hoverIcon: 'manager_hover', activeMenu: '/tenant' },
      }
    ],
  }
}
