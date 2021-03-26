<template>
  <dl-tablePage
    ref="dlTablePage"
    :get-list="getList"
    :has-pagenation="false">
    <el-button slot="tool-buttons" size='mini' @click='handleAdd'>新建团队</el-button>

    <template slot="tool-filter">
      <div class="toolbar_filter-item">
        团队名称：
        <el-input size='mini' v-model="queryList.username" placeholder="请输入内容"></el-input>
      </div>
      <div class="toolbar_filter-item">
        <el-button size='mini' type='primary' @click='$refs.dlTablePage.handleSearch()'>搜索</el-button>
      </div>
    </template>

    <template slot="table-columns">
      <el-table-column prop='username' label='姓名' min-width="100px">
        <template slot-scope="{row}">
          <router-link class="link-cursor" :to="`/userInfo/${row.id}`">{{row.username}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop='sex' label='性别' >
        <template slot-scope="{row}">
          {{row.sex | sexFilter}}
        </template>
      </el-table-column>
      <el-table-column prop='telephone' label='手机号码' min-width="120px">
      </el-table-column>
      <el-table-column prop='createTime' label='注册/创建时间' min-width="120px">
      </el-table-column>
      <el-table-column prop='identityId' label='身份'>
        <template slot-scope="{row}">
          <el-tag v-if="row.identityId === 0">{{row.identityId | identityIdFilter}}</el-tag>
          <el-tag v-else-if="row.identityId === 1" type="success">{{row.identityId | identityIdFilter}}</el-tag>
          <el-tag v-else-if="row.identityId === 2" type="info">{{row.identityId | identityIdFilter}}</el-tag>
          <el-tag v-else type="warning">{{row.identityId | identityIdFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop='status' label='状态'>
        <template slot-scope="{row}">
          <el-tag v-if="!row.status" type="success">{{row.status | userStatusFilter}}</el-tag>
          <el-tag v-else type="warning">{{row.status | userStatusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label='操作' min-width="120px">
        <template slot-scope="{row}">
          <el-button size='mini' type='primary' @click='handleEdit(row.id)'>编辑</el-button>
          <el-button v-if="isSuperAdmin" size='mini' type='danger' @click='handleDelete(row.id)'>删除</el-button>
        </template>
      </el-table-column>
    </template>
  </dl-tablePage>
</template>

<script>
import { teamList } from '@/api/team'
export default {
  name: 'team',
  data() {
    return {
      queryList: {
        name: ''
      }
    }
  },
  created() {

  },
  methods: {
    handleAdd() {
      this.$router.push('/teamForm')
    },
    handleEdit(id) {
      this.$router.push(`/teamForm/${id}`)
    },
    handleDelete(id) {
      this.$confirm('确认删除团队?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(id).then(res => {
          this.$message.success('删除成功')
          this.getList()
        }).catch(err => console.log(err))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getList(queryList, resolve) {
      const queryObj = {
        ...queryList,
        ...this.queryList
      }
      teamList(queryObj)
        .then(resolve)
        .catch(err => console.log(err))
    }
  }
}
</script>

<style lang='less' scoped>

</style>
