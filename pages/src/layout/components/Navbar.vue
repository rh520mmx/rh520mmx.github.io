<template>
  <div class="navbar">
    <logo v-if="showLogo" :collapse="isCollapse" class="logo" />
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <div class="right-menu">
      <el-avatar class="user-avatar" :size="30" :src="userInfo ? userInfo.UserIcon : `https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png` " />
      <span class="user-item ">{{ userInfo ? userInfo.UserName : '暂无' }}</span>
      <el-divider direction="vertical" class="user-divider" />
      <span class="user-item user-logout" title="退出" @click="logout">
        <svg-icon icon-class="logout" />
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import { loginUrl } from '@/utils/common-config'
import Logo from './Sidebar/Logo'
import { getToken } from '@/utils/auth' // get token from cookie

export default {
  components: { Hamburger, Logo },
  data() {
    return {
      userInfo: getToken('userInfo') && JSON.parse(getToken('userInfo')),
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
    ]),
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    // userAvatar() {
    //   const { userInfo } = this.$store.getters
    //   const defaultAvatar = `https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png`
    //   return userInfo.UserIcon ? userInfo.UserIcon : defaultAvatar
    // },
    // userInfo() {
    //   return this.$store.getters.userInfo
    // },
  },
  watch: {
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      location.replace(loginUrl(location.href))
    },
  },
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";
  @import "~@/styles/mixin.scss";
.navbar {
  height: $navBarHeight;
  overflow: hidden;
  position: relative;
  background: $themeColorGra;
  box-shadow: $navBoxShadow;
  .logo{
    width: $sideBarWidth;
    display: inline-block;
    float: left;
    @include transition(width linear .3s);
  }

  .hamburger-container {
    line-height: $navBarHeight;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    color: $barColor;
    -webkit-tap-highlight-color:transparent;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: $navBarHeight;
    margin-right: 30px;
    .user-avatar{
      vertical-align: middle;
      margin-right: 4px;
    }
  }
  .user-item{
    font-size:14px;
    color:rgba(255,255,255,1);
    /*margin-left: 5px;*/
    &.user-logout{
      cursor: pointer;
      font-size: 17px;
      &:hover{
        color: rgba(255,255,255,.8);
      }
    }
  }
  .user-divider{
    margin: 0 12px;
  }
}
</style>
