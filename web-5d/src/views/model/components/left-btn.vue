<template>
  <div class="left-btn-box">
    <p
      v-for="item of btnList"
      :key="item.id"
      :title="item.name"
      class="btn-item"
      @click="clickBtn(item.id)"
    >
      <i :class="[isActive === item.id ? 'active' : '', item.class]"></i>
    </p>
  </div>
</template>
<script>
export default {
  name: 'LeftBtn',
  data() {
    return {
      btnList: [
        { id: '0', name: '查看目录', class: 'iconfont icon-jiegou' },
        { id: '1', name: '检索', class: 'iconfont icon-jiansuo' },
        { id: '2', name: '驾驶舱', class: 'iconfont icon-shujujiashicang' },
        { id: '3', name: '查看视点', class: 'iconfont icon-shitushidianguanli' },
        { id: '4', name: '查看标注', class: 'iconfont icon-position' },
        { id: '5', name: '查看关联文档', class: 'el-icon el-icon-folder-opened' }
      ],
      isActive: ''
    }
  },
  methods: {
    clickBtn(id) {
      if (this.isActive === id) {
        this.isActive = ''
      } else {
        this.isActive = id
      }
      switch (id) {
        case '0': this.$emit('viewMenu', this.isActive)
          break
        case '3': this.$emit('viewTag', this.isActive)
          break
        case '4': this.$emit('viewMark', this.isActive)
          break
        case '5': this.$emit('viewLinkDoc', this.isActive)
          break
      }
    }
  }
}
</script>
<style lang="less" scoped>
.left-btn-box{
  padding: 20px 10px;
  background: rgba(44,76,124,1);
  border-radius: 30px;
  position: fixed;
  left: 20px;
  top: 300px;
}
.btn-item{
  cursor: pointer;
}
.left-btn-box .btn-item{
  margin-bottom: 40px;
}
.left-btn-box .btn-item:nth-last-child(1){
  margin-bottom: 0px;
}
.active {
  color: #66f1f1;
  background: rgba(102,241,241, 0.3);
  box-shadow: 0px 0px 5px #66f1f1;
  transition: all 500ms;
}
.el-icon-folder-opened{
  font-size: 16px;
  color: #fff;
}
</style>
