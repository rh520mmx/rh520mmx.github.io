/**
 * 常规message提示框
 * @param that {Object}  当前组件的this
 * @param type {String} 提示框类型  值可以为 success info error warning
 * @param message {String} 提示信息
 * @param linkUrl {JSON} 链接(description, url)
 * @param iconClass {String} 覆盖默认icon的类名
 * @param center {String} 文字是否居中
 * @param dangerouslyUseHTMLString {Boolean} 为true 就会被当作 HTML 片段处理
 */
export const message = (that, type, msg, linkUrl, center, iconClass, dangerouslyUseHTMLString) => {
  const params = { that, type, message: msg, linkUrl, center, iconClass, dangerouslyUseHTMLString }
  params.showClose = true
  if (linkUrl) { // 如果超链接存在
    const h = that.$createElement
    params.showClose = false
    params.message = h('p', { class: 'message-content' }, [
      h('span', { class: 'message-info' }, msg),
      h('a', {
        attrs: {
          href: `#${linkUrl.url}`,
        },
        class: `${params.showClose ? 'message-url' : 'message-url no-close'}`,
      }, linkUrl.description),
    ])
  }
  params.dangerouslyUseHTMLString = linkUrl && Object.keys(linkUrl).length > 0
  params.customClass = `my-message-tips ${type}`
  that.$message({ ...params })
}

/**
 * navication提示框
 * @param that {Object} 当前组件的this指向
 * @param title {String} 提示标题
 * @param message {String}  提示内容
 * @param dangerouslyUseHTMLString {Boolean}  如果有操作，就使用模板字符串渲染
 * @param callBack 带操作的提示框的确认操作事件回调
 * @param iconClass {String} 更改图标
 * @param type {String} 提示类型 （不传则不显示图标）
 */
export const notification = (that, title, msg, type, dangerouslyUseHTMLString, callBack, iconClass) => {
  const params = { that, title, message: msg, type, iconClass }
  if (type || iconClass) { // 设置默认类名
    params.customClass = 'has-icon'
  }
  if (dangerouslyUseHTMLString) {
    const h = that.$createElement
    params.dangerouslyUseHTMLString = true
    params.message = h('div', null, [
      h('p', null, msg),
      h('div', { class: 'notice-footer' }, [
        h('el-button', {
          attrs: {
            type: 'primary',
          },
          on: {
            click: () => {
              callBack()
            },
          },
        }, '操作按钮'),
      ]),
    ])
    params.duration = 0
  }
  that.$notify({ ...params })
}

/**
 * 确认框
 * @param that 当前组件this指向
 * @param title 提示title
 * @param content 提示内容
 * @param confirmCallback 点击确定之后 的回调
 * @param isConfirm 是否为二次确认框  （默认是二次确认）
 * @param type 二次确认框类型 可取值 success / info / warning / error
 * @param btnConfig 自定义确定按钮文字
 */
export const confirm = (that, title, content, confirmCallback, isConfirm, type, btnConfig) => {
  const btnText = {
    confirmButtonText: btnConfig || '确定',
    cancelButtonText: '取消',
  }
  that.$confirm(content, title, {
    ...btnText,
    showCancelButton: !isConfirm,
    type: type || 'success',
    customClass: type ? `confirm-${type}` : `confirm-success`,
  }).then(() => {
    confirmCallback()
  }).catch(() => {
    console.log('cancel')
  })
}

/**
 * 顶部自动消失的普通提示框
 * @param that 组件所在this
 * @param type 提示框类型
 * @param message 提示信息
 */
export const autoCloseMessage = (that, type, msg) => {
  that.$message({
    type, message: msg,
    customClass: 'auto-close-message',
    showClose: false,
  })
}
