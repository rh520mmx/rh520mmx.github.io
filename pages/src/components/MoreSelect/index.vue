<template>
  <div class="more-select">
    <el-select
      v-model="myValue"
      v-el-select-loadmore="loadMore"
      filterable
      remote
      reserve-keyword
      :placeholder="placeholder"
      :remote-method="load"
      :loading="searchLoading"
      style="width: 100%"
      @change="myChange"
    >
      <el-option
        v-for="item in data"
        :key="item[optionKey]"
        :label="item[optionLabel]"
        :value="item[optionValue]"
      />
      <el-option
        v-if="loadingMore"
        label="加载中"
        value=""
        style="text-align: center"
        disabled
      />
      <el-option
        v-if="noMore"
        label="没有数据了..."
        value=""
        style="text-align: center"
        disabled
      />
    </el-select>
  </div>
</template>

<script>

export default {
  name: 'MoreSelect',
  directives: {
    'el-select-loadmore': {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          /**
           * scrollHeight 获取元素内容高度(只读)
           * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
           * clientHeight 读取元素的可见高度(只读)
           * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
           * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
           */
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) {
            binding.value()
          }
        })
      },
    },
  },
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    remoteMethod: {
      type: Function,
      default: null,
    },
    optionKey: {
      type: String,
      default: '',
    },
    optionLabel: {
      type: String,
      default: '',
    },
    optionValue: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      myValue: this.value,
      data: [],
      searchLoading: false,
      pageIndex: 1,
      searchText: '',
      loadingMore: false,
      noMore: false,
    }
  },
  watch: {
    // 监听prop传的value，如果父级有变化了，将子组件的myValue也跟着变，达到父变子变的效果
    value(newVal) {
      this.myValue = newVal
    },
    // 监听myValue，如果子组件中的内容变化了，通知父级组件，将新的值告诉父级组件，我更新了，父级组件接受到值后页就跟着变了
    myValue(newVal) {
      this.$emit('input', newVal)
    },
  },
  mounted() {
  },
  methods: {
    load(query) {
      if (!query || this.searchLoading) { return }
      this.searchText = query
      this.pageIndex = 1
      this.noMore = false
      this.searchLoading = true
      this.remoteMethod(query, this.pageIndex).then((data) => {
        if (data && data.Items) { this.data = data.Items }
        this.searchLoading = false
      })
    },
    loadMore() {
      if (this.noMore === true || !this.searchText) { return }
      this.loadingMore = true
      this.remoteMethod(this.searchText, ++this.pageIndex).then((data) => {
        if (data && data.Items.length > 0) {
          this.data = [...this.data, ...data.Items]
        } else { this.noMore = true }
        this.loadingMore = false
      })
    },
    myChange(value) {
      let obj = {}
      obj = this.data.find(
        item => {
          return item[this.optionValue] === value // 筛选出对应数据
        })
      this.$emit('change', obj)
    },
  },
}
</script>

<style scoped lang="scss">
</style>
