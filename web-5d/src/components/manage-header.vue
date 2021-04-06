<template>
  <el-row class="manage-header">
    <el-col :span="5" class="projectSelect">
      <el-select v-model="project" @change="changeProject" value-key="projectId">
        <el-option
          v-for="item in proList"
          :key="item.projectId"
          :label="item.projectName"
          :value="item"
        >
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="17" class="btns">
      <el-button type="info" v-for="item of btnsData" :key="item.label" @click="bntOperate(item.path)" :class="[item.path === $route.path ? 'active': '']">{{ item.label }}</el-button>
    </el-col>
    <el-col :span="2" class="uer-setting">
      <el-dropdown @command="handleCommand" trigger="click">
        <span class="el-dropdown-link">{{ userName }} <i class="el-icon-caret-bottom"></i></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item of dropdownList" :key="item.id" :icon="item.icon" :command="item.id">{{ item.label }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import login from '@/api/login'
import { removeToken } from '@/utils/auth'
export default {
  name: 'manag-header',
  data() {
    return {
      project: {},
      dropdownList: [
        { id: '0', label: '退出', icon: 'el-icon-circle-close' }
        // { id: '1', label: '设置', icon: 'el-icon-s-tools' }
      ],
      modulePath: {
        'model:all': '/home-page',
        'doc:all': '/project-detail',
        'digitalDelivery:all': '/digital-delivery'
      },
      btnsData: []
    }
  },
  computed: {
    ...mapState('userInfo', {
      proList: state => state.projectList,
      currentPro: state => state.currentPro,
      userName: state => state.userInfo.realName,
      permssion: state => state.userInfo.permission
    })
  },
  created() {
    this.addPermission()
  },
  mounted() {
    this.$set(this, 'project', JSON.parse(JSON.stringify(this.currentPro)))
  },
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
    // 根据权限列表添加功能按钮
    addPermission() {
      for (let key in this.modulePath) {
        this.btnsData.push({
          label: this.permssion[key]['menuName'],
          path: this.modulePath[key]
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.manage-header {
  background: rgba(21, 24, 45, 0.9);
  color: #fff !important;
}
.projectSelect{
  margin-top: 5px;
}
.uer-setting {
  cursor: pointer;
  text-align: center;
  line-height: 49px;
}
.user-name {
  float: right;
  margin-right: 10px;
  .el-icon-s-tools{
    margin-left: 5px;
  }
}
/deep/ .el-input__inner {
  border: none;
  background: 0 0;
  color: #fff;
}
/deep/ .el-select-dropdown {
  background: rgba(21, 24, 45, 0.9);
}
.btns{
  height: 50px;
  line-height: 50px;
}
.el-button--info{
  padding: 8px 15px;
}
/deep/.el-select .el-input .el-select__caret{
  color: #fff;
}
.el-dropdown-link{
  color: #fff;
}
.btns .active{
  background: rgba(64, 158, 255, 1);
  border-color: #409eff;
}
</style>
