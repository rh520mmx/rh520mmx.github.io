<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link key="collapse" class="sidebar-logo-link" to="/" :title="title">
        <img :src="collapse ? logoSmall : logo" class="sidebar-logo">
      </router-link>
    </transition>
  </div>
</template>

<script>
import logo from '@/assets/logo/logo_white.png'
import logoSmall from '@/assets/logo/logo_small.png'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      title: '云运维客户中心',
      logo,
      logoSmall,
    }
  },
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: $navBarHeight;
  line-height: $navBarHeight;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: myFont, Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
