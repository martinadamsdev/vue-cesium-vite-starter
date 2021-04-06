<!--
 * @Author: your name
 * @Date: 2021-02-24 09:34:12
 * @LastEditTime: 2021-03-03 15:10:42
 * @LastEditors: Please set LastEditors
 * @Description: 模型交付弹出框
 * @FilePath: \web-5d\src\views\digital-delivery\components\review-task\components\check-model-model.vue
-->
<template>
  <el-container>
    <el-main>
      <el-row>
        <el-form label-width="100px" >
          <el-form-item label="审核结果：">
            <el-radio v-model="result" label="1">通过</el-radio>
            <el-radio v-model="result" label="2">驳回</el-radio>
          </el-form-item>
          <el-form-item label="审核意见：">
            <el-input type="textarea" v-model="desc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click.native="accpetClick">确定</el-button>
            <el-button @click.native="close">取消</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <RegS  :delivery-content-id="deliveryContentId"/>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
import RegS from './../../model-regs'
import { mapState } from 'vuex'
import task from '@/api/task'
export default {
  props: {
    deliveryContentId: {
      type: String,
      default: () => {
        return ''
      }
    },
    accept: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  components: {
    RegS: RegS
  },
  data() {
    return {
      loadingFlag: false,
      desc: '',
      result: '1'
    }
  },
  computed: {
    ...mapState('userInfo', {
      userInfo: state => state.userInfo
    })
  },
  created() {
  },
  methods: {
    accpetClick(flag) {
      // 审核点击事件 flag 通过or驳回
      console.log(this.desc)
      task.taskOk({
        id: this.deliveryContentId,
        opinions: `审核意见：${this.desc}`,
        result: this.result === '1' ? '审核通过' : '审核驳回',
        status: '2',
        taskType: this.result,
        type: 'model',
        userId: this.$store.state.userInfo.userInfo.userId,
        userName: this.$store.state.userInfo.userInfo.realName
      }).then(res => {
        this.$emit('close')
      })
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.upload-demo {
  display: inline-block;
}
/deep/ .el-upload-list {
  display: none;
}
</style>
