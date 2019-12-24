<template>
  <div class="app-container">
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
      onGoMdEvent1(){
        const domain = document.domain
        window.location.href = `https://${domain}/docs/doc/test1.html`
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
