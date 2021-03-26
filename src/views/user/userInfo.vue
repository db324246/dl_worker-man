<template>
  <div class='page_container'>
    <dl-backtool @goback="$router.go(-1)">
      <el-button v-if="showEditButton" size='mini' type='primary' @click='handleEdit'>编辑</el-button>
    </dl-backtool>

    <dl-title title="用户信息"></dl-title>

    <el-form class="detail-form" label-width='100px'>
      <el-form-item label='用户姓名：'>
        {{userInfo.username}}
      </el-form-item>
      <el-form-item label='性别：'>
        {{userInfo.sex | sexFilter}}
      </el-form-item>
      <el-form-item label='手机号：'>
        {{userInfo.telephone}}
      </el-form-item>
      <el-form-item label='工作身份：'>
        {{userInfo.identityId | identityIdFilter}}
      </el-form-item>
      <el-form-item label='工作状态：'>
        <el-tag v-if="!userInfo.status" type="success">{{userInfo.status | userStatusFilter}}</el-tag>
        <el-tag v-else type="warning">{{userInfo.status | userStatusFilter}}</el-tag>
      </el-form-item>
    </el-form>

    <dl-title title="项目记录"></dl-title>

    <user-form-dialog
      ref="userFormDialog"
      edit-flag
      @success-handler="getUserInfo">
    </user-form-dialog>
  </div>
</template>

<script>
import { defined } from '@utils'
import { mapGetters } from 'vuex'
import { userInfo } from '@/api/user'
import UserFormDialog from '@/components/userform/dialog'
export default {
  name: 'user-info',
  components: {
    UserFormDialog
  },
  data() {
    return {
      paramsId: '',
      userInfo: {}
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'identityId'
    ]),
    showEditButton() {
      if (this.userId === this.paramsId) return true
      if (!defined(this.userInfo.identityId)) return false
      switch (this.identityId) {
        case 0: // 超管
          return this.userInfo.identityId !== 0
        case 1: // 队长
          return this.userInfo.identityId > 1
        default:
          return false
      }
    }
  },
  created() {
    this.paramsId = this.$route.params.id
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      userInfo(this.paramsId).then(res => {
        this.userInfo = res
      }).catch(err => console.log(err))
    },
    handleEdit() {
      this.$refs.userFormDialog.showDialog(this.paramsId)
    }
  }
}
</script>

<style lang='less' scoped>
.page_container {
  width: 800px;
  margin: 0 auto;
}
.detail-form {
  padding-left: 80px;
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
