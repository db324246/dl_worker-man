<template>
  <el-form :model='form' :rules='rules' ref='form' label-width='100px'>
    <el-form-item label='用户姓名：' prop='username'>
      <el-input v-model='form.username'></el-input>
    </el-form-item>
    <el-form-item label='性别：' prop='sex'>
      <el-radio-group v-model="form.sex">
        <el-radio :label="1">男</el-radio>
        <el-radio :label="2">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label='手机号：' prop='telephone'>
      <el-input v-model='form.telephone'></el-input>
    </el-form-item>
    <el-form-item label='工作身份：' prop='identityId'>
      <el-select v-model="form.identityId" placeholder="请选择">
        <el-option
          v-for="item in identityOpt"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone } from '@utils'
import { validatePhone } from '@utils/valide'
export default {
  name: 'user-form',
  props: {
    formData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {
        username: '',
        sex: 1,
        telephone: '',
        identityId: 3
      },
      rules: {
        username: { required: true, message: '请输入用户姓名', trigger: 'blur' },
        sex: { required: true, message: '请选择用户性别', trigger: 'change' },
        telephone: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        identityId: { required: true, message: '请输入用户工作身份', trigger: 'change' }
      }
    }
  },
  computed: {
    ...mapGetters([
      'isSuperAdmin'
    ]),
    identityOpt() {
      const identityList = [
        { label: '超管', value: 0 },
        { label: '队长', value: 1 },
        { label: '工人', value: 3 }
      ]
      if (this.isSuperAdmin) {
        return identityList
      } else {
        return identityList.slice(2)
      }
    }
  },
  watch: {
    formData: {
      handler(val) {
        val && (this.form = Object.assign({}, this.form, val))
      },
      deep: true,
      immediate: true
    }
  },
  created() {

  },
  methods: {
    saveForm(cb) {
      this.$refs.form.validate(valide => {
        if (!valide) return
        cb(deepClone(this.form))
      })
    },
    clearForm() {
      this.form = {
        username: '',
        sex: 1,
        telephone: '',
        identityId: 3
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
