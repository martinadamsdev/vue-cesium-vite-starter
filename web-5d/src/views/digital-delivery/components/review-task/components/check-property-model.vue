<!--
 * @Author: qilanli
 * @Date: 2021-03-17 15:26:32
 * @LastEditTime: 2021-03-17 16:52:39
 * @LastEditors: Please set LastEditors
 * @Description: 数据审核 属性
 * @FilePath: \web-5d\src\views\digital-delivery\components\review-task\components\check-property-model.vue
-->
<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :span="8">名称：{{ name }}</el-col>
        <el-col :span="8">属性类别: {{ stageName }}</el-col>
        <el-col :span="8">交付范围:{{ treeFolderName }}</el-col>
      </el-row>
      <el-row class="tab">
        <el-table v-loading="loadingFlag" ref="tab" :data="tableData" style="width: 100%">
          <el-table-column prop="fileNo" label="编码" width="180">
          </el-table-column>
          <el-table-column prop="name" label="文档名称" width="180">
          </el-table-column>
          <el-table-column prop="type" label="文档类型" width="100"> </el-table-column>
          <el-table-column prop="createBy" label="交付人"> </el-table-column>
          <el-table-column prop="createTime" label="交付时间"> </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-form label-width="100px" >
          <el-collapse accordion>
            <el-collapse-item title="历史记录" name="1">
              <el-timeline>
                <el-timeline-item  v-for="(item, index) in historyList" :key="index" :timestamp="item.verifyCreateTime" placement="top">
                <el-card>
                    <h6>{{ item.verifyResult }} {{ item.verifyUserName }}</h6>
                    <p>{{ item.verifyOpinions }}</p>
                </el-card>
                </el-timeline-item>
              </el-timeline>
            </el-collapse-item>
          </el-collapse>
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
import RegS from './../../data-property-reg'
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
      tableData: [],
      historyList: [],
      loadingFlag: false,
      desc: '',
      result: '1',
      name: '',
      stageName: '',
      treeFolderName: ''
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.$set(this, 'loadingFlag', true)
      task.findMyTaskByPropertyId(this.deliveryContentId).then((result) => {
        this.$set(this, 'tableData', result.pdpflist)
        this.$set(this, 'historyList', result.pdpho)
        this.$set(this, 'loadingFlag', false)
        this.$set(this, 'name', result.name)
        this.$set(this, 'stageName', result.stageName)
        this.$set(this, 'treeFolderName', result.treeFolderName)
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    accpetClick(flag) {
      // 审核点击事件 flag 通过or驳回
      console.log(this.desc)
      task.taskOk({
        dataType: 'property',
        id: this.deliveryContentId,
        opinions: `审核意见：${this.desc}`,
        result: this.result === '1' ? '审核通过' : '审核驳回',
        status: '2',
        taskType: this.result,
        type: 'data',
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
.el-main>.el-row:nth-child(1){
  background: #F5F7FA;
  height: 40px;
  text-align: center;
  line-height: 40px;
  border-radius: 5px;
}
</style>
