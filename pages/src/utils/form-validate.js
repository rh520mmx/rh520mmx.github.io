// elementUI的form表单自定义验证规则

const email = /^(https?:|mailto:|tel:)/

/**
 * 验证邮箱
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export function v_email(rule, value, callback) {
  const { field } = rule
  if (!value) {
    return callback(new Error(`${field}不能为空`))
  } else {
    if (!email.test(value)) {
      return callback(new Error(`${field}格式不正确`))
    } else {
      return callback()
    }
  }
}

