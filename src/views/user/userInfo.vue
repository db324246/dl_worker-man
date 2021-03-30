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
<!-- days: 0.5
id: "60507b124fc7f206d86511c3"
pay: 400
payStatus: 1
price: 200
projectId: "60506fec890ae91bf80f7e6a"
projectName: "我的测试项目1"
projectStatus: 0
remaining: 0
workerId: "604b03498ba4203688fbeb2a"
workerName: "彬彬大魔王" -->
    <el-table :data='projectList' border style='width: 100%'>
      <el-table-column prop='projectName' label='项目名称' >
      </el-table-column>
      <el-table-column label='工作时间'>
        <template slot-scope="{row}">
          {{row.days}} 天
        </template>
      </el-table-column>
      <el-table-column prop='workTypeId' label='工种类型'>
      </el-table-column>
      <el-table-column prop='projectStatus' label='项目状态'>
        <template slot-scope="{row}">
          <el-tag v-if="row.projectStatus" type="success">{{row.projectStatus | projectSatusFilter}}</el-tag>
          <el-tag v-else type="info">{{row.projectStatus | projectSatusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop='price' label='工资'>
        <template slot-scope="{row}">
          <div v-if="!row.showPrice" class="price_box">
            <span>***</span>
            <i class="el-icon-open" @click="checkPrice(row, true)"></i>
          </div>
          <div v-else class="price_box">
            <span>{{row.price}} 元</span>
            <i class="el-icon-turn-off" @click="checkPrice(row, false)"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>

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
import { userInfo, userProjects } from '@/api/user'
import UserFormDialog from '@/components/userform/dialog'
export default {
  name: 'user-info',
  components: {
    UserFormDialog
  },
  data() {
    return {
      paramsId: '',
      userInfo: {},
      projectList: []
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'identityId',
      'isSuperAdmin'
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
    this.getUserProjects()
  },
  methods: {
    getUserInfo() {
      userInfo(this.paramsId).then(res => {
        this.userInfo = res
      }).catch(err => console.log(err))
    },
    getUserProjects() {
      userProjects(this.paramsId).then(res => {
        this.projectList = res.map(i => {
          i.showPrice = false
          return i
        })
      }).catch(err => console.log(err))
    },
    handleEdit() {
      this.$refs.userFormDialog.showDialog(this.paramsId)
    },
    checkPrice(row, state) {
      if (this.isSuperAdmin) {
        row.showPrice = state
      } else if (this.userId === this.paramsId) {
        row.showPrice = state
      }
    }
  }
}
</script>

<style lang='less' scoped>
.page_container {
  width: 800px;
  margin: 0 auto;
}
.price_box {
  font-size: 14px;
  span {
    display: inline-block;
    width: 50px;
    margin-right: 10px;
  }
  i {
    font-size: 20px;
    vertical-align: middle;
    cursor: pointer;
  }
}
</style>
