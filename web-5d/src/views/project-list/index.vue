<template>
  <el-container class="warp">
    <el-header class="wrap-header">
      <Header
        leftIconClass="el-icon-s-custom"
        leftTitle="数字化交付平台"
        @leftClick="leftClick"
      />
    </el-header>
    <el-container v-if="list.length > 0">
      <el-aside>
        <ul
          class="infinite-list"
          v-infinite-scroll="load"
          style="overflow: auto"
          infinite-scroll-immediate="false"
        >
          <li v-for="(item, index) in list" :key="item.projectId" class="infinite-list-item">
            <span
              v-if="index == 0"
              :title="item.projectName"
              :data-id="item.projectId"
              :data-index="index"
              class="company-detail active"
              @click="active($event, item)"
            >
              {{ item.projectName }}
            </span>
            <span class="company-detail" v-else :title="item.projectName" @click="active($event, item)" :data-id="item.projectId" :data-index="index">{{ item.projectName }}</span>
            <i v-if="index == 0" class="el-icon-thumb company-icon icon-active"></i>
            <i v-else class="el-icon-thumb company-icon"></i>
          </li>
        </ul>
      </el-aside>
      <el-main>
        <el-row class="locking" v-show="isLock">
          <img :src="lockUrl"/>
          <p class="lock-tip">该项目已锁定,暂不能操作,请联系管理员!</p>
        </el-row>
        <ProjectItem ref="itemDetail" v-show="!isLock" :id="oldId" @goNextPage="goNextPage"/>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-main>
        <el-row class="locking">
          <img :src="emptyUrl"/>
          <p class="lock-tip">暂无分配项目,请联系管理员!</p>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import getProject from '@/api/project-list'
import { mapState, mapMutations } from 'vuex'
import { loading, loadingClose } from '@/utils/index'
export default {
  name: 'ProjectList',
  data() {
    return {
      isLock: false,
      lockUrl: require('@/assets/lock.png'),
      emptyUrl: require('@/assets/empty.png'),
      list: [],
      oldId: '', // 记录点击的项目
      oldPro: {}, // 记录当前点击的项目
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
      userId: state => state.userInfo.userId,
      permssion: state => state.userInfo.permission,
      toolBtn: state => state.toolBtn
    })
  },
  components: {
    Header: () => import('@/components/header'),
    ProjectItem: () => import('./components/project-item')
  },
  created() {
    this.addPermission()
  },
  mounted() {
    this.getProjectList(this.userId)
  },
  methods: {
    ...mapMutations('userInfo', [
      'saveProjectList',
      'saveCurrentPro',
      'saveToolBtn'
    ]),
    getProjectList(id) {
      loading()
      getProject.getProjectList(id).then(res => {
        this.list.splice(0)
        loadingClose()
        this.traverseArr(res[0].pros)
        this.saveProjectList(JSON.parse(JSON.stringify(res[0].pros)))
        if (this.list.length > 0) {
          if (this.list[0].status === '1') {
            this.$set(this, 'isLock', true)
          }
          this.oldId = this.list[0].projectId
          this.$set(this, 'oldPro', this.list[0])
          this.saveCurrentPro(this.list[0])
        }
      }).catch(() => {
        loadingClose()
        // this.list.splice(0)
      })
    },
    // 解决数组赋值为空的问题
    traverseArr(arr) {
      for (let i = 0; i < arr.length; i++) {
        this.list.push(arr[i])
      }
    },
    leftClick() {
      // 做相对应的操作
      console.log('做相对应的操作')
    },
    load() {
      // 触底加载
      this.count += 2
    },
    active(event, item) {
      console.log(item)
      // 修改样式 以及绑定子级的公司id
      if (this.oldId === event.target.dataset.id) {
        return
      }
      this.oldId = event.target.dataset.id
      this.saveCurrentPro(this.list[event.target.dataset.index])
      let oldActive = event.target.parentNode.parentNode.getElementsByClassName(
        'active'
      )[0]
      let oldIcon = event.target.parentNode.parentNode.getElementsByClassName(
        'icon-active'
      )[0]
      oldActive.className = 'company-detail'
      oldIcon.className = 'el-icon-thumb company-icon'
      let nowIconDom = event.target.parentNode.getElementsByClassName(
        'el-icon-thumb'
      )[0]
      nowIconDom.className = 'el-icon-thumb company-icon icon-active'
      event.target.className = 'company-detail active'
      // 获取项目详情
      if (item.status === '1') {
        this.$set(this, 'isLock', true)
        return
      }
      this.$set(this, 'isLock', false)
      this.$refs.itemDetail.init()
      this.$refs.itemDetail.getMyTaskList(this.oldId)
      this.$refs.itemDetail.getProDetails(this.oldId)
      this.$refs.itemDetail.getMilestone(this.oldId)
    },
    addPermission() {
      for (let key in this.modulePath) {
        if (this.permssion[key]) {
          this.btnsData.push({
            label: this.permssion[key]['menuName'],
            path: this.modulePath[key]
          })
        }
        this.saveToolBtn(JSON.parse(JSON.stringify(this.btnsData)))
      }
    },
    goNextPage() {
      // 先判断一下当前用户是否有权限进入其他模块
      if (this.toolBtn.length === 0) {
        this.$message({
          type: 'warning',
          message: '您暂时没有其他操作权限，请联系管理员为您分配权限'
        })
        return
      }
      this.$router.push(this.btnsData[0]['path'])
    }
  }
}
</script>
<style lang="less" scoped>
.warp {
  width: 100%;
  box-sizing: border-box;
  background: black;
  height: 100%;
}
.warp > .el-container {
  height: calc(100% - 60px);
}
.el-header {
  padding: 0;
}
.el-aside,
.el-main {
  background: rgba(21, 24, 45, 0.9) !important;
}
.el-main{
  padding-top: 0;
}
.el-aside {
  width: 317px;
  padding: 60px 0 30px 30px;
}
.infinite-list::-webkit-scrollbar,
.el-aside::-webkit-scrollbar {
  display: none;
}
.infinite-list li {
  margin-bottom: 45px;
}
.company-detail {
  display: inline-block;
  background: #82848F;
  width: 75%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
  padding: 12px 9px;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
}
.company-detail:hover {
  background: #475e9a;
}
.company-icon {
  color: white;
  transform: rotate(90deg);
  font-size: 16px;
  margin-left: 20px;
  display: none;
}
.icon-active {
  display: inline-block;
}
.active {
  background: #475e9a;
}
.lock-tip{
  color: #fff;
  margin-top: 20px;
}
.locking{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
