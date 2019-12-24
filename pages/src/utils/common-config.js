export const loginUrl = (url, isOut) => {
  const loginOrOut = isOut ? 'logout' : 'login'
  return `${process.env.VUE_APP_BASE_API}/auth/${loginOrOut}.svc?callbackUrl=${encodeURIComponent(`${url}`)}`
}
// 公共的搜索按钮
export const searchBtn = [
  { name: '查询', btnType: 'search', fun: 'onSearchList', type: 'primary' },
  { name: '重置', btnType: 'cancel', fun: 'onCancelSearch', type: 'default' },
]
// 高级搜索项
export const moreSearch = [
  {
    label: '是否百强：',
    type: 'isTop100',
    items: [
      { Name: '全部', Id: '' },
      { Name: '是', Id: 1 },
      { Name: '否', Id: 0 },
    ],
  },
  {
    label: '授权应用：',
    type: 'authorizedApp',
    items: [],
  },
]

// 翻页参数
export const pageConfig = {
  pageSize: 10,
  pageSizes: [1, 2, 3, 4, 5].map((val) => {
    return val * 10
  }),
  count: 0,
}

// export const themeLists = {
//   whiteStyle: ['#F0FDFF', '#CFF6FF', '#A6ECFF', '#7DDEFF', '#50C6F5', '#27AAE7', '#1586C2', '#0B649D', '#024475', '#012B4F'],
//   blackStyle: ['#F5F0FF', '#DDCFFF', '#BEA6FF', '#9B7DFF', '#7251F5', '#4726E7', '#2E16C2', '#180B9C', '#0A0275', '#03014F'],
// }
