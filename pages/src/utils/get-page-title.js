import defaultSettings from '@/settings'

const title = defaultSettings.title || '测试gitbook'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
