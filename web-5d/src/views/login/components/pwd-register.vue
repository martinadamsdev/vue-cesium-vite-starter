<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
    <el-form-item prop="account">
      <el-input
        autocomplete="on"
        class="account"
        v-model="ruleForm.account"
        placeholder="请输入账号"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        class="password"
        v-model="ruleForm.password"
        show-password
        placeholder="请输入密码"
        @keyup.enter.native="passwordLogin('ruleForm')"
      ></el-input>
    </el-form-item>
    <!-- <div class="passwordChecked">
      <el-checkbox v-model="passwordChecked">记住密码</el-checkbox>
    </div> -->
    <el-button type="primary" size="medium" class="register" @click="passwordLogin('ruleForm')">
      <i class="el-icon-loading" v-show="isLogining"></i>
      登 录
    </el-button>
    <div class="btns">
      <!-- <el-button type="text" @click="toSmsRegister">短信快捷登录</el-button> -->
      <el-button type="text">忘记密码?</el-button>
      <el-button type="text" @click="guestMode">游客模式</el-button>
    </div>
  </el-form>
</template>
<script>
import login from '@/api/login'
import { setToken } from '@/utils/auth.js'
import { mapMutations } from 'vuex'
export default {
  name: 'pwd-register',
  data() {
    return {
      passwordChecked: false,
      ruleForm: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      isLogining: false
    }
  },
  methods: {
    ...mapMutations('userInfo', [
      'saveUserInfo',
      'formatterPermission'
    ]),
    toSmsRegister() {
      this.$emit('changeFlag', false)
    },
    passwordLogin(formName) {
      if (this.isLogining) {
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isLogining = true
          this.login()
        } else {
          return false
        }
      })
    },
    login() {
      login.login({'passWord': this.ruleForm.password, 'userName': this.ruleForm.account}).then(res => {
        setToken(res.token)
        this.saveUserInfo(res.userMessage)
        this.formatterPermission(res.userMessage.permission)
        this.$router.push('/project-list')
      }).catch(err => {
        this.isLogining = false
        this.$message.error(err.msg)
      })
    },
    validateBtn() {
    // 倒计时
      let time = 60
      let timer = setInterval(() => {
        if (time === 0) {
          clearInterval(timer)
          this.disabled = false
          this.btnTitle = '获取验证码'
        } else {
          this.btnTitle = time + '秒后重试'
          this.disabled = true
          time--
        }
      }, 1000)
    },
    guestMode() {
      this.$router.push('/')
    }
  }
}
</script>
<style lang="less" scoped>
.account,
.passwordChecked,
.register,
.btns {
  margin-top: 20px;
}
.passwordChecked span {
  color: red;
  margin-left: 10px;
}
.register {
  width: 100%;
  color:#ffffff;
  font-style: Roboto;
  background-color:rgb(58, 98, 215);
  border-color: rgb(58, 98, 215);
}
.btns {
  display: flex;
  justify-content: space-between;
  .el-button--text{
    color:#3A62D7;
    font-style: SourceHanSansSC-regular;
  }
}
</style>
