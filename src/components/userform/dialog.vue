<template>
  <el-dialog
    :title='dialogTitle'
    :visible.sync='dialogVisible'
    width='600px'
    :close-on-click-modal='false'
    :before-close='handleClose'>
    <user-form ref="userForm" :form-data="formData"></user-form>
    <span slot='footer' class='dialog-footer'>
      <el-button @click='handleClose'>取 消</el-button>
      <el-button type='primary' @click='handleSave'>保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import UserForm from './form'
import { registerUser } from '@/api/login'
import { updateUser, userInfo } from '@/api/user'
export default {
  name: 'user-form-dialog',
  props: {
    editFlag: {
      type: Boolean,
      default: false
    }
  },
  components: {
    UserForm
  },
  data() {
    return {
      dialogVisible: false,
      formData: null
    }
  },
  computed: {
    dialogTitle() {
      return this.editFlag ? '编辑用户' : '新增用户'
    }
  },
  created() {

  },
  methods: {
    handleSave() {
      this.$refs.userForm.saveForm((form) => {
        let handler
        if (this.editFlag) {
          handler = updateUser
        } else {
          handler = registerUser
          form.password = '123456'
        }

        handler(form).then(res => {
          this.$message.success('保存成功')
          this.$emit('success-handler')
          this.handleClose()
        }).catch(err => console.log(err))
      })
    },
    showDialog(id) {
      if (!this.editFlag) {
        this.dialogVisible = true
        return
      }

      userInfo(id).then(res => {
        this.formData = res
        this.dialogVisible = true
      }).catch(err => console.log(err))
    },
    handleClose() {
      this.dialogVisible = false
      this.$nextTick(this.$refs.userForm.clearForm)
      this.$emit('dialog-close')
    }
  }
}
</script>

<style scoped>

</style>
