<template>
  <div class='page_container'>
    <dl-backtool @goback="$router.go(-1)">
    </dl-backtool>

    <dl-title title="项目信息"></dl-title>

    <el-form class="detail-form" label-width='140px'>
      <el-form-item label='项目名称：'>
        {{form.name}}
      </el-form-item>
      <el-form-item label='项目开工时间：'>
        {{form.startTime}} 至 {{form.endTime}}
      </el-form-item>
      <el-form-item label='创建时间：'>
        {{form.createTime}}
      </el-form-item>
      <el-form-item label='项目状态：'>
        <el-tag v-if="form.status" type="success">{{form.status | projectSatusFilter}}</el-tag>
        <el-tag v-else type="info">{{form.status | projectSatusFilter}}</el-tag>
      </el-form-item>
    </el-form>

    <dl-title title="项目成员"></dl-title>

    <dl-tablePage
      ref="dlTablePage"
      :get-list="getList"
      border
      :get-data-in-created="false"
      :has-pagenation="false"
      @selection-change="handleChange">
      <template slot="tool-buttons">
        <user-selecter
          v-model="memberJson"
          has-team
          btn-text="新增项目成员"
          dialog-title="新增项目成员"
          :after-save="handleSuccess">
        </user-selecter>
        <el-button style="margin-left: 10px" size='mini' type='danger' @click='handleRemove'>批量移除</el-button>
      </template>

      <template slot="table-columns">
        <el-table-column type="selection" width="50px">
        </el-table-column>
        <el-table-column prop='username' label='姓名' min-width="100px">
          <template slot-scope="{row}">
            <router-link class="link-cursor" :to="`/userInfo/${row.workerId}`">{{row.workerName}}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop='sex' label='性别' >
          <template slot-scope="{row}">
            {{row.sex | sexFilter}}
          </template>
        </el-table-column>
        <el-table-column label='工种' >
          <template slot-scope="{row}">
            <el-select size="mini" v-model="row.workTypeId" @change="handleSelect(row)" placeholder="请选择">
              <el-option
                v-for="item in workTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label='薪资' >
          <template slot-scope="{row}">
            <el-input size="mini" type="number" v-model="row.pay">
              <template slot="suffix">
              元/天
              </template>
            </el-input>
          </template>
        </el-table-column>
      </template>
    </dl-tablePage>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UserSelecter from '@/components/userSelecter'
import { projectInfo, workersInPro, addWorker, removeWorker } from '@/api/projects'
export default {
  name: 'project-info',
  components: {
    UserSelecter
  },
  data() {
    return {
      projectId: '',
      form: {},
      selectedIds: [],
      memberJson: []
    }
  },
  computed: {
    ...mapState(['workTypes'])
  },
  created() {
    this.projectId = this.$route.params.id
    this.getDetail()
  },
  mounted() {
    this.$refs.dlTablePage.requestData()
  },
  methods: {
    getDetail() {
      projectInfo(this.projectId).then(res => {
        this.form = res
      }).catch(err => console.log(err))
    },
    handleSuccess() {
      const memberName = this.memberJson.map(m => m.username).join(',')

      return this.$confirm(`确认添加工人: ${memberName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const queryObj = {
          projectId: this.projectId,
          workersJson: JSON.stringify(this.memberJson.map(m => {
            return {
              sex: m.sex,
              workTypeId: m.workTypeId,
              workerId: m.id, // required
              workerName: m.username, // required
              pay: m.pay // required
            }
          }))
        }
        console.log(this.memberJson)
        return addWorker(queryObj)
          .then(res => {
            this.$message.success('添加成功')
            this.$refs.dlTablePage.requestData()
          }).catch(err => console.log(err))
      }).catch(() => {
        this.memberJson = []
        this.$message({
          type: 'info',
          message: '已取消添加'
        })
      })
    },
    handleRemove() {
      if (!this.selectedIds.length) return this.$message.error('请选择需要移除的工人')

      this.$confirm('确认移除工人?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const queryObj = {
          projectId: this.projectId,
          workerIds: this.selectedIds.join(',')
        }
        removeWorker(queryObj).then(res => {
          this.$message.success('移除成功')
          this.$refs.dlTablePage.requestData()
        }).catch(err => console.log(err))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消移除'
        })
      })
    },
    handleChange(selection) {
      this.selectedIds = selection.map(s => s.workerId)
    },
    async getList(queryList, resolve) {
      try {
        const res = await workersInPro(this.projectId)
        return resolve({ list: res })
      } catch (error) {
        console.log(error)
        return resolve({ list: [] })
      }
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
