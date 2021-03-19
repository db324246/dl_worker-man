<template>
  <div class='page_container'>
    <div class="toolbar">
      <div class="toolbar_handler">
        <el-button size='mini' @click='handleSearch'>添加用户</el-button>
      </div>
      <div class="toolbar_filter-row">
        <div class="toolbar_filter-item">
          用户名：
          <el-input size='mini' v-model="queryList.username" placeholder="请输入内容"></el-input>
        </div>
        <div class="toolbar_filter-item">
          <el-button size='mini' type='primary' @click='handleSearch'>搜索</el-button>
        </div>
      </div>
    </div>
<!-- avatar: ""
createTime: "2021-03-15T08:36:48.110Z"
identityId: 0
password: "tt123456"
sex: 1
startTime: "2021-03-19 17:16"
status: 1
telephone: "13160462815"
username: "婷婷小可爱"
workRecordJson: ""
_id: "604b1c7163ac4548a49bbd0a" -->
    <el-table :data='tableData' style='width: 100%'>
      <el-table-column prop='username' label='姓名'>
      </el-table-column>
      <el-table-column prop='sex' label='性别' >
      </el-table-column>
      <el-table-column prop='telephone' label='手机号码' >
      </el-table-column>
      <el-table-column prop='createTime' label='注册/创建时间'>
      </el-table-column>
      <el-table-column prop='status' label='状态'>
        <template scope-slot="scope">
        
            
          
        </template>
      </el-table-column>
    </el-table>
    
    <div class='pagination-container'>
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
  </div>
</template>

<script>
import { userList } from '@/api/user'
export default {
  name: 'user',
  data() {
    return {
      queryList: {
        username: '',
        pageNumber: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      userList(this.queryList).then(res => {
        this.tableData = res.list
        this.total = res.total
      }).catch(err => console.log(err))
    },
    handleSearch() {
      this.queryList.pageNumber = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.queryList.pageSize = val
      this.queryList.pageNumber = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryList.pageNumber = val
      this.getList()
    }
  }
}
</script>

<style lang='less' scoped>

</style>