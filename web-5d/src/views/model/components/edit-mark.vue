<template>
  <ul class="edit-panel" ref="editPanel" :style="style" v-show="show">
    <li></li>
    <li class="edit-item title" @click="click('edit')"><i class="el-icon-edit icon"></i>编辑</li>
    <li class="edit-item title" @click="click('delete')"><i class="el-icon-remove icon"></i>删除</li>
  </ul>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default() {
        return false
      }
    },
    position: {
      type: Object,
      default() {
        return {
          left: 0,
          top: 0
        }
      }
    }
  },
  name: 'EditMark',
  data() {
    return {
      style: `top: ${this.position.top}px; left: ${this.position.left}px;`
    }
  },
  watch: {
    position(val) {
      this.$refs.editPanel.style.top = `${val.top}px`
      this.$refs.editPanel.style.left = `${val.left}px`
    }
  },
  mounted() {
    console.log(this.style)
  },
  methods: {
    click(type) {
      this.$emit('editMark', type)
      console.log(type)
    }
  }
}
</script>
<style lang='less' scoped>
.edit-panel{
  position: fixed;
  padding: 10px 0;
  margin: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(126, 92, 92, 0.1);
}
.edit-item{
  text-align: center;
  line-height: 30px
}
.edit-item:hover{
  color: #8cc5ff;
  background: rgba(236,245,255,1);
}
.title{
  padding: 0 20px;
  margin: 0;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  outline: 0;
}
.icon{
  margin-right: 8px;
}
</style>
