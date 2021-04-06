<template>
  <el-row class="header-row" :gutter="20">
    <el-col :span="8" class="logo-content h-64" :style="{background: 'url('+bgUrl+') no-repeat left -75px'}">
      <img :src="logoUrl" class="logo"/>
    </el-col>
    <el-col :span="1" class="go-back" @click.native="goHomePage"><p>回首页</p></el-col>
    <el-col :span="12" class="h-64 tool-content">
      <div class="select-bg" ref="selectBg" :style="{left:left+'px',backgroundImage: 'url('+selectUrl+')'}" v-show="btnsData.length > 0">
      </div>
      <div class="tool-btn" v-show="btnsData.length > 0">
        <div class="btn-item" v-for="item of btnsData" :key="item.label" @click="bntOperate(item.path)">
          <div class="btns-border"></div>
          <div class="btns">{{ item.label }}</div>
        </div>
        <div class="btns-border"></div>
      </div>
    </el-col>
    <el-col :span="3" class="h-64 user-setting">
      <el-dropdown @command="handleCommand" trigger="click">
        <span class="el-dropdown-link"> {{userName}} <i class="el-icon-caret-bottom"></i></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item of dropdownList" :key="item.id" :icon="item.icon" :command="item.id">{{ item.label }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="border-box">
        <div class="setting-border setting-border-left"></div>
        <div class="setting-border setting-border-right"></div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import login from '@/api/login'
import { removeToken } from '@/utils/auth'
export default {
  name: 'CommonHeader',
  data() {
    return {
      bgUrl: require('@/assets/title.png'),
      logoUrl: require('@/assets/fulong.png'),
      selectUrl: require('@/assets/select.png'),
      dropdownList: [
        { id: '0', label: '退出', icon: 'el-icon-circle-close' }
      ],
      left: -18
    }
  },
  computed: {
    ...mapState('userInfo', {
      proList: state => state.projectList,
      currentPro: state => state.currentPro,
      userName: state => state.userInfo.realName,
      permssion: state => state.userInfo.permission,
      btnsData: state => state.toolBtn
    })
  },
  created() {
    // 定位背景标记的位置
    this.selectBgPosition()
  },
  // mounted() {
  //   this.$set(this, 'project', JSON.parse(JSON.stringify(this.currentPro)))
  // },
  methods: {
    ...mapMutations('userInfo', [
      'saveCurrentPro',
      'clearCache'
    ]),
    changeProject(value) {
      this.$emit('projectId', value.projectId)
      this.saveCurrentPro(value)
    },
    bntOperate(path) {
      console.log(path)
      if (path === this.$route.path) {
        return
      }
      this.$router.push(path)
    },
    handleCommand(command) {
      switch (command) {
        case '0': this.loginOut()
          break
      }
      console.log(command)
    },
    loginOut() {
      login.loginOut().then(res => {
        removeToken()
        localStorage.removeItem('userInfo')
        this.clearCache()
        this.$router.push('/login')
      })
    },
    clipping() {
      if (this.clippingBtnShow) {
        this.$emit('clipping')
      }
    },
    selectBgPosition() {
      for (let i = 0; i < this.btnsData.length; i++) {
        if (this.$route.path === this.btnsData[i]['path']) {
          this.$set(this, 'left', -18 + (i * 127))
          break
        }
      }
    },
    goHomePage() {
      this.$router.push('/project-list')
    }
  }
}
</script>
<style lang="less" scoped>
.h-64{
  height: 64px;
  cursor: pointer;
}
.logo{
  margin-left: 30px;
  margin-top: 20px;
  height: 36px;
  animation: logoRotate 2s linear infinite;
}
@keyframes logoRotate {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.tool-btn{
  border-bottom: 1px solid #fff;
  flex: 1;
  display: flex;
  border-bottom-left-radius: 15px;
  flex-direction: row;
  z-index: 100;
}
.tool-content{
  display: flex;
  flex-direction: row;
  position: relative;
}
.select-bg{
  height: 64px;
  width: 204px;
  background-position: -47px -20px;
  position: absolute;
  top: 0;
}
.btns{
  width: 127px;
  color: #fff;
  height: 20px;
  text-align: center;
}
.clipping-btn{
  margin-top: 38px;
}
.btns-border{
  width: 2px;
  height: 16px;
  background: #fff;
  margin-top: 46px;
  transform:skew(45deg);
}
.user-setting{
  text-align: right;
  color: #fff;
}
/deep/.el-dropdown{
  color: #fff;
  margin: 34px 15px 10px 0;
}
.border-box{
  display: flex;
  flex-direction: row;
}
.setting-border-left{
  width: 15px;
  margin-right: 6px;
}
.setting-border-right{
  flex:1
}
.setting-border{
  height: 5px;
  background: #fff;
  transform:skew(-45deg);
}
.btn-item .btns{
  margin-top: -25px;
}
.header-row{
  box-shadow: 2px 2px 15px rgba(44,76,124,1)
}
.go-back{
  margin-top: 45px;
  color: #fff;
  cursor: pointer;
}
</style>
