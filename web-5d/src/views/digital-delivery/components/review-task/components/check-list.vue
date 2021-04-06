<template>
  <el-container>
    <el-main>
      <el-row class="tab">
        <el-table v-loading="loadingFlag" ref="tab" :data="tableData" style="width: 100%">
          <el-table-column prop="docNo" label="编码" width="180">
          </el-table-column>
          <el-table-column prop="name" label="文档名称" width="180">
          </el-table-column>
          <el-table-column prop="docType" label="文档类型" width="100"> </el-table-column>
          <el-table-column prop="area" label="区域/单元"> </el-table-column>
          <el-table-column prop="categoryName" label="所属分类"> </el-table-column>
          <el-table-column prop="professionName" label="专业"> </el-table-column>
          <el-table-column prop="associatedObject" label="关联对象"> </el-table-column>
          <el-table-column label="编码校验" width="180">
            <template slot-scope="scope">
              {{ scope.row.codeDocId }}
            </template>
          </el-table-column>
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
import RegS from './../../doc-regs'
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
      historyList: [],
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
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.$set(this, 'loadingFlag', true)
      var fromData = new FormData()
      fromData.append('id', this.deliveryContentId)
      task.findMyTaskByDCId(fromData).then((result) => {
        this.$set(this, 'tableData', result.pdcdoc)
        this.$set(this, 'historyList', result.pdcho)
        this.$set(this, 'loadingFlag', false)
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    accpetClick(flag) {
      // 审核点击事件 flag 通过or驳回
      console.log(this.desc)
      task.taskOk({
        id: this.deliveryContentId,
        opinions: `审核意见：${this.desc}`,
        result: this.result === '1' ? '审核通过' : '审核驳回',
        status: '2',
        taskType: this.result,
        type: 'doc',
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
