export default {
  computed: {
    device() {
      return this.$store.state.app.device
    },
  },
  mounted() {
    // 为了修正ios 点击菜单 触发mouseleave 错误
    this.fixBugIniOS()
  },
  methods: {
    fixBugIniOS() {
      const $subMenu = this.$refs.subMenu
      if ($subMenu) {
        const handleMouseleave = $subMenu.handleMouseleave
        $subMenu.handleMouseleave = (e) => {
          if (this.device === 'mobile') {
            return
          }
          handleMouseleave(e)
        }
      }
    },
  },
}
