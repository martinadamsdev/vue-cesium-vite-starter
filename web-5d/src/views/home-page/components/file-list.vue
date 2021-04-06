<template>
  <el-card class="file-list" :class="[show ? 'active' : 'disActive']">
    <div slot="header" class="clearfix">
      <span class="title">关联附件</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="handleFileList"><i class="el-icon-close"></i></el-button>
    </div>
    <el-table
      :data="tableData"
    >
    <el-table-column
      prop="name"
      label="文件名"
      show-overflow-tooltip
    >
    </el-table-column>
    <el-table-column
      prop="updateTime"
      label="上传时间"
    >
    </el-table-column>
    <el-table-column
      prop="oprator"
      label="上传人"
    >
    </el-table-column>
    <el-table-column
      align="center"
      fixed="right"
      label="操作"
      width="100">
      <template>
        <el-button type="text" size="small">预览</el-button>
        <el-button type="text" size="small">下载</el-button>
      </template>
    </el-table-column>
    </el-table>
    <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" class="add-file-btn">添加关联文档</el-button>
  </el-card>
</template>
<script>
export default {
  name: 'FileList',
  props: {
    isActive: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      tableData: [{
        name: '关于模型的文档1',
        updateTime: '2020-11-11 11:11:59',
        oprator: '张三'
      }, {
        name: '关于模型的文档2',
        updateTime: '2020-11-11 12:12:59',
        oprator: '李四'
      }, {
        name: '关于模型的文档3',
        updateTime: '2020-11-11 13:13:59',
        oprator: '王五'
      }],
      show: this.isActive
    }
  },
  watch: {
    isActive(val) {
      console.log(val)
      this.$set(this, 'show', val)
    }
  },
  methods: {
    handleFileList() {
      this.$emit('handleFileList')
    }
  }
}
</script>
<style lang="less" scoped>
.file-list{
  width: 600px;
  position: fixed;
  padding-bottom: 10px;
  right: 20px;
  top: 400px;
  transition: all 1s;
}
.disActive{
  opacity: 0;
  display: none;
}
.active{
  opacity: 1;
  display: block;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.title{
  font-size: 14px;
  display: inline-block;
  margin-top: 4px;
}
/deep/.el-card__header{
  padding: 5px 20px;
}
/deep/.el-card__body{
  padding: 0;
}
/deep/.el-table td, .el-table th{
  padding: 3px 0;
}
.el-table{
  margin-bottom: 10px;
}
.add-file-btn{
  float: right;
  margin-right: 10px;
}
</style>
