<template>
  <el-container style="height: 100%" ref="container" class="home-container">
    <el-header style="height: 68px">
      <Header @projectId="changePro"/>
    </el-header>
    <el-main ref="main">
      <Model v-if="isLoadModel" :style="{height: height+'px'}" ref="model" @leftClick="leftClick" @rightClick="rightClick"/>
    </el-main>
    <!-- <RotateScale @change="change"/> -->
    <MarkPanel v-if="markPanelShow" :position="position" @cancel="cancel" ref="markPanel" @sureMark="sureMark"/>
    <RightPanel :axis="rightPanelAxis" :isActive="rightPanelShow" @closeRight="closeRight"/>
    <FileList :isActive="fileListShow" @handleFileList="handleFileList"/>
  </el-container>
</template>
<script>
import modelApi from '@/api/home-page.js'
import { loading, loadingClose } from '@/utils/index'
import { mapState } from 'vuex'

export default {
  name: 'HomePage',
  components: {
    Header: () => import('@/components/common-header'),
    Model: () => import('@/views/model/index'),
    RotateScale: () => import('./components/rotate-scale'),
    MarkPanel: () => import('./components/mark-panel'),
    RightPanel: () => import('./components/right-panel'),
    FileList: () => import('./components/file-list')
  },
  data() {
    return {
      isLoadModel: false,
      height: 0,
      markPanelShow: false,
      position: {
        left: 0,
        top: 0
      },
      containerSize: {
        height: 0,
        width: 0
      },
      rightPanelAxis: {
        left: 0,
        top: 0
      },
      rightPanelShow: false,
      fileListShow: false,
      modelMsg: {}
    }
  },
  computed: {
    ...mapState('userInfo', {
      userInfo: state => state.userInfo,
      currentPro: state => state.currentPro
    })
  },
  mounted() {
    // 这么做是因为直接获取的话高度为0
    this.$nextTick(() => {
      console.log(this.$refs.main.$el.clientHeight)
      this.$set(this, 'height', this.$refs.main.$el.clientHeight)
      this.$set(this, 'isLoadModel', true)
      this.containerSize = {
        height: window.innerHeight,
        width: window.innerWidth
      }
    })
  },
  methods: {
    // 项目切换
    changePro(id) {
      console.log(id)
      this.$refs.model.getModel(id)
    },
    change(parmas) {
      if (this.$refs.model) {
        this.$refs.model.rotating(parmas.type, parmas.value)
      }
    },
    // 缩小
    narrow() {
      this.$refs.model.narrow()
    },
    // 模型鼠标左击事件
    leftClick(position) {
      if (position) {
        console.log(position)
        this.$set(this, 'modelMsg', position.modelMsg)
        console.log(this.containerSize.width)
        let top = this.containerSize.height - position.top <= 250 ? position.top - 200 : position.top + 20
        let left = this.containerSize.width - position.left <= 180 ? (position.left - (this.containerSize.width - position.left + 300)) : position.left + 35
        this.position = Object.assign({}, this.position, {
          left: left,
          top: top
        })
        this.markPanelShow = true
        return
      }
      this.markPanelShow = false
    },
    // 取消标记
    cancel() {
      this.$set(this, 'markPanelShow', false)
      this.$refs.markPanel.resetForm()
      this.$refs.model.clearNoneMark()
      // this.$refs.model.cancelAdd()
    },
    // 控制构件目录树的按钮
    handleMenuTree() {
      this.$set(this, 'menuShow', !this.menuShow)
    },
    // 模型右点击事件
    rightClick(json) {
      console.log(json)
      this.$set(this, 'rightPanelShow', json.rightPanelShow)
      this.rightPanelAxis = Object.assign({}, this.rightPanelAxis, {
        left: json.axis.left,
        top: json.axis.top
      })
    },
    closeRight() {
      console.log('右击')
      this.$set(this, 'rightPanelShow', false)
      this.$set(this, 'fileListShow', true)
    },
    // 关闭文件列表
    handleFileList() {
      this.$set(this, 'fileListShow', false)
    },
    sureMark(val) {
      this.$set(this, 'markPanelShow', false)
      this.postMark({
        createBy: this.userInfo.realName,
        createById: this.userInfo.userId,
        projectId: this.currentPro.projectId,
        entityId: this.modelMsg.modelId,
        x: this.modelMsg.axias.x,
        y: this.modelMsg.axias.y,
        z: this.modelMsg.axias.z,
        description: val.desc,
        name: val.name
      })
    },
    postMark(data) {
      console.log(data)
      // 点击确定 发送数据 保存所标注的点
      loading('数据发送中...')
      modelApi.addMark(data).then(res => {
        console.log(res)
        loadingClose()
        this.$refs.model.sendMark(res)
        this.$message({
          type: 'success',
          message: '标注保存成功'
        })
        // this.$refs.markPanel.resetForm()
      }).catch(error => {
        console.log(error)
        loadingClose()
        this.$message({
          type: 'error',
          message: error.msg
        })
      })
    },
    // 去登录
    goLogin() {
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-main, .el-header{
  padding: 0;
}
.home-container{
  background: rgba(0, 10, 22, 1);
}
</style>
