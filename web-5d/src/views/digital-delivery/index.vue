<!--
 * @Author: your name
 * @Date: 2021-02-22 15:06:24
 * @LastEditTime: 2021-03-18 17:21:11
 * @LastEditors: Please set LastEditors
 * @Description:  数字交付
 * @FilePath: \web-5d\src\views\digital-delivery\index.vue
-->
<template>
  <el-container
    :style="{
      backgroundImage: 'url(' + bgUrl + ')',
      backgroundPosition: 'center',
    }"
  >
    <el-header class="header">
      <!-- <Header v-on:projectId="getProjectId"/> -->
      <Header />
    </el-header>
    <el-main>
      <el-tabs v-model="type" type="border-card">
        <el-tab-pane v-if="hasDelivery" name="Delivery" label="交付任务">
          <Delivery v-if="type === 'Delivery'"/>
        </el-tab-pane>
        <el-tab-pane v-if="hasReview" name="Review" label="审核任务">
          <Review v-if="type === 'Review'"/>
        </el-tab-pane>
        <el-tab-pane v-if="hasAcceptance" name="Acceptance" label="验收任务">
          <Acceptance  v-if="type === 'Acceptance'"/>
        </el-tab-pane>
        <el-tab-pane label="里程碑"> 里程碑 </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      bgUrl: require('@/assets/bg.png'),
      type: ''
    }
  },
  created() {
    var type = this.$route.query.type || 'Delivery'
    this.$set(this, 'type', type)
  },
  computed: {
    ...mapState('userInfo', {
      permission: state => state.permission
    }),
    hasDelivery() {
      if (this.permission.indexOf('digitalDelivery:deliveryTask') !== -1) {
        return true
      }
      return false
    },
    hasReview() {
      if (this.permission.indexOf('digitalDelivery:auditTask') !== -1) {
        return true
      }
      return false
    },
    hasAcceptance() {
      if (this.permission.indexOf('digitalDelivery:acceptanceTask') !== -1) {
        return true
      }
      return false
    }
  },
  components: {
    Header: () => import('@/components/common-header'),
    Delivery: () => import('./components/delivery-task'), // 交付任务
    Review: () => import('./components/review-task'), // 审核任务
    Acceptance: () => import('./components/acceptance-task') // 验收任务
  }
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-tabs--border-card{
  border: none;
}
/deep/ .el-tabs--border-card{
  background: transparent;
}
/deep/ .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
  color: white;
  background: rgba(21, 24, 45, 0.9) !important;
}
/deep/ .el-tabs--border-card>.el-tabs__content{
  padding: 0;
}
/deep/ .el-pagination__jump{
  color: white;
}
</style>
