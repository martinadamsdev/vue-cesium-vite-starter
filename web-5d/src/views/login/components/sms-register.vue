<template>
  <div>
    <div class="phone">
      <el-input v-model="phone" placeholder="手机号码"></el-input>
      <span v-if="phoneReg">请输入正确手机号</span>
    </div>
    <div class="verificationCode">
      <el-input
        class="codeInput"
        v-model="verificationCode"
        placeholder="请输入验证码"
      ></el-input>
      <span v-if="codeReg">请输入正确验证码</span>
      <el-button class="sendCode" type="primary"  @click="getVerifyCode" :disabled="disabled">{{btnValue}}</el-button>
    </div>

    <el-button type="primary" size="medium" class="register" @click="loginIn">登录</el-button>
    <div class="btns">
      <el-button type="text" @click="toPwdRegister">密码登录</el-button>
      <el-button type="text">忘记密码?</el-button>
      <el-button type="text">游客模式</el-button>
    </div>
  </div>
</template>
<script>
import {phoneReg} from '@/utils/reg.js'
export default {
  name: 'sms-register',
  data() {
    return {
      phone: '',
      verificationCode: '',
      phoneReg: false,
      codeReg: false,
      disabled: false,
      btnValue: '发送验证码'
    }
  },
  created() {},
  methods: {
    getVerifyCode() {
      console.log(this.phone)
      if (!phoneReg.test(this.phone)) {
        this.phoneReg = true
      } else {
        this.validateBtn()
      }
    },
    toPwdRegister() {
      this.$emit('changeFlag', true)
    },
    loginIn() {
      console.log(this.phone, this.verificationCode)
    },
    validateBtn() {
    // 倒计时
      let time = 60
      let timer = setInterval(() => {
        if (time === 0) {
          clearInterval(timer)
          this.disabled = false
          this.btnValue = '获取验证码'
        } else {
          this.btnValue = time + '秒后重试'
          this.disabled = true
          time--
        }
      }, 1000)
    }
  }
}
</script>
<style lang="less" scoped>
.phone,
.verificationCode,
.register,
.btns {
  margin-top: 20px;
}
.phone,
.verificationCode {
  position: relative;
}
.el-button--primary{
    background-color:rgb(58, 98, 215);
    border-color: rgb(58, 98, 215);
  }
.phone span,
.verificationCode span {
  color: red;
  position: absolute;
  top: 110%;
  left: 10%;
}
.codeInput {
  width: 60%;
}

.sendCode {
  float: right;
}
.register {
  width: 100%;
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
