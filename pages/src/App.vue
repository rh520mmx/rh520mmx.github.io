<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { getToken } from '@/utils/auth' // get token from cookie

export default {
  name: 'App',
  data() {
    return {

    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo || getToken('userInfo')
    },
  },
  mounted() {
    // console.log('this.$router：', this.$router.push('/404'));
    // this.$store.dispatch('user/login')
  },
}
</script>
