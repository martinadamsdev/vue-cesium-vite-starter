<!--
 * @Author: your name
 * @Date: 2021-02-24 10:56:59
 * @LastEditTime: 2021-02-24 11:33:25
 * @LastEditors: Please set LastEditors
 * @Description: 统一历史记录弹框
 * @FilePath: \web-5d\src\views\digital-delivery\components\history.vue
-->
<template>
  <el-container>
     <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column label="时间" prop="verifyCreateTime" />
      <el-table-column label="审核人" prop="verifyUserName" />
      <el-table-column label="审核结果" prop="verifyResult" />
      <el-table-column label="审核意见" prop="verifyOpinions" />
    </el-table>
  </el-container>
</template>
<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  created() {
    this.setData()
  },
  methods: {
    setData() {
      this.tableData.forEach(item => {
        item.verifyOpinions = item.verifyOpinions.split('：')[1]
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
