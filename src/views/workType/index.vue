<template>
  <dl-tablePage
    ref="dlTablePage"
    :get-data-in-created="false"
    :get-list="getList">
    <el-button slot="tool-buttons" size='mini' @click='handleAdd'>添加工种类型</el-button>

    <template slot="table-columns">
      <el-table-column prop='name' label='工种名称' min-width="100px">
      </el-table-column>
      <el-table-column prop='pay' label='薪资' >
        <template slot-scope="{row}">
          <el-tag type="success">{{row.pay}} 元/天</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop='createTime' label='创建时间' min-width="120px">
      </el-table-column>
      <el-table-column label='操作' min-width="80px">
        <template slot-scope="{row}">
          <el-button size='mini' type='primary' @click='handleEdit(row)'>编辑</el-button>
          <el-button v-if="isSuperAdmin" size='mini' type='danger' @click='handleDelete(row.id)'>删除</el-button>
        </template>
      </el-table-column>
    </template>

    <el-dialog
      :title='dailogTitle'
      :visible.sync='dialogVisible'
      width='500px'
      :close-on-click-modal='false'
      :before-close='handleClose'>
      <el-form :model='form' :rules='rules' ref='form' label-width='100px'>
        <el-form-item label='工种名称：' prop='name'>
          <el-input v-model='form.name'></el-input>
        </el-form-item>
        <el-form-item label='薪资：' prop='pay'>
          <el-input type="number" v-model.number='form.pay' min="0">
            <template slot="suffix">
              元/天
            </template>
          </el-input>
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
import { mapGetters, mapState, mapActions } from 'vuex'
import { addType, updateType, deleteType } from '@/api/workType'
export default {
  name: 'workType',
  data() {
    return {
      editFlag: false,
      dialogVisible: false,
      form: {
        name: '',
        pay: 0
      },
      rules: {
        name: { required: true, message: '请输入工种名称', trigger: 'blur' },
        pay: [
          { required: true, message: '请输入工种薪资', trigger: 'blur' },
          { type: 'number', min: 0, message: '请在加点薪吧', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState(['workTypes']),
    ...mapGetters(['isSuperAdmin']),
    dailogTitle() {
      return this.editFlag ? '编辑工种类型' : '添加工种类型'
    }
  },
  watch: {
    'workTypes': {
      handler(val) {
        this.$refs.dlTablePage && this.$refs.dlTablePage.resolveData({ list: val })
      },
      immediate: true
    }
  },
  mounted() {
    this.$refs.dlTablePage.resolveData({ list: this.workTypes })
  },
  methods: {
    ...mapActions(['DICTINIT']),
    handleAdd() {
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.form = deepClone(row)
      this.editFlag = true
      this.dialogVisible = true
    },
    handleSave() {
      this.$refs.form.validate(valide => {
        if (!valide) return
        new Promise(r => {
          if (this.editFlag) r(updateType(this.form))
          else r(addType(this.form))
        })
          .then(res => {
            this.$message.success('保存成功')
            this.handleClose()
            this.$refs.dlTablePage.requestData()
          })
          .catch(err => console.log(err))
      })
    },
    handleDelete(id) {
      this.$confirm('确认删除工种类型？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteType(id).then(res => {
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
    async getList(queryList, resolve) {
      const list = await this.DICTINIT()
      resolve({ list })
    },
    handleClose() {
      this.dialogVisible = false
      this.$nextTick(() => {
        this.editFlag = true
        this.form = {
          name: '',
          pay: 0
        }
        this.$nextTick(this.$refs.form.clearValidate)
      })
    }
  }
}
</script>

<style lang='less' scoped>

</style>
