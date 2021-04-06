<!--
 * @Author: your name
 * @Date: 2021-01-25 14:26:51
 * @LastEditTime: 2021-02-04 15:28:54
 * @LastEditors: Please set LastEditors
 * @Description: 文档验收model
 * @FilePath: \web-5d\src\views\task-list\delivery-task\components\document-model.vue
-->
<template>
  <el-container>
    <el-main>
      <el-row class="tab">
        <el-table v-loading="loadingFlag" ref="tab" :data="tableData" style="width: 100%">
          <el-table-column prop="docNo" label="编码" width="180">
          </el-table-column>
          <el-table-column prop="name" label="文档名称" width="180">
          </el-table-column>
          <el-table-column prop="docType" label="文档类型" width="50"> </el-table-column>
          <el-table-column prop="area" label="区域/单元"> </el-table-column>
          <el-table-column prop="categoryName" label="所属分类"> </el-table-column>
          <el-table-column prop="professionName" label="专业"> </el-table-column>
          <el-table-column prop="associatedObject" label="关联对象"> </el-table-column>
          <el-table-column label="编码校验" width="180">
            <template slot-scope="scope">
              {{ '编码校验规则' + scope.row.codeDocId }}
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-form label-width="100px" >
          <el-collapse accordion>
            <el-collapse-item title="历史记录" name="1">
              <el-timeline>
                <el-timeline-item  v-for="(item, index) in history" :key="index" :timestamp="item.verifyCreateTime" placement="top">
                <el-card>
                    <h6>{{ item.verifyResult }} {{ item.verifyUserName }}</h6>
                    <p>{{ item.verifyOpinions }}</p>
                </el-card>
                </el-timeline-item>
              </el-timeline>
            </el-collapse-item>
          </el-collapse>
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
    </el-main>
  </el-container>
</template>
<script>
import { mapState } from 'vuex'
import task from '@/api/task'
export default {
  props: {
    deliveryContentId: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      tableData: [],
      loadingFlag: false,
      dec: '',
      result: '1',
      history: []
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
      var fromData = new FormData()
      fromData.append('id', this.deliveryContentId)
      task.findMyTaskByDCId(fromData).then((result) => {
        this.$set(this, 'tableData', result.pdcdoc)
        this.$set(this, 'history', result.pdcho)
        this.$set(this, 'loadingFlag', false)
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
        type: 'doc',
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
</style>
