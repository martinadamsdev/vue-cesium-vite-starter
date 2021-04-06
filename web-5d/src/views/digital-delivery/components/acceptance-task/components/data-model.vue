<!--
 * @Author: your name
 * @Date: 2021-01-25 14:26:51
 * @LastEditTime: 2021-03-03 15:11:49
 * @LastEditors: Please set LastEditors
 * @Description: 文档验收model
 * @FilePath: \web-5d\src\views\task-list\delivery-task\components\document-model.vue
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
          <el-table-column prop="createTime" label="交付日期"> </el-table-column>
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
          <!--<el-divider content-position="center">属性数据</el-divider>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane label="交付属性" name="first">
              </el-tab-pane>
              <el-tab-pane label="已有属性" name="second">
              </el-tab-pane>
            </el-tabs>-->
          <el-form-item label="验收结果：">
            <el-radio v-model="result" label="1">通过</el-radio>
            <el-radio v-model="result" label="2">驳回</el-radio>
          </el-form-item>
          <el-form-item label="验收意见：">
            <el-input type="textarea" v-model="dec"></el-input>
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
      tableData: [],
      loadingFlag: false,
      dec: '',
      result: '1',
      historyList: [],
      name: '',
      stageName: '',
      treeFolderName: ''
    }
  },
  computed: {
    ...mapState('userInfo', {
      userInfo: state => state.userInfo
    })
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.$set(this, 'loadingFlag', true)
      task.getProperty(this.deliveryContentId).then((result) => {
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
    accpetClick() {
      // 验收点击事件 flag 通过or驳回
      var fromData = {
        id: this.deliveryContentId,
        opinions: `${this.result === '1' ? '验收' : '驳回'}意见：` + this.dec,
        result: this.result === '1' ? '验收通过' : '验收驳回',
        status: '3',
        taskType: this.result,
        type: 'data',
        dataType: 'property',
        userId: this.userInfo.userId,
        userName: this.userInfo.realName
      }
      this.accpetSub(fromData)
    },
    accpetSub(fromData) {
      task.taskOk(fromData).then((res) => {
        this.$message.success('操作成功！')
        this.close()
      }).catch((err) => {
        this.$message.error(err)
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
.tab{
  padding-top: 20px;
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
