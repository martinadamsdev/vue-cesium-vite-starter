<!--
 * @Author: your name
 * @Date: 2021-03-17 09:51:54
 * @LastEditTime: 2021-03-17 10:30:23
 * @LastEditors: Please set LastEditors
 * @Description: 属性交付Model
 * @FilePath: \web-5d\src\views\digital-delivery\components\delivery-task\components\data-property-model.vue
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
          accept=".xls,.xlsx"
        >
          <el-button type="primary">添加文档</el-button>
        </el-upload>
        <el-button @click.native="analysis">模板下载</el-button>
      </el-row>
      <el-row class="tab">
        <el-table ref="tab" :data="tableData" border style="width: 100%">
          <el-table-column prop="docNo" label="编码">
          </el-table-column>
          <el-table-column label="文档名称">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name" />
            </template>
          </el-table-column>
          <el-table-column prop="docType" label="文档类型"> </el-table-column>
          <el-table-column prop="data" label="上传日期"> </el-table-column>
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
    }
  },
  components: {
    RegS: RegS
  },
  data() {
    return {
      fileList: [], // 存放新增文件
      PDPFDtoList: [], // 存放code编码之类
      tableData: [],
      regArry: []
    }
  },
  computed: {
    ...mapState('userInfo', {
      userInfo: state => state.userInfo
    })
  },
  methods: {
    addClick() {
      // 确定按钮 添加事件
      var fromData = new FormData()
      fromData.append('createBy', this.userInfo.realName)
      fromData.append('deliveryContentId', this.deliveryContentId)
      fromData.append('projectId', this.$store.state.userInfo.currentPro.projectId)
      fromData.append('md5', 'd')
      for (var i = 0; i < this.tableData.length; i++) {
        for (var j in this.tableData[i]) {
          fromData.append(`PDPFDtoList[${i}].${j}`, this.tableData[i][j])
        }
      }
      for (var k = 0; k < this.fileList.length; k++) {
        fromData.append('fileList', this.fileList[k])
      }
      task.addProtypeData(fromData).then(res => {
        this.$message.success('添加交付完成！')
        this.close()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    handlePreview(file) {
      // 上传文档
      this.setFlieData(file.raw)
    },
    setTableData(obj) {
      this.tableData.push(obj)
    },
    setFlieData(row) {
      // 上传文件
      // 文件对应编码 对应编码效验
      // 设置默认PDPFDtoList
      var obj = {
        // 尚未解析
        name: '',
        docType: row.name.split('.')[1],
        docNo: row.name.split('.')[0],
        data: row.lastModifiedDate.getFullYear() + '-' + (row.lastModifiedDate.getMonth() + 1) + '-' + row.lastModifiedDate.getDate() + ' ' + row.lastModifiedDate.getHours() + ':' + row.lastModifiedDate.getMinutes() + ':' + row.lastModifiedDate.getSeconds()
      }
      if (obj.docNo.length > 50) {
        this.$message.error('文件名不能超过50')
        return
      }
      this.fileList.push(row)
      this.setTableData(obj)
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
