<template>
  <dl-tablePage
    ref="dlTablePage"
    :get-list="getList"
    :has-pagenation="false">
    <el-button slot="tool-buttons" size='mini' @click='handleAdd'>新建团队</el-button>

    <template slot="table-columns">
      <el-table-column prop='name' label='团队名称' min-width="100px">
        <template slot-scope="{row}">
          <span class="link-cursor" >{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop='createUsername' label='创建人' min-width="120px">
      </el-table-column>
      <el-table-column prop='createTime' label='创建时间' min-width="120px">
      </el-table-column>
      <el-table-column prop='status' label='团队人数'>
        <template slot-scope="{row}">
          <el-tag type="success">{{row.teamNum}}人</el-tag>
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
import { mapGetters } from 'vuex'
import { teamList, deleteTeam } from '@/api/team'
export default {
  name: 'team',
  data() {
    return {
      queryList: {
        name: ''
      }
    }
  },
  computed: {
    ...mapGetters(['isSuperAdmin'])
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
        deleteTeam(id).then(res => {
          this.$message.success('删除成功')
          this.$refs.dlTablePage.requestData()
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
        .then(res => {
          res = res.map(i => {
            i.memberJson = JSON.parse(i.memberJson)
            i.teamNum = i.memberJson.length || 0
            return i
          })
          resolve({ list: res })
        })
        .catch(err => console.log(err))
    }
  }
}
</script>

<style lang='less' scoped>

</style>
