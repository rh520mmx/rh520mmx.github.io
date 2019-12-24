<template>
  <el-color-picker
    v-model="theme"
    :predefine="currentLists"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
  />
</template>

<script>
const version = require('element-ui/package.json').version // element-ui version from node_modules
const ORIGINAL_THEME = '#409eff' // element默认颜色  不能改成其他

export default {
  props: {
    currentLists: {
      type: Array,
      default() {},
    },
  },
  data() {
    return {
      chalk: '', // content of theme-chalk css
      theme: '',
      currentThemeLists: [],
      setTheme: 'style1',
    }
  },
  computed: {
    defaultTheme() {
      // 默认显示 UI设计稿默认主题色
      return this.$store.state.settings.theme || this.currentLists[5]
    },
  },
  watch: {
    currentLists(themeLists) {
      this.currentThemeLists = themeLists
      this.theme = themeLists[5]
    },
    defaultTheme: {
      handler: function(val, oldVal) {
        this.theme = val
      },
      immediate: true,
    },
    async theme(val, oldVal) {
      // 这个需要隐藏  否则不能修改  其他颜色 因为这种写法会限制死了修改主题的范围
      // const oldVal = this.chalk ? this.theme : ORIGINAL_THEME
      console.log(this.theme, oldVal)
      if (typeof val !== 'string') return
      const themeCluster = this.getThemeCluster(val.replace('#', ''))
      let originalCluster = this.getThemeCluster(oldVal.replace('#', ''))

      const $message = this.$message({
        message: '主题色替换中，请稍后',
        type: 'success',
        customClass: 'theme-message',
        duration: 0, // 设置为0不会自动关闭
        iconClass: 'el-icon-loading',
      })

      const getHandler = (variable, id) => {
        return () => {
          originalCluster = this.getThemeCluster(ORIGINAL_THEME.replace('#', ''))
          const newStyle = this.updateStyle(this[variable], originalCluster, themeCluster)
          let styleTag = document.getElementById(id)
          if (!styleTag) {
            styleTag = document.createElement('style')
            styleTag.setAttribute('id', id)
            document.head.appendChild(styleTag)
          }
          styleTag.innerText = newStyle
        }
      }

      const chalkHandler = getHandler('chalk', 'chalk-style')

      if (!this.chalk) {
        const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`
        await this.getCSSString(url, 'chalk')
      } else {
        chalkHandler()
      }

      const styles = [].slice.call(document.querySelectorAll('style'))
        .filter(style => {
          const text = style.innerText
          return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
        })
      styles.forEach(style => {
        const { innerText } = style
        if (typeof innerText !== 'string') return
        style.innerText = this.updateStyle(innerText, originalCluster, themeCluster)
      })

      // 响应外部操作
      this.$emit('change', val)
      $message.close()
      this.$message({
        message: '换肤成功',
        type: 'success',
      })
    },
  },
  created() {
    if (!sessionStorage.getItem('theme')) {
      return
    }
    // todo: 在这里请求 获取主题
    this.theme = sessionStorage.getItem('theme')
    this.$store.dispatch('settings/changeSetting', {
      key: 'theme',
      value: this.theme,
    })
  },

  methods: {
    /**
     * 更新样式
     * @param style 当前样式内容
     * @param oldCluster 修改前的主题样式
     * @param newCluster 主题样式
     * @returns {*}
     */
    updateStyle(style, oldCluster, newCluster) {
      let newStyle = style
      oldCluster.forEach((color, index) => {
        newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
      })
      return newStyle
    },

    /**
     * 获取element 样式
     * @param url 获取地址
     * @param variable  当前样式文件名
     * @returns {Promise<unknown>}
     */
    getCSSString(url, variable) {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '')
            resolve()
          }
        }
        xhr.open('GET', url)
        xhr.send()
      })
    },

    /**
     * 根据主题色计算其他颜色
     * @param theme 主题色
     * @returns {[*]}
     */
    getThemeCluster(theme) {
      const tintColor = (color, tint) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)
        if (tint === 0) { // when primary color is in its rgb space
          return [red, green, blue].join(',')
        } else {
          red += Math.round(tint * (255 - red))
          green += Math.round(tint * (255 - green))
          blue += Math.round(tint * (255 - blue))

          red = red.toString(16)
          green = green.toString(16)
          blue = blue.toString(16)

          return `#${red}${green}${blue}`
        }
      }

      const shadeColor = (color, shade) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        red = Math.round((1 - shade) * red)
        green = Math.round((1 - shade) * green)
        blue = Math.round((1 - shade) * blue)

        red = red.toString(16)
        green = green.toString(16)
        blue = blue.toString(16)

        return `#${red}${green}${blue}`
      }
      const clusters = [theme]
      for (let i = 0; i <= 9; i++) {
        clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
      }
      clusters.push(shadeColor(theme, 0.1))
      return clusters
    },
  },
}
</script>

<style>
  .theme-message,
  .theme-picker-dropdown {
    z-index: 99999 !important;
  }

  .theme-picker .el-color-picker__trigger {
    height: 26px !important;
    width: 26px !important;
    padding: 2px;
  }

  .theme-picker-dropdown .el-color-dropdown__link-btn {
    display: none;
  }
</style>
