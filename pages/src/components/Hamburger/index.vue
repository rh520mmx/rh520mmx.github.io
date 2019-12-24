<template>
  <div class="hamburger-box" @click="toggleClick">
    <svg
      :class="{'is-active':isActive}"
      class="hamburger"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
    >
      <path fill="#fff" d="M320.47104 356.92544l-171.2128 171.66336 169.82016 169.82016 1.39264-341.48352zM147.61984 762.6752h750.10048v81.22368H147.61984zM416.48128 487.05536h481.19808v81.22368H416.48128zM147.61984 211.39456h750.10048v81.22368H147.61984z" />
    </svg>
  </div>

</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    },
  },
}
</script>

<style scoped>
  .hamburger-box{
    padding: 0 15px;
  }
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  color: #fff;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
