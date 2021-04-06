<!--
 * @Author: your name
 * @Date: 2021-01-21 17:17:32
 * @LastEditTime: 2021-01-21 17:18:01
 * @LastEditors: Please set LastEditors
 * @Description: 数据交付
 * @FilePath: \web-5d\src\views\task-list\delivery-task\components\data.vue
-->
<template>
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      prop="date"
      label="日期"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
  </el-table-column>
</el-table>
</template>
<script>
export default {
  data() {
    return {
      tableData: []
    }
  }
}
</script>
<style scoped>
</style>
