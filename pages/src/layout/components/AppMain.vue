<template>
  <section class="app-main">
    <breadcrumb class="breadcrumb-container" />
    <div class="app-content">
      <el-scrollbar wrap-class="scrollbar-wrapper" style="height: 100%">
        <transition name="fade-transform" mode="out-in">
          <router-view :key="key" />
        </transition>
      </el-scrollbar>
    </div>
  </section>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
export default {
  name: 'AppMain',
  components: { Breadcrumb },
  computed: {
    key() {
      return this.$route.path
    },
  },
}
</script>

<style scoped lang="scss">
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";
.app-main {
  /*50 + 48 = navbar  */
  min-height: calc(100% - 48px);
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: $navBarHeight;
}
  .breadcrumb-container{
    width: 100%;
    background: $barBgColor;
    box-shadow: $navBoxShadow;
  }
  .app-content{
    width: calc( 100% - #{$margin} * 2 );
    height: calc( 100% - #{$breadcrumbHeight} - #{$margin} * 2 );
    background: $barBgColor;
    margin: $margin;
    @include boxSizing;
    padding: 10px;
    //padding: $padding ;
  }
</style>

<style lang="scss">
</style>
