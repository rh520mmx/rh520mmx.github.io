<template>
  <div class="login-page">
    <div class="login-error">
      <p v-if="!isErrorLogin" class="error-tip-header">{{ loadingText }}</p>
    </div>
    <div v-if="isErrorLogin" class="login-error">
      <p class="error-tip-header">登录失败，您可以选择联系管理员或者重新登陆</p>
      <el-button @click="onLoginAgain">重新登陆</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loadingText: '检测登录中...',
      isErrorLogin: false,
    }
  },
  created() {
  },
  mounted() {
    Promise.all([this.$store.dispatch('user/login')]).then((data) => {
      if (data && data[0] === undefined) {
        this.isErrorLogin = true
        return
      }
      this.loadingText = '首页跳转中...'
      const { query } = this.$route
      this.$router.push({
        path: query.redirect || '/',
      })
    }).catch((err) => {
      this.isErrorLogin = true
      console.log('检查是否登录：', err)
    })
  },
  methods: {
    onLoginAgain() {
      this.$store.dispatch(`user/logout`)
    },
  },
}
</script>
<style lang="scss" scoped>
  @import "~@/styles/variables.scss";
  .login-page{
    width: 100%;
    height: 100%;
    position: relative;
    .login-error{
      width: fit-content;
      position: absolute;
      top: 50%;
      left: 50%;
      text-align: center;
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      -o-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
    }
    .error-tip-header{
      margin-bottom: 15px;
      padding-left: 10px;
      font-size: 26px;
      font-weight: bold;
      line-height: 40px;
      color: $themeColor;
    }
  }
</style>
