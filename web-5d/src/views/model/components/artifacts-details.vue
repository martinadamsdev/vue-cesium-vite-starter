<template>
  <el-card class="box-card" ref="card" id='box-card' @mousedown="move">
    <div v-for="(item, key) in baseData" :key="key" class="property-box">
      <p class="property-title">{{ key }}</p>
      <div v-for="(item, key) in item" :key="key" class="text item">
        <span>{{ key }}</span>
        <span>{{ item }}</span>
      </div>
    </div>
    <div v-if="hasPro">
      <div v-for="(item, key) in detailsData" :key="key" class="property-box">
        <p class="property-title">{{ key }}</p>
        <div v-for="(item, key) in item" :key="key" class="text item">
          <span>{{ key }}</span>
          <span>{{ item }}</span>
        </div>
      </div>
    </div>
  </el-card>
</template>
<script>
var dom = {}
export default {
  name: 'ArtifactsDetails',
  props: {
    data: {
      type: Object,
      default() {
        return {
          '设计类': {
            '名称': '油罐',
            '高度': '100m'
          }
        }
      }
    },
    baseData: {
      type: Object,
      default() {
        return {
          '基本属性': {
            '构件ID': '',
            '构件名称': ''
          }
        }
      }
    }
  },
  data() {
    return {
      innerWidth: 0,
      innerHeight: 0,
      cardWidth: 0,
      cardHeight: 0,
      isMouseDown: false,
      detailsData: this.data
    }
  },
  watch: {
    data: {
      handler(newData) {
        this.$set(this, 'detailsData', newData)
      },
      deep: true
    }
  },
  computed: {
    hasPro() {
      if (JSON.stringify(this.data) === '{}') {
        return false
      }
      return true
    }
  },
  mounted() {
    this.$set(this, 'innerWidth', window.innerWidth)
    this.$set(this, 'innerHeight', window.innerHeight)
    this.$set(this, 'cardWidth', this.$refs.card.$el.offsetWidth)
    this.$set(this, 'cardHeight', this.$refs.card.$el.offsetHeight)
    window.onresize = () => {
      this.$set(this, 'innerWidth', window.innerWidth)
      this.$set(this, 'innerHeight', window.innerHeight)
    }
    dom = document.getElementById('box-card')
  },
  methods: {
    move(e) {
      let downE = e
      let target = e.target
      let disX = this.cardWidth - target.offsetLeft
      let disY = this.cardHeight - target.offsetTop
      this.isMouseDown = true
      document.onmousemove = (e) => {
        if (!this.isMouseDown) return false
        if (downE.clientX !== e.clientX && downE.clientY !== e.clientY) {
          let limitX = this.innerWidth - e.clientX - disX
          let limitY = this.innerHeight - e.clientY - disY
          let left = e.clientX - target.offsetLeft
          let top = e.clientY - target.offsetTop
          // 边界处理
          if ((left <= 0 || limitX <= 0) || (top <= 40 || limitY <= 10)) {
            return
          }
          dom.style.left = `${left}px`
          dom.style.top = `${top}px`
        }
      }
      document.onmouseup = () => {
        if (!this.isMouseDown) return false
        this.isMouseDown = false
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  },
  destroyed() {
    window.onresize = null
    dom = null
  }
}
</script>
<style lang="less" scoped>
.box-card{
  position: fixed;
  width: 240px;
  right: 20px;
  top: 200px;
  background: rgba(44,76,124,0.2);
  border: 1px solid #249696;
  border-radius: 0;
}
/deep/.el-card__body{
  height: 400px;
  overflow: auto;
}
.title{
  font-size: 16px;
}

.text{
  font-size: 12px;
  color: #fff;
}
.item{
  margin-bottom: 10px;
  span{
    word-break: break-all
  }
}
.el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover{
  box-shadow: 2px 2px 15px rgba(44,76,124,1);
}
.property-box{
  margin-bottom: 10px;
}
.property-title{
  line-height: 24px;
  font-size: 14px;
  color: #fff;
  border-bottom: 1px solid #249696;
  margin-bottom: 10px;
}
</style>
