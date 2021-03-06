<template>
  <div class="user-selecter">
    <slot>
      <el-button slot="tool-buttons" size='mini' @click='dialogVisible = true'>{{btnText}}</el-button>
    </slot>
    <el-dialog
      :title='dialogTitle'
      :visible.sync='dialogVisible'
      width='600px'
      :close-on-click-modal='false'
      :before-close='handleClose'>
      <div class="user_selecter-box">
        <div class="user_selecter-header">
          <el-input size="small" placeholder="请输入内容" v-model="queryList.username" class="input-with-select" @keydown.enter="handlerSearch">
            <el-button slot="append" icon="el-icon-search" @click="handlerSearch"></el-button>
          </el-input>
          <el-breadcrumb v-if="breadListLen" separator="/">
            <el-breadcrumb-item :key="item.name" v-for="(item, index) in breadList" @click.native="handleCheckBread(item)">
              <span :class="{'link-cursor': breadListLen > index + 1}">{{item.name}}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="user_selecter-body">
          <div class="user_selecter-list">
            <ul
              class="list-box"
              v-infinite-scroll="loadUser"
              :infinite-scroll-disabled="disabled">
              <li :key="data.id" v-for="data in dataList" class="list-item">
                <el-checkbox v-if="!data.type" v-model="data.selected">{{ data.name || data.username }}</el-checkbox>
                <span v-else class="link-cursor" @click="handleCheck(data)">
                  {{ data.name }}
                </span>
              </li>
            </ul>
            <p v-if="loading">加载中...</p>
            <p v-if="noMore">没有更多了</p>
          </div>
          <div class="user_selecter-car">
            <ul
              class="list-box">
              <li :key="user.id" v-for="user in selectedUser" class="list-item">
                <el-checkbox v-model="user.selected">{{ user.username }}</el-checkbox>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <span slot='footer' class='dialog-footer'>
        <el-button size="mini" @click='handleClose'>取 消</el-button>
        <el-button size="mini" type='primary' @click='handleSave'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@utils'
import { userList } from '@/api/user'
import { teamList } from '@/api/team'
export default {
  name: 'user-selecter',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    btnText: {
      type: String,
      default: '选择人员'
    },
    dialogTitle: {
      type: String,
      default: '选择人员'
    },
    hasTeam: {
      type: Boolean,
      default: false
    },
    afterSave: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      noMore: false,
      queryList: {
        username: '',
        pageNumber: 0,
        pageSize: 10
      },
      dataList: [],
      selectedIds: [],
      breadList: [
        {
          name: '全部',
          type: 0
        }
      ]
    }
  },
  computed: {
    selectedUser() {
      return this.dataList.filter(data => data.selected)
    },
    disabled() {
      return this.loading || this.noMore
    },
    breadListLen() {
      return this.breadList.length || 0
    }
  },
  watch: {
    value: {
      handler(val) {
        this.selectedIds = val.map(i => i.id)
      },
      immediate: true
    }
  },
  created() {

  },
  methods: {
    loadUser() {
      this.loading = true
      this.noMore = false

      if (this.hasTeam) {
        teamList().then(res => {
          this.noMore = true
          this.loading = false
          this.dataList = res.map(i => {
            i.type = 1 // 团队
            return i
          })
        }).catch(err => console.log(err))
      } else {
        this.queryList.pageNumber++
        userList(this.queryList).then(res => {
          this.dataList.push(
            ...res.list.map(i => {
              i.selected = this.selectedIds.includes(i.id)
              return i
            })
          )
          if (this.dataList.length >= res.total) {
            this.noMore = true
          }
          this.loading = false
        }).catch(err => console.log(err))
      }
    },
    handleCheck(teamData) {
      this.breadList.push({
        name: teamData.name,
        type: 1
      })
      const memberJson = JSON.parse(teamData.memberJson)
      this.dataList = memberJson.map(i => {
        i.selected = this.selectedIds.includes(i.id)
        return i
      })
    },
    handleCheckBread(data) {
      if (!data.type) {
        this.dataList = []
        this.queryList.pageNumber = 0
        this.loadUser()
        this.breadList.splice(1)
      }
    },
    handlerSearch() {
      this.queryList.pageNumber = 0
      this.dataList = []

      if (!this.queryList.username) return this.loadUser()

      this.loading = true
      this.noMore = false

      this.queryList.pageNumber++
      userList(this.queryList).then(res => {
        this.dataList.push(
          ...res.list.map(i => {
            i.selected = this.selectedIds.includes(i.id)
            return i
          })
        )
        if (this.dataList.length >= res.total) {
          this.noMore = true
        }
        this.loading = false
      }).catch(err => console.log(err))
    },
    handleSave() {
      const selectedData = deepClone(this.selectedUser)
      this.$emit('input', selectedData)

      if (selectedData.length) {
        this.$emit('save-success', selectedData)
        this.afterSave && this.afterSave(selectedData)
      } else {
        this.handleClose()
      }
    },
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang='less' scoped>
.user_selecter-box {
  .user_selecter-header {
    .el-breadcrumb {
      margin-top: 10px;
    }
  }
  .user_selecter-body {
    display: flex;
    height: 300px;
    margin-top: 10px;
    border: 1px solid #eee;
    .user_selecter-list {
      flex: 1;
      height: 100%;
      border-right: 1px solid #eee;
      p {
        margin: 5px 0;
        text-align: center;
        font-size: 14px;
        color: #5e6d82;
        line-height: 1.5em;
      }
    }
    .user_selecter-car {
      height: 100%;
      flex: 1;
    }
  }
}
.list-box {
  padding: 0 20px;
  .list-item {
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    .link-cursor {
      display: block;
      padding-left: 10px;
    }
  }
}
/deep/.el-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #eee;
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>
