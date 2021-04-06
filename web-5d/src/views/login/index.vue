<template>
  <el-row class="warp" :style="{
      backgroundImage: 'url(' + bgUrl + ')',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%'
    }">
    <div class="center">
      <el-col :span="10" class="login-background" :style="{
        backgroundImage: 'url(' + leftbgUrl + ')',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
    }">
      </el-col>
      <el-col :span="14" class="login">
        <div>
          <div class="logo">
            <img :src="logoUrl" alt="中科辅龙智能" class="logo-img">
          </div>
          <div class="weclome">
            欢迎使用
            <span>数字化交付平台</span>
          </div>
          <div v-if="registerSwitchFlag">
            <PWDRegister @changeFlag="updateRegisterFlag" />
          </div>
          <div v-else>
            <SMSRegister @changeFlag="updateRegisterFlag" />
          </div>
        </div>
      </el-col>
    </div>
  </el-row>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      registerSwitchFlag: true,
      logoUrl: require('@/assets/logo.png'),
      bgUrl: require('@/assets/bg.png'),
      leftbgUrl: require('@/assets/leftbg.jpg')
    }
  },
  components: {
    PWDRegister: () => import('./components/pwd-register'),
    SMSRegister: () => import('./components/sms-register')
  },
  methods: {
    updateRegisterFlag(flag) {
      this.registerSwitchFlag = flag
    }
  }
}
</script>
<style lang='less' scoped>
.login-background{
  background: #2C2F42;
}
.login-background,
.login-background > div,
.login,
.warp {
  height: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
.center{
  width: 50%;
  height: 60%;
  border-radius: 10px;
  background: rgba(21, 43, 76, 0.6);
  animation: aside 1s linear infinite alternate;
}
@keyframes aside {
  0% {
    box-shadow: 2px 2px 15px rgba(44,76,124,1);
  }
  50% {
    box-shadow: 2px 2px 25px rgba(44,76,124,1);
  }
  100% {
    box-shadow: 2px 2px 35px rgba(44,76,124,1);
  }
}
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255,255,255,1);
  border-radius: 0px 10px 10px 0px;
}
.login > div {
  width: 60%;
}
.login-background{
  opacity: 0.75;
  float: left;
  border-radius: 10px 0px 0px 10px;
}
.logo{
  left: 925px;
  top: 260px;
  width: 79px;
  height: 41px;
  color: rgba(58, 98, 215, 100);
  font-size: 28px;
  text-align: left;
  font-style: normal;
  font-family: SourceHanSansSC-regular;
}
.logo-img{
  height: 35px;
}
.weclome {
  margin-top: 20px;
  font-size: 20px;
}
.weclome span {
  color: #3A62D7;
  font-size: 22px;
}
</style>
