<template>
  <el-container style="height: 100%" ref="container">
    <el-header style="height: 40px" ref="header">
      <Header
        @leftClick="goLogin"
      />
    </el-header>
    <el-main ref="main">
      <Model v-if="isLoadModel" :style="{height: height+'px'}" ref="model" @rightClick="rightClick"/>
    </el-main>
    <RightPanel :axis="rightPanelAxis" :isActive="rightPanelShow" @closeRight="closeRight"/>
  </el-container>
</template>
<script>
export default {
  name: 'VisitorsPage',
  components: {
    Header: () => import('@/components/header'),
    Model: () => import('./components/model'),
    RotateScale: () => import('@/views/home-page/components/rotate-scale'),
    RightPanel: () => import('@/views/home-page/components/right-panel')
  },
  data() {
    return {
      isLoadModel: false,
      height: 0,
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
      fileListShow: false
    }
  },
  mounted() {
    // 这么做是因为直接获取的话高度为0
    this.$nextTick(() => {
      this.$set(this, 'height', window.innerHeight - this.$refs.header.$el.clientHeight)
      this.$set(this, 'isLoadModel', true)
      this.containerSize = {
        height: window.innerHeight,
        width: window.innerWidth
      }
    })
  },
  methods: {
    change(parmas) {
      if (this.$refs.model) {
        this.$refs.model.rotating(parmas.type, parmas.value)
      }
    },
    // 缩小
    narrow() {
      this.$refs.model.narrow()
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
</style>
