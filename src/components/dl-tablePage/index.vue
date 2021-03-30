<template>
  <div class='dl-tablePage'>
    <div class="toolbar">
      <div class="toolbar_handler">
        <slot name="tool-buttons"></slot>
      </div>
      <div class="toolbar_filter-row">
        <slot name="tool-filter"></slot>
      </div>
    </div>

    <el-table
      :data='tableData'
      :border="border"
      style='width: 100%'
      @selection-change="$emit('selection-change', $event)">
      <slot name="table-columns"></slot>
    </el-table>

    <div v-if="hasPagenation" class='pagination-container'>
      <el-pagination
        @size-change='handleSizeChange'
        @current-change='handleCurrentChange'
        :current-page='queryList.pageNumber'
        :page-sizes='[10, 20, 50, 100]'
        :page-size='queryList.pageSize'
        layout='total, sizes, prev, pager, next, jumper'
        :total='total'>
      </el-pagination>
    </div>

    <slot></slot>
  </div>
</template>

<script>
import { deepClone } from '@utils'
export default {
  name: 'dl-tablePage',
  props: {
    getList: {
      type: Function,
      default: null
    },
    getDataInCreated: {
      type: Boolean,
      default: true
    },
    hasPagenation: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      queryList: {
        pageNumber: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0
    }
  },
  created() {
    this.getDataInCreated && this.requestData()
  },
  methods: {
    requestData() {
      if (!this.getList) return
      new Promise(r => {
        const params = this.hasPagenation
          ? deepClone(this.queryList)
          : {}
        this.getList(params, r)
      })
        .then(res => {
          this.tableData = res.list || []
          this.total = res.total || 0
        })
    },
    resolveData(data) {
      this.tableData = data.list || []
      this.total = data.total || 0
    },
    handleSearch() {
      this.queryList.pageNumber = 1
      this.requestData()
    },
    handleSizeChange(val) {
      this.queryList.pageSize = val
      this.queryList.pageNumber = 1
      this.requestData()
    },
    handleCurrentChange(val) {
      this.queryList.pageNumber = val
      this.requestData()
    }
  }
}
</script>
