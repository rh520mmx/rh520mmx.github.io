<template>
  <div class="app-container">
    <el-button @click="onGoMdEvent">gitbook主页</el-button>
    <el-button @click="onGoMdEvent1">测试跳转</el-button>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Dashboard',
    components: {  },
    data() {
      return {
      }
    },
    computed: {
      ...mapGetters([
        'UserName',
      ]),
    },
    created() {

    },
    methods: {
      onGoMdEvent(){
        // this.$router.push(`${process.env.VUE_APP_BASE_API}/#/docs`)
        const domain = document.domain
        console.log(domain);
        // this.$router.push(`${domain}/docs`)
        window.location.href = `https://${domain}/docs`
      },
      onGoMdEvent1(){
        const domain = document.domain
        // this.$router.push(`${domain}/docs/doc/test1.html`)
        console.log(domain);
        window.location.href = `https://${domain}/docs/doc/test1.html`
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
