<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_title">Dl Worker</div>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="手机号" prop="telephone">
          <el-input v-model="ruleForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn_group">
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { loginSys } from '@/api/login.js'
import { validatePhone, validatePassword } from '@utils/valide.js'
export default {
  data () {
    return {
      ruleForm: {
        password: '',
        telephone: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
  },
  methods: {
    // 登录提交
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const queryObj = Object.assign({}, this.ruleForm)

          loginSys(queryObj).then(res => {
            this.$store.commit('SAVELOGININFO', res)
            this.$store.commit('INITROUTES')
            this.$router.push('/home')
          }).catch(err => console.log(err))
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}

</script>

<style lang="less" scoped>
.login_container {
  position: relative;
  height: 100%;
  background: url('~@/assets/beijing.jpeg') no-repeat center;
  background-size: cover;
}
.login_box{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 400px;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,.7);
  background-color: #ffffff99;
}
.login_title {
  margin-top: 40px;
  font-size: 48px;
  text-align: center;
  color: #33333390;
}
.el-form{
  margin-top: 40px;
  width: 400px;
}
.btn_group {
  padding-left: 160px;
  margin-top: 40px;
}
</style>
