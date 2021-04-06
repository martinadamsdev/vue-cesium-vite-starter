<!--
 * @Author: your name
 * @Date: 2021-02-23 10:04:16
 * @LastEditTime: 2021-03-19 14:24:09
 * @LastEditors: Please set LastEditors
 * @Description: 模型交付model
 * @FilePath: \web-5d\src\views\digital-delivery\components\delivery-task\components\model-model.vue
-->
<template>
  <el-container>
    <el-main>
      <el-row>
        <el-upload
          class="upload-demo"
          ref="upload"
          action="#"
          :on-change="handlePreview"
          :file-list="fileList"
          :auto-upload="false"
          multiple
          :accept="accept1"
        >
          <el-button type="primary">添加模型</el-button>
        </el-upload>
      </el-row>
      <el-row class="tab">
        <el-table ref="tab" :data="tableData" border style="width: 100%">
          <el-table-column prop="docNo" label="编码">
          </el-table-column>
          <el-table-column label="模型名称">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name" />
            </template>
          </el-table-column>
          <el-table-column prop="docType" label="文件类型"> </el-table-column>
          <el-table-column prop="treeFolderName" label="区域/单元"> </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <RegS  :delivery-content-id="deliveryContentId"/>
      </el-row>
    </el-main>
    <el-footer>
      <el-button @click.native="addClick">确定</el-button>
      <el-button @click.native="close()">取消</el-button>
    </el-footer>
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
      fileList: [], // 存放新增文件
      pdcddtoList: [], // 存放code编码之类
      tableData: [],
      accept1: ''
    }
  },
  created() {
    this.setAccept()
  },
  computed: {
    ...mapState('userInfo', {
      userInfo: state => state.userInfo
    })
  },
  methods: {
    setAccept() {
      var accept = ''
      var arry = this.accept.split(',')
      for (var i = 0; i < arry.length; i++) {
        accept += '.' + arry[i] + ','
      }
      accept = accept.substring(0, accept.length - 1)
      this.$set(this, 'accept1', accept)
    },
    addClick() {
      // 确定按钮 添加事件
      var fromData = new FormData()
      fromData.append('createBy', this.userInfo.realName)
      fromData.append('deliveryContentId', this.deliveryContentId)
      fromData.append('projectId', this.$store.state.userInfo.currentPro.projectId)
      fromData.append('md5', 'd')
      for (var i = 0; i < this.tableData.length; i++) {
        for (var j in this.tableData[i]) {
          fromData.append(`PDMFDtoList[${i}].${j}`, this.tableData[i][j])
        }
      }
      for (var k = 0; k < this.fileList.length; k++) {
        fromData.append('fileList', this.fileList[k])
      }
      task.addModel(fromData).then(res => {
        this.$message.success('添加交付完成！')
        this.close()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    handlePreview(file) {
      // 上传文档
      this.fileList.push(file.raw)
      var docNo = file.name.split('.')[0]
      var docType = file.name.split('.')[1]
      var tableDataObj = {
        docNo: docNo,
        docType: docType,
        treeFolderName: '无'
      }
      if (tableDataObj.docNo.length > 50) {
        this.$message.error('上传文件名不能超过50')
        return
      }
      this.setTableData(tableDataObj)
    },
    setTableData(obj) {
      this.tableData.push(obj)
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
