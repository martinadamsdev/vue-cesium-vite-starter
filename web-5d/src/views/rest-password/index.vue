<template>
  <el-container>
    <el-header>
      <Header
        leftIconClass="el-icon-s-custom"
        leftTitle="账号设置"
        rightTitle="登录"
        rightIconClass="el-icon-arrow-right"
        @leftClick="leftClick"
      />
    </el-header>
    <el-main>
      <el-row class="view">
        <el-col span="6" class="view-left-nav">
          <el-steps direction="vertical" :active="actice">
            <el-step title="验证手机号"></el-step>
            <el-step title="重置密码"></el-step>
          </el-steps>
        </el-col>
        <el-col span="18" class="view-contre" v-if="isShowPhone">
          <div class="phone-item">
            <el-input
              placeholder="请输入手机号"
              prefix-icon="el-icon-mobile-phone"
              type="info"
              v-model="phone"
              class="phone"
            >
            </el-input>
            <span class="msg" v-if="phoneReg">请输入手机号码</span>
          </div>
          <div class="code-item">
            <el-input
              placeholder="验证码"
              prefix-icon="el-icon-lock"
              type="info"
              v-model="code"
              class="code"
            >
            </el-input>
            <span class="msg" v-if="phoneCodeReg">验证码不正确</span>
            <el-button type="info" class="get-code" round>获取验证码</el-button>
          </div>
          <el-button type="primary" class="next" round @click="next"
            >下一步</el-button
          >
        </el-col>
        <el-col v-else span="18" class="view-contre">
          <el-input
            placeholder="请输入新密码"
            prefix-icon="el-icon-lock"
            type="info"
            v-model="password"
            class="password"
          >
          </el-input>
          <div class="code-item">
            <el-input
              placeholder="再次输入新密码"
              prefix-icon="el-icon-lock"
              type="info"
              v-model="passwordAgain"
              class="passwordAgain"
            >
            </el-input>
            <span class="msg" v-if="passwordAgainReg">两次密码不一致</span>
          </div>
          <el-button type="primary" class="next" round @click="reset"
            >重置</el-button
          ></el-col
        >
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: 'RestPassword',
  data() {
    return {
      isShowPhone: true, // 切换重置密码与验证码
      phoneReg: false, // 手机验证开关
      phoneCodeReg: false, // 验证码是否一致
      passwordAgainReg: false, // 两次密码比对
      phone: '', // 手机号码
      code: '', // 验证码
      password: '', // 新密码
      passwordAgain: '', // 第二次新密码
      actice: 1 // 当前步骤
    }
  },
  components: {
    Header: () => import('@/components/header')
  },
  methods: {
    leftClick() {
      // 做相对应的操作
      console.log('做相对应的操作')
    },
    next() {
      // 验证手机号 与验证码是否一致
      this.isShowPhone = false
      this.actice = 2
    },
    reset() {
      // 重置密码 两次新密码比对
      this.isShowPhone = true
    }
  }
}
</script>
<style lang="less" scoped>
.el-container {
  background: black;
  height: 100%;
  min-height: 600px;
  min-width: 1366px;
  box-sizing: border-box;
}
.el-header {
  padding: 0;
  margin-bottom: 10px;
}
.el-main {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(21, 24, 45, 0.9);
  height: calc(100% - 80px);
}
.view {
  height: 60%;
  width: 75%;
}
.view .view-left-nav,
.view .view-contre {
  height: 100%;
}
.view-contre {
  color: white;
  padding: 10% 20%;
  background: rgba(21, 24, 45, 0.9);
}
.view-contre > div {
  margin-bottom: 30px;
}
.phone-item {
  position: relative;
}
.phone,
.password,
.passwordAgain {
  border-radius: 900px;
  overflow: hidden;
}
.code {
  border-radius: 200px 0 0 200px;
  overflow: hidden;
  width: 50%;
}
.code-item {
  position: relative;
}
.get-code {
  float: right;
}
.next {
  width: 100%;
}
.msg {
  position: absolute;
  color: #f56c6c;
  left: 30px;
  top: 100%;
  margin-top: 5px;
}
</style>
