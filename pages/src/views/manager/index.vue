<template>
  <div class="app-container">
    <el-button @click="onGoMdEvent">测试跳转</el-button>
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
        const domain = document.domain
        // this.$router.push(`${domain}/docs/doc/test1.html`)
        console.log(domain);
        // window.location.href = `https://${domain}/doc/test1.html`
        window.location.href = `https://${domain}/testDocs`
      },
    },
  }
</script>·

<style lang="scss" scoped>

</style>
