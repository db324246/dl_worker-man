<template>
  <div class='page_container'>
    <dl-backtool @goback="$router.go(-1)">
      <el-button size='mini' type='primary' @click='handleSave'>保 存</el-button>
    </dl-backtool>

    <dl-title title="团队信息"></dl-title>

    <el-form :model='form' :rules='rules' ref='form' label-width='100px'>
      <el-form-item label='团队名称：' prop='name'>
        <el-input class="w-300" v-model='form.name' placeholder="请输入团队名称" maxlength="20"></el-input>
      </el-form-item>
    </el-form>

    <dl-title title="团队成员"></dl-title>

    <dl-tablePage
      ref="dlTablePage"
      :get-list="getList"
      border
      :get-data-in-created="editFlag"
      :has-pagenation="false">
      <user-selecter
        v-model="memberJson"
        slot="tool-buttons"
        btn-text="新增团队成员"
        dialog-title="新增团队成员"
        @save-success="$refs.dlTablePage.requestData()">
      </user-selecter>

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
        <el-table-column label='工种' >
          <template slot-scope="{row}">
            <el-select size="mini" v-model="row.workType" @change="handleSelect(row)" placeholder="请选择">
              <el-option
                v-for="item in workTypes"
                :key="item.value"
                :label="item.name"
                :value="item">
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
import { addTeam, updateTeam, teamInfo } from '@/api/team'
export default {
  name: 'team-form',
  components: {
    UserSelecter
  },
  data() {
    return {
      editFlag: false,
      form: {
        name: '',
        memberJson: []
      },
      memberJson: [],
      options: [],
      rules: {
        name: { required: true, message: '请输入团队名称', trigger: 'blur' }
      }
    }
  },
  computed: {
    ...mapState(['workTypes']),
    selectIds() {
      return this.form.memberJson.map(m => m.id)
    }
  },
  created() {
    if (this.$route.params.id) {
      this.editFlag = true
      this.teamId = this.$route.params.id
      this.getDetail()
    }
  },
  methods: {
    getDetail() {
      teamInfo(this.teamId).then(res => {
        this.memberJson = res.memberJson = JSON.parse(res.memberJson)
        this.form = res
        this.$refs.dlTablePage.resolveData({ list: this.memberJson })
      }).catch(err => console.log(err))
    },
    getList(params, resolve) {
      this.form.memberJson = this.memberJson.map(user => {
        if (!this.selectIds.includes(user.id)) {
          return {
            ...user,
            workTypeId: '',
            workTypeName: '',
            pay: 0
          }
        } else {
          return this.form.memberJson.find(u => u.id === user.id)
        }
      })

      resolve({ list: this.form.memberJson })
    },
    handleSelect(row) {
      const { workType } = row
      row.workTypeId = workType.id
      row.workTypeName = workType.name
      row.pay = workType.pay
    },
    handleSave() {
      this.$refs.form.validate(valide => {
        if (!valide) return
        const formData = this.form
        formData.memberJson = JSON.stringify(formData.memberJson)

        new Promise(r => {
          if (this.editFlag) r(updateTeam(formData))
          else r(addTeam(formData))
        })
          .then(res => {
            this.$message.success('保存成功')
            this.$router.go(-1)
          })
          .catch(err => console.log(err))
      })
    }
  }
}
</script>

<style lang='less' scoped>
</style>
