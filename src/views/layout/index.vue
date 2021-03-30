<template>
  <el-container class="home-container">
    <el-aside width="200px">
      <div class="logo">
        <!-- 系统logo -->
      </div>

      <!-- 数据维护列表 -->
      <ul class="route-list">
        <li :key="route.name" v-for="route in rootList">
          <router-link class="route-item" :to="route.path" exact-active-class="activeRoute" exact>{{route.meta.title}}</router-link>
        </li>
      </ul>
    </el-aside>
    <el-container>
      <!-- 头部栏 -->
      <el-header>
        <div class="localtime">
          <span>{{localtime}}</span>
        </div>
        <div class="userinfo">
          <router-link style="margin-right: 20px;" :to="`/userInfo/${userInfo.id}`">
            <i class="el-icon-s-custom"></i>{{userInfo.username}}
          </router-link>
          <el-button type="danger" size="mini" @click="logout"> 退出 </el-button>
        </div>
      </el-header>

      <el-main :style="{'height': 'calc(100vh - 80px)'}">
        <el-scrollbar style="height: 100%;">
          <router-view></router-view>
        </el-scrollbar>
      </el-main>

      <!-- 全局图片预览组件 -->
      <image-previewer
      v-if="$store.state.previewPicFlag"
      :imgPreviewConfig="$store.state.imgPreviewConfig"
      :baseUrl="$store.state.commonShowImgBaseUrl"
      @closePreview="closePreview"
      :onerror="defaultImg">
      </image-previewer>
    </el-container>
  </el-container>
</template>
<script>
import { mapState } from 'vuex'
import { timeParse } from '@utils'
import { loginOutSys } from '@/api/login.js'
import ImagePreviewer from '@/components/ImagePreviewer'
export default {
  name: 'lay-out',
  components: {
    ImagePreviewer
  },
  data () {
    return {
      imgPreviewConfig: { // 图片预览组件配置
        imageKeys: [], //  图片链接数组 / 必传
        currentIndex: 0, // 图片预览的当前索引号 / 可不传
        imageContent: [] // 图片对应标题的数组 / 可不传
      }
    }
  },
  computed: {
    ...mapState([
      'rootList',
      'userInfo'
    ]),
    localtime () {
      return timeParse(new Date(), '{y}年{m}月{d}日 {h}时{i}分 星期{a}')
    }
  },
  created() {
    // 工种字典初始化
    this.$store.dispatch('DICTINIT')
  },
  methods: {
    // 退出登录
    logout () {
      this.$confirm('确认退出当前账号', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        loginOutSys(this.$store.state.userInfo.id).then(res => {
          this.$store.commit('CLEARLOGININFO')
          this.$router.push('/')
        }).catch(err => console.log(err))
      }).catch(() => {
        this.message({
          type: 'info',
          message: '已取消退出'
        })
      })
    },
    previewImg () {
      this.imgPreviewConfig.imageKeys = [this.$store.state.audioAlbum]
      this.imgPreviewConfig.imageContent = [this.$store.state.audioTitle]
      this.imgPreviewConfig.currentIndex = 0
      this.$store.commit('previewImg', this.imgPreviewConfig)
    },
    // 监听图片预览组件的传值 关闭图片预览
    closePreview (flag) {
      this.$store.commit('closeImgPreview', flag)
    }
  }
}
</script>

<style lang='less' scoped>
.home-container {
  height: 100%;
}
.el-aside{
  background-color: #b3c8c9;
}
.logo{
  width: 150px;
  height: 150px;
  margin: 10px auto;
  background: url('~@/assets/avatar.jpeg') no-repeat center;
  background-size: cover;
  border-radius: 50%;
}
.route-list {
  padding: 0;
  margin-top: 50px;
  // background-color: #82a4a6;
  li {
    height: 40px;
    line-height: 40px;
    text-align: center;
    .route-item {
      display: block;
      width: 100%;
      height: 100%;
      color: #505050;
      &:hover {
        color: #eee;
        background-color: #82a4a6;
      }
    }
    .activeRoute {
      background-color: #89a8aa;
      color: #eee;
    }
  }
}

.el-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #9ec8d8;
}
.el-main{
  margin: 10px;
  border-radius: 5px;
  background: url('~@/assets/index.jpeg') no-repeat center;
  background-size: cover;
}
.transition-box {
  position: relative;
  height: 60px;
  padding-left: 100px;
  background-color: #f1f3f4;
  display: flex;
  align-items: center;
  overflow: hidden;
  .audioImage {
    width: 55px;
    height: 55px;
    cursor: pointer;
  }
  .audioBox {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin-left: 50px;
    padding-top: 10px;
    font-size: 14px;
    overflow: hidden;
    span {
      padding-left: 40px;
    };
  }
  .closeBtn {
    position: absolute;
    right: 20px;
    top: 15px;
    font-size: 30px;
    color: #999;
    cursor: pointer;
  }
}
/deep/.el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
