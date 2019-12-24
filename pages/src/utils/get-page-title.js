import defaultSettings from '@/settings'

const title = defaultSettings.title || '云运维客户中心'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
