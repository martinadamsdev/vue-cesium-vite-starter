<template>
  <el-row>
    <el-col :span="20">
      <i class="el-icon-back header-icon"  v-if="leftTitle !=='数字化交付平台'" @click="goback">返回</i>
      <i v-else :class="leftIconClass" class="header-icon"></i>
      <span class="logo-title">{{ leftTitle }}</span>
    </el-col>
    <el-col v-if="loginStatus" :span="4" class="right-col">
      <el-dropdown @command="handleCommand" trigger="click">
        <span class="el-dropdown-link">{{ rightTitle }} <i :class="rightIconClass" class="header-icon"></i></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item of dropdownList" :key="item.id" :icon="item.icon" :command="item.id">{{ item.label }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
    <el-col v-else :span="4" class="right-col" @click.native="leftClick">
      <span class="title">{{ rightTitle }}</span>
      <i :class="rightIconClass" class="header-icon"></i>
    </el-col>
  </el-row>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import login from '@/api/login'
import { removeToken } from '@/utils/auth'
export default {
  name: 'Header',
  props: {
    leftIconClass: {
      type: String,
      default: 'el-icon-s-custom'
    },
    leftTitle: {
      type: String,
      default: '数字化交付平台'
    }
  },
  data() {
    return {
      rightTitle: '登录',
      rightIconClass: 'el-icon-arrow-right',
      loginStatus: false,
      dropdownList: [
        { id: '0', label: '退出', icon: 'el-icon-circle-close' }
        // { id: '1', label: '设置', icon: 'el-icon-s-tools' }
      ]
    }
  },
  computed: {
    ...mapState('userInfo', {
      userName: state => state.userInfo.realName
    })
  },
  created() {
    if (this.userName) {
      this.$set(this, 'rightTitle', this.userName)
      this.$set(this, 'loginStatus', true)
      this.$set(this, 'rightIconClass', 'el-icon-caret-bottom')
    }
  },
  methods: {
    ...mapMutations('userInfo', [
      'saveCurrentPro',
      'clearCache'
    ]),
    goback() {
      this.$router.push('/project-list')
      this.$emit('goback')
    },
    leftClick() {
      console.log(111)
      this.$emit('leftClick')
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
    }
  }
}
</script>
<style lang="less" scoped>
.el-row{
  width: 100%;
  line-height: @height;
  padding: 0 20px;
  background: rgba(21, 24, 45, 0.9)
}
.logo-title,.header-icon{
  font-size: @title-size;
  color: @icon-color;
}
.logo-title{
  margin-left: 10px;
}
.title{
  color: @icon-color;
}
.right-col{
  text-align: right;
  cursor: pointer;
}
.el-dropdown-link{
  color: #fff;
}
</style>
