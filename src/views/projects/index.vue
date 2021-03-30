<template>
  <dl-tablePage
    ref="dlTablePage"
    :get-list="getList">
    <el-button slot="tool-buttons" size='mini' @click='dialogVisible = true'>新建项目</el-button>

    <template slot="tool-filter">
      <div class="toolbar_filter-item">
        项目名称：
        <el-input size='mini' v-model="queryList.name" placeholder="请输入内容"></el-input>
      </div>
      <div class="toolbar_filter-item">
        <el-button size='mini' type='primary' @click='$refs.dlTablePage.handleSearch()'>搜索</el-button>
      </div>
    </template>

    <template slot="table-columns">
      <el-table-column prop='name' label='项目名称' min-width="120px">
        <template slot-scope="{row}">
          <router-link class="link-cursor" :to="`/projectInfo/${row.id}`">{{row.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column label='项目开工时间' min-width="140px">
        <template slot-scope="{row}">
          {{row.startTime}} 至 {{row.endTime}}
        </template>
      </el-table-column>
      <el-table-column prop='createUsername' label='创建人' min-width="80px">
      </el-table-column>
      <el-table-column prop='createTime' label='创建时间' min-width="120px">
      </el-table-column>
      <el-table-column prop='status' label='状态'>
        <template slot-scope="{row}">
          <el-tag v-if="row.status" type="success">{{row.status | projectSatusFilter}}</el-tag>
          <el-tag v-else type="info">{{row.status | projectSatusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label='操作' min-width="120px">
        <template slot-scope="{row}">
          <el-button size='mini' type='primary' @click='handleEdit(row)'>编辑</el-button>
          <el-button v-if="isSuperAdmin" size='mini' type='danger' @click='handleDelete(row.id)'>删除</el-button>
        </template>
      </el-table-column>
    </template>

    <el-dialog
      :title='dialogTitle'
      :visible.sync='dialogVisible'
      width='650px'
      :close-on-click-modal='false'
      :before-close='handleClose'>
      <el-form :model='form' :rules='rules' ref='form' label-width='140px'>
        <el-form-item label='项目名称：' prop='name'>
          <el-input class="w-300" v-model='form.name'></el-input>
        </el-form-item>
        <el-form-item label='项目的开工时间：' prop='time'>
          <el-date-picker
            v-model="form.time"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='handleClose'>取 消</el-button>
        <el-button type='primary' @click='handleSave'>确 定</el-button>
      </span>
    </el-dialog>
  </dl-tablePage>
</template>

<script>
import { deepClone } from '@utils'
import { mapGetters } from 'vuex'
import { projectList, addProject, updateProject, deleteProject } from '@/api/projects'
export default {
  data() {
    return {
      queryList: {
        name: ''
      },
      editFlag: false,
      dialogVisible: false,
      form: {
        name: '',
        time: []
      },
      rules: {
        name: { required: true, message: '请输入项目名称', trigger: 'blur' },
        time: { required: true, message: '请选择项目的开工时间', trigger: 'change' }
      }
    }
  },
  computed: {
    ...mapGetters(['isSuperAdmin', 'userId']),
    dialogTitle() {
      return this.editFlag ? '编辑项目' : '新建项目'
    }
  },
  created() {

  },
  methods: {
    getList(queryList, resolve) {
      if (!this.isSuperAdmin) {
        queryList.createUserId = this.userId
      }
      queryList.name = this.queryList.name
      return projectList(queryList)
        .then(resolve)
        .catch(err => console.log(err))
    },
    handleEdit(row) {
      const formData = deepClone(row)
      formData.time = [formData.startTime, formData.endTime]
      console.log(formData)
      this.form = formData
      this.editFlag = true
      this.dialogVisible = true
    },
    handleDelete(id) {
      this.$confirm('确认删除项目Id', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProject(id).then(res => {
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
    handleSave() {
      this.$refs.form.validate(valide => {
        if (!valide) return
        const formData = deepClone(this.form)
        const [ startTime, endTime ] = formData.time

        Reflect.set(formData, 'startTime', startTime)
        Reflect.set(formData, 'endTime', endTime)
        Reflect.deleteProperty(formData, 'time')

        new Promise(r => {
          if (!this.editFlag) r(addProject(formData))
          else r(updateProject(formData))
        })
          .then(res => {
            this.$message.success('保存成功')
            this.handleClose()
            this.$refs.dlTablePage.requestData()
          })
          .catch(err => console.log(err))
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.$nextTick(() => {
        this.editFlag = false
        this.form = {
          name: '',
          time: []
        }
        this.$nextTick(this.$refs.form.clearValidate)
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
