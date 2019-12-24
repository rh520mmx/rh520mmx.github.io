<!--
  公用表格
 -->
<template>
  <div class="my-plugin-table">
    <!-- 表格头部布局 -->
    <div class="my-table-header">
      <span class="my-table-header-left table-tab-header">{{ tableConfig.title }}</span>
      <!-- 按条件查询模块 -->
      <div v-if="!tableConfig.title" class="search">
        <slot name="search" />
      </div>
      <div v-if="tableConfig.showHeaderOption" class="my-table-header-right">
        <!--表格头部操作项-->
        <!-- 表格头部操作按钮集合 -->
        <!--        v-if="option.isShow"-->
        <el-button
          v-for="(option, key) in headerOption"
          :key="key"
          :type="option.type"
          :title="option.name"
          :icon="option.icon"
          :loading="option.isLoading"
          @click="_TableOptionBtn({option})"
        >{{ option.name }}</el-button>
        <el-button
          v-if="isShowPop"
          v-popover:popover
          title="显隐列"
          icon="el-icon-menu"
        >
          <el-popover
            ref="popover"
            placement="bottom"
            width="200"
            trigger="click"
            popper-class="table-handle"
          >
            <el-checkbox
              v-for="(column,key) in columnConfig"
              :key="key"
              :checked="column.isHide"
              :name="column.prop"
              @change="_onIsCellHide(column)"
            >{{ column.label }}</el-checkbox>
          </el-popover>
          显隐列
        </el-button>
      </div>
    </div>
    <!-- 表格主体布局 -->
    <div class="table-content">
      <el-table
        v-loading="isLoading"
        element-loading-text="加载中，请稍后..."
        :class="isLoading ? 'is-loading':''"
        :data="tableDate"
        :style="'width: ' + tableConfig.tableWidth"
        sortable="custom"
        :default-sort="{prop: tableConfig.sortProp, order: 'descending'}"
        @sort-change="_sortChange"
        @row-click="_rowClick"
        @selection-change="_tableChangeRows"
        @header-dragend="_tableCellDragend"
      >
        <!-- 表格多选设置 -->
        <el-table-column v-if="tableConfig.selectMore" type="selection" width="50" />
        <!-- 表格编号设置 -->
        <el-table-column
          v-if="tableConfig.isIndexShow"
          label="编号"
          type="index"
          fixed="left"
          width="70"
          :index="_tableIndex"
        />

        <!-- 表格列循环设置 -->
        <!--        v-if="column.isHide"-->
        <div
          v-for="(column, key) in columnConfig"
          :key="key"
          class="column-table"
          :style="'width: ' + column.width + 'px'"
        >
          <el-table-column
            v-if="column.isHide && column.dateFormatter"
            :key="key"
            :sortable="Boolean(column.isSortable)"
            :formatter="dateFormat"
            show-overflow-tooltip
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
          />
          <el-table-column
            v-if="column.isHide && !column.dateFormatter"
            :key="key"
            :sortable="Boolean(column.isSortable)"
            :formatter="column.dateFormatter ? dateFormat : () => {}"
            show-overflow-tooltip
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
            :fixed="column.fixed"
          >
            <template slot-scope="scope">
              <!-- solt 自定义列-->
              <template v-if="column.type === 'slot'">
                <slot
                  :name="'col-' + column.slot"
                  :row="scope.row"
                />
              </template>
              <!-- 嵌套表格 -->
              <template v-else-if="column.children">
                <el-table-column
                  v-for="(childItem, childIndex) in column.children"
                  :key="childIndex + Math.random()"
                  :prop="childItem.prop"
                  :label="childItem.label"
                  :width="column.width"
                  :min-width="column.minWidth || '85px'"
                />
              </template>
              <!-- 标签 -->
              <el-tag v-else-if="column.type === 'tag'">
                {{ scope.row[item.prop] }}
              </el-tag>
              <!-- 图片 -->
              <img
                v-else-if="column.type === 'image' && scope.row[column.prop]"
                v-imgAlart
                height="50px"
                :src="scope.row[column.prop]"
              >
              <!--如果当前列存在格式化、点击事件则走第一个div-->
              <div
                v-if="column.formatter && column.click"
                @click.stop="_onTableFmtClick({event:column.click,row: scope.row})"
                v-html="column.formatter[scope.row[column.prop]] ? column.formatter[scope.row[column.prop]].replace('${value}', scope.row[column.prop]) : scope.row[column.prop]"
              />
              <!--如果当前列存在格式化则走第二个div-->
              <div
                v-else-if="column.formatter"
                v-html="column.formatter[scope.row[column.prop]] ? column.formatter[scope.row[column.prop]].replace('${value}', scope.row[column.prop]) : scope.row[column.prop]"
              />
              <!--否则则走第三个div-->
              <div v-else>{{ scope.row[column.prop] }}</div>
            </template>

          </el-table-column>
        </div>
        <!-- 表格操作列设置 -->
        <el-table-column
          v-if="tableConfig.showTableOption"
          prop="option"
          :width="tableConfig.cellOptionWidth"
          label="操作"
          fixed="right"
        >
          <template slot-scope="scope">
            <!--            v-if="option.isShow && scope.row[option.prop] == option.value"-->
            <template
              v-for="(option,key) in cellOption"
            >
              <!-- 自定义操作类型 -->
              <slot
                v-if="option.slot"
                :name="'bt-' + option.event"
                :data="{option, row: scope.row}"
              />
              <!--     操作按钮为文字     -->
              <span
                :key="key"
                :title="option.name"
                :class="`${option.icon} handler-text`"
                @click.stop="_TableOptionBtn({option, scope})"
              >{{ option.name }} </span>
            </template>
          </template>
        </el-table-column>

        <!-- 暂无数据插槽 -->
        <template slot="empty">
          <div class="my-empty-table">
            <div class="empty-txt">暂无数据</div>
          </div>
        </template>
      </el-table>
    </div>

    <!--表格底部布局，表格分页设置 jumper-->
    <el-pagination
      v-if="tableConfig.hasOwnProperty('showPagination') ? tableConfig.showPagination : !tableConfig.showPagination"
      class="my-table-footer"
      background
      layout="total, sizes, prev, pager, next"
      :current-page="tablePageConfig.page"
      :page-sizes="tablePageConfig.pageSizes"
      :page-size="tablePageConfig.pageSize"
      :total="tablePageConfig.count"
      @size-change="_tableSizeChange"
      @current-change="_tableCurrentChange"
    />
  </div>
</template>

<script>
import { message } from '@/utils/message-navication'
import { getLists } from '@/api/table'
import qs from 'qs'
import moment from 'moment'
// import { getToken } from '@/utils/auth'
import { loginUrl } from '@/utils/common-config'
import { loginTips } from '@/utils'

export default {
  name: 'Table',
  components: {},
  props: {
    table: {
      type: Object,
      default() {},
    },
    // 表格配置参数 表格名称 列宽 是否显示翻页 是否显示表头操作按钮，
    // 是否显示序号 是否显示多选框 ,是否显示操作栏  操作栏的宽度 等
    tableConfig: {
      type: Object,
      default() {
        return {
          title: '', // 标题
          showHeaderOption: true, // 是否显示表头操作按钮
          tableWidth: '100%', // 表格宽度
          selectMore: true, // 是否显示多选框
          isIndexShow: true, // 是否显示编号
          showTableOption: true, // 是否显示操作列
          cellOptionWidth: '200px', // 操作列宽
          showPagination: true, // 是否显示翻页
          select: [], // 被选中的行
        }
      },
    },
    // 表头操作按钮配置
    headerOption: {
      type: Array,
      default() {
        return []
      },
    },
    // 表格行 配置 （与elementUI 类似）
    columnConfig: {
      type: Array,
      default() {
        return []
      },
    },
    // 表格操作栏的操作按钮配置
    cellOption: {
      type: Array,
      default() {
        return []
      },
    },
    // 表格翻页参数 以及搜索参数
    tablePageConfig: {
      type: Object,
      default() {
        return {}
      },
    },
    // 是否自定义获取表格数据
    autoInit: {
      type: Boolean,
      default: false,
    },
    getListParams: {
      type: Object,
      default() {},
    },
    isShowPop: {
      type: Boolean,
      default() {
        return false
      },
    },
  },
  data() {
    return {
      isLoading: true,
      tableDate: [],
    }
  },
  mounted() {
    // 通过数据库查询用户保存的表格显隐列显示方式
    // 此处会调用后台接口 ，若需要可放出
    // this._initCellIsHide();

    // 初始化加载后台表格数据
    // this.initTableData();
    if (this.autoInit) {
      this.$emit('init-table', {})
    } else {
      this._initTable()
    }
  },
  methods: {
    /**
     * 格式化时间
     * */
    dateFormat(row, column) {
      const date = row[column.property]
      if (date === undefined || date === 'undefined') { return '' }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    /**
     * 初始化数据
     * 初始化读取数据库隐藏列,每列的宽度
     * @Method initCellIsHide
     */
    _initCellIsHide() {
    },

    /**
     * 表格数据格式化点击操作
     * 格式化点击事件
     * @Method onTableFmtClick
     */
    _onTableFmtClick(param) {
      this.table[param.event] ? this.table[param.event].call(this, param) : ''
    },

    /**
     * 自定义表格按钮统一操作
     *  判断父组件函数是否存在，如果存在则执行，否则不执行
     * @Method formSubmit
     */
    _TableOptionBtn({ option, scope }) {
      const { tableConfig } = this
      // 判断如果scope.row有数据说明是点击列表右侧按钮，否则是列表头部右侧按钮
      if (scope !== undefined) {
        tableConfig.select.push(scope.row)
        scope.select = tableConfig.select
      }
      this.table[option.fun] ? this.table[option.fun].call(this, { option, scope }) : ''
    },

    /**
     * 表格头部排序操作
     * @Method _sortChange
     */
    _sortChange(column) {
      if (column !== null) {
        // column.order == ascending 表示升序，descending 表示降序，否则为空
        console.log(column)
        const { order, prop } = column
        this.getListParams.sortInfo[0].propName = prop
        this.getListParams.sortInfo[0].sortMode = order === 'descending' ? 'desc' : 'asc'
        this._initTable()
      }
    },

    /**
     * 表格操作
     * 表格行选中操作
     * @Method _rowClick
     */
    _rowClick(row) {
      this.$emit('row-click', row)
    },

    /**
     * 表格处理操作
     * 勾选表格列数据显示隐藏
     * type说明：
     * 【1: table列的显示隐藏，2：table列的拖拽】
     * @Method excuteTable
     */
    _excuteTable(column, type) {
      // let cellString = ''
      // 遍历表头，更改表头数据模型，并拼接表头数据
      this.columnConfig.forEach(cell => {
        if (cell.prop === column.prop) {
          if (type === 1) { // 隐藏处理
            cell.isHide = !column.isHide
          } else { // 拖拽宽度处理
            cell.width = column.width
          }
        }
        // cellString += ',' + '{"prop":\"' + cell.prop + '\", \"width\":\"' + cell.width + '\" , \"isHide\": ' + cell.isHide + '}'
      })
      // console.log(this.columnConfig);
    },

    /**
     * 表格头部按钮操作
     * 勾选表格列数据显示隐藏
     * @Method onIsCellHide
     */
    _onIsCellHide(column) {
      this._excuteTable(column, 1)
    },

    /**
     * 表格头部列拖拽操作
     * 选中列边框进行左右拖拽，改变列的宽度，并更改模型数据，将其保存到数据库中
     * @Method tableCellDragend
     */
    _tableCellDragend(newWidth, oldWidth, column, event) {
      this._excuteTable({ prop: column.property, width: column.width }, 2)
    },

    /**
     * 表格列序号计算
     * 重新计算数据下标
     * @Method tableIndex
     */
    _tableIndex(index) {
      const { page, pageSize } = this.tablePageConfig
      return ((page - 1) * pageSize) + index + 1
    },
    /**
     * 初始化数据
     * 初始化加载列表数据
     * @Method _initTable
     */
    _initTable() {
      const { getListParams, tablePageConfig, tableConfig } = this
      const { page, pageSize } = tablePageConfig
      const params = {
        ...getListParams,
        page, pageSize,
      }
      this.isLoading = true
      getLists(tableConfig.url, qs.parse(params)).then((res) => {
        this.isLoading = false
        if (res) {
          const { Total, Page, Items } = res
          tablePageConfig.count = Total
          tablePageConfig.page = Page
          this.tableDate = Items
          this.$emit('table-data', res)
        }
      }).catch(() => {
        this.isLoading = false
        const currentUrl = location.href
        const confirmTips = document.getElementsByClassName('el-message-box__wrapper')[0]
        if (!confirmTips || confirmTips.getAttribute('style').indexOf('none') !== -1) {
          loginTips(this.$confirm, this.$store, loginUrl, currentUrl)
        }
      })
    },

    /**
     * 表格分页
     * 点击每页条数下拉列表进行选择数据进行查询
     * @Method tableSizeChange
     */
    _tableSizeChange(pageSize) {
      this.tablePageConfig.pageSize = pageSize
      this.tablePageConfig.page = 1
      this._initTable()
    },

    /**
     * 表格分页
     * 首先数据选择渲染this.table.page数据
     * 其次调用初始化table数据
     * @Method tableCurrentChange
     */
    _tableCurrentChange(page) {
      this.tablePageConfig.page = page
      this._initTable()
    },

    /**
     * 表格操作
     * 表格数据多选操作
     * @Method tableChangeRows
     */
    _tableChangeRows(row) {
      this.tableConfig.select = row
    },
    /**
     * 表格多选操作-检查
     * 检查表格数据多选操作,选中则返回ids字符串，未选择则返回false
     * @Method tableSelectMore
     */
    _tableSelectMore() {
      const { tableConfig } = this
      if (tableConfig.select.length < 1) {
        message(this, 'warning', '请勾选需要操作的项')
        return false
      } else {
        let str = ''
        this.table.select.map((v, i, arr) => {
          str += ',' + v.id
        })
        str = str.substr(1)
        return str
      }
    },

  },
}
</script>

<style lang="scss">
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";
  .set-page{
    height: 24px;
    line-height: 24px;
    min-width: 24px !important;
    vertical-align: top;
  }
  .my-plugin-table{
    width: 100%;
    height: 100%;
    position: relative;
    .el-pager li,
    .el-pagination button{
      @extend .set-page;
    }
    .el-table__empty-block{
      height: 400px !important;
      background:url("~@/assets/empty/empty.jpg") no-repeat center 120px;
      /*.empty-icon{*/
        /*font-size: 64px;*/
      /*}*/
      .el-table__empty-text{
        line-height: unset;
        margin-top: 100px;
        padding-left: 15px;
      }
    }
    .table-tab-header{
      display: inline-block;
      height: 48px;
      padding: 0 12px;
      font-size: 14px;
      font-weight:900;
      color: rgba(109,114,131,1);
      background-color: $hearderBgColor;
      border: 1px solid $borderColorTable;
      border-bottom: none;
      position: absolute;
    }
    .el-pagination__sizes{
      .el-input__inner{
        @extend .set-page;
      }
    }
    .el-pagination__editor.el-input {
      vertical-align: middle;
      .el-input__inner{
        @extend .set-page;
      }
    }
    .el-table th.gutter {
      display: table-cell !important;
    }

    .el-table colgroup.gutter {
      display: table-cell !important;
    }
    .search{
      float: left;
      width: 60%;
    }
    .handler-text{
      color: $themeColor;
      margin-right: 5px;
      cursor: pointer;
      &:hover {
        color: $themeHoverColor;
      }
      &:active{
        color: $themeActiveColor;
      }
    }
    .my-table-header{
      width: 100%;
      border-bottom: 1px solid $borderColorTable;
      height: 48px;
      overflow: hidden;
      /*position: relative;*/
    }
    .my-table-header-left{
      float: left;
      line-height: 48px;
    }
    .my-table-header-right{
      float: right;
      width: 40%;
      text-align: right;
    }
    .table-content{
      /*padding: 0 24px;*/
      padding: 0;
      height: 100%;
      border: 1px solid $borderColorTable;
      border-top: unset;
      border-bottom: unset;

    }
    .my-table-footer{
      width: 100%;
      height: 48px;
      padding: 10px 92px 0 24px;
      @include boxSizing;
      text-align: right;
      position: relative;
      border: 1px solid $borderColorTable;
      .el-pagination__total{
        font-size:12px;
        color:$pageFontColor;
        margin-right: 6px;
      }
      .el-select {
        .el-input{
          width: 72px;
          .el-input__inner{
            padding-right: 18px;
          }
        }
      }
      .el-pager{
        li{
          margin: 0;
          background-color: unset;
          border: 1px solid $borderColorTable;
          border-right: unset;
          font-size: 12px;
          font-weight: 400;
          @extend .el-pagination__total;
          &:last-of-type{
            border-right: 1px solid $borderColorTable;
            border-bottom-right-radius: 2px;
          }
          &:first-of-type{
            border-bottom-left-radius: 2px;
          }
          &:not(.disabled).active{
            background-color: unset;
            color: $themeColor;
          }
        }
        .more::before{
          line-height: unset;
        }
      }
      span:not([class*=suffix]){
        @extend .el-pagination__total;
      }
      .btn-prev,
      .btn-next{
        background-color: unset;
        border: 1px solid $borderColorTable;
        @extend .el-pagination__total;
        &:disabled{
          background-color: #eee;
        }
      }
      .btn-prev{
        margin-left: 0;
      }
      .btn-next{
        margin-right: 0;
      }
      .el-input__inner{
        @extend .el-pagination__total;
      }
      .el-pagination__sizes{
        margin: unset;
        position: absolute;
        right: 5px;
        top: 53%;
        @include transformMixin(translateY(-50%));
      }
      .el-pagination__jump{
        margin-left: 8px;
        vertical-align: middle;
      }
    }

    .el-table__body{
      width: 100%;
      table-layout: fixed !important;
    }
    thead{
      height: 46px;
      line-height: 46px;
      font-size: 14px;
      th{
        padding: 0;
        background: $hearderBgColor;
        font-size: 14px;
        color: rgba(109,114,131,1);
      }
    }
    td{
      height: 47px;
      line-height: 47px;
      font-size: 14px;
      padding: 6px 0;
      .cell div{
        @include textOverFlow;
        display: unset;
      }
    }
    // 滚动条的宽度
    /deep/ .el-table__body-wrapper::-webkit-scrollbar {
      width: 6px; // 横向滚动条
      height: 6px; // 纵向滚动条 必写
      cursor: pointer;
    }
    // 滚动条的滑块
    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 3px;
    }
    .el-table__fixed{
      height: 100% !important;
    }
    .el-table__fixed-right{
      height: 100% !important;
      right: 0 !important;
    }
  }
  .table-handle{
    .el-checkbox{
      min-width: 40% !important;
      &:nth-of-type(2n){
        margin-right: 0 !important;
      }
    }
  }
</style>
