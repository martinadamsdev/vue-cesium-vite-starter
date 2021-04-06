<template>
  <el-card class="right-panel" :class="[show ? 'active' : 'disActive']" ref="rightPanel">
    <div class="link-btn" @click="closeRight">
      <p class="btn-txt">关联文档</p>
      <p class="btn-icon"><i class="el-icon-arrow-right"></i></p>
    </div>
  </el-card>
</template>
<script>
export default {
  name: 'RightPanel',
  props: {
    axis: {
      type: Object,
      default() {
        return {
          left: 0,
          top: 0
        }
      }
    },
    isActive: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      show: this.isActive
    }
  },
  watch: {
    isActive(val) {
      console.log(val)
      this.$set(this, 'show', val)
    },
    axis: {
      handler(val) {
        console.log(val.top)
        this.$refs.rightPanel.$el.style.top = val.top + 'px'
        this.$refs.rightPanel.$el.style.left = val.left + 'px'
      },
      deep: true
    }
  },
  methods: {
    closeRight() {
      this.$emit('closeRight')
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-card__body{
  padding: 10px;
  width: 150px;
}
.link-btn{
  cursor: pointer;
}
.link-btn:hover{
  color: #409EFF;
}
.right-panel{
  position: fixed;
  top: 0px;
  left: 0px;
  transition: all 1s;
}
.disActive{
  display: none;
}
.active{
  display: block;
}
.btn-txt{
  display: inline-block;
}
.btn-icon{
  float: right;
}
</style>
