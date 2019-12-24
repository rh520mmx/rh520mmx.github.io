<template>
  <div class="page-title-header">{{ title }}</div>
</template>

<script>
export default {
  name: 'Index',
  components: {},
  props: {
    title: {
      type: String,
      default() {
        return ''
      },
    },
  },
  created() {
  },
  methods: {},
}
</script>

<style scoped lang="scss">
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";
.page-title-header{
  font-size: 14px;
  font-weight: 900;
  color:rgba(62,67,82,1);
  position: relative;
  margin-bottom: $margin;
  &::before{
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(55,136,255,1), rgba(31,79,255,1));
    margin-right: 5px;
  }
  &::after{
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    background-color: #fff;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 3px;
    @include transformMixin(translateY(-50%));
  }
}
</style>
