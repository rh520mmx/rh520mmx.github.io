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
      // this.$router.push(`${process.env.VUE_APP_BASE_API}/#/docs`)
      this.$router.push(`docs/doc/test1.html`)
      // window.location.href = `/#/docs/doc/test1.html`
    }
  },
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";
  .search{
    width: 270px;
    margin-right: $boxMargin;
  }
  .el-icon-search{
    line-height: 32px !important;
  }
  .search-section{
    margin-bottom: $margin;
    .search-label{
      display: inline-block;
      float: left;
      font-size: $fontSize;
      color: $fontColorStrong;
      line-height: 24px;
    }
  }
  .more-search{
    margin-bottom: $margin;
  }
</style>
