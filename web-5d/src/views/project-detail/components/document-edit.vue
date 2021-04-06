<template>
  <el-container>
    <el-form label-width="80px" :model="fromDate" style="width: 100%">
      <el-form-item label="文件名称">
        <el-input v-model="fromDate.fileName"></el-input>
      </el-form-item>
      <!-- <el-form-item label="关联位置">
        <el-input v-model="fromDate.locataion"></el-input>
      </el-form-item> -->
      <el-form-item label="备注">
        <el-input type="textarea" v-model="fromDate.remark"></el-input>
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button type="primary" @click="save">确定</el-button>
        <el-button @click="cacel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-container>
</template>
<script>
export default {
  name: 'document-edit',
  data() {
    return {
      fromDate: {
        fileName: '',
        location: '',
        remark: '',
        uploadTime: '',
        uploadType: ''
      }
    }
  },
  methods: {
    save() {
      // 保存过后关闭弹框
      this.cacel()
    },
    cacel() {
      // 取消关闭弹框
      this.$emit('upDialogMask', false)
    }
  }
}
</script>
<style lang="less" scoped>
.el-container {
  background: 0 0;
}
</style>
