<!--
 * @Author: your name
 * @Date: 2021-01-21 17:17:32
 * @LastEditTime: 2021-01-21 17:18:01
 * @LastEditors: Please set LastEditors
 * @Description: 属性补录
 * @FilePath: \web-5d\src\views\task-list\delivery-task\components\data.vue
-->
<template>
  <div class="conatiner">
    <el-header>
      <el-row>
        <el-col :span="24">
          <el-table :data="deliveryCon" style="width: 100%" :show-header="false">
            <el-table-column>
              <template>
                 交付内容 :
              </template>
            </el-table-column>
            <el-table-column prop="name"> </el-table-column>
            <el-table-column prop="treeFolderName"> </el-table-column>
            <el-table-column>
              <template slot-scope="{row}">
                {{ row.category === '1'? '三维模型': 'P&ID'}}
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="{row}">
                {{ row.format === '1'? 'zip': row.format}}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table :data="deliveryModel" :show-header="false">
              <el-table-column>
              <template>
                  交付模型 :
              </template>
            </el-table-column>
            <el-table-column prop="name" >
            </el-table-column>
            <el-table-column prop="modelNo">
            </el-table-column>
            <el-table-column prop="type" width="50">
            </el-table-column>
            <el-table-column prop="createBy" width="70">
            </el-table-column>
            <el-table-column prop="version" width="50">
            </el-table-column>
            <el-table-column prop="createTime">
            </el-table-column>
            <el-table-column prop="treeFolderName">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-header>
      <el-row class="btn">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="#"
          :on-change="handlePreview"
          :file-list="fileList"
          :auto-upload="false"
          :accept="accept1"
        >
          <el-button type="primary">添加文件</el-button>
        </el-upload>
        <!--<el-button type="primary">下载该模型属性数据模板</el-button>-->
      </el-row>
        <el-table ref="tab" :data="attrData" border>
          <el-table-column prop="docNo" label="文件名称"> </el-table-column>
          <el-table-column prop="docType" label="文件类型"> </el-table-column>
          <el-table-column prop="treeFolderName" label="状态"> </el-table-column>
          <el-table-column prop="treeFolderName" label="上传日期"> </el-table-column>
        </el-table>
    <el-footer>
      <el-button @click.native="addClick">确定</el-button>
      <el-button @click.native="close()">取消</el-button>
    </el-footer>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import task from '@/api/task'
export default {
  props: {
    attrItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    attrNode: {
      type: Object,
      default: () => {
        return {}
      }
    },
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
  data() {
    return {
      deliveryCon: [],
      deliveryModel: [],
      attrData: [],
      accept1: '',
      fileList: [] // 存放新增文件
    }
  },
  created() {
    this.deliveryCon.push(this.attrNode)
    this.deliveryModel.push(this.attrItem)
    this.setAccept()
  },
  computed: {
    ...mapState('userInfo', {
      userInfo: state => state.userInfo
    })
  },
  methods: {
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
      this.setTableData(tableDataObj)
    },
    setTableData(obj) {
      this.attrData.push(obj)
    },
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
      fromData.append('deliveryContentId', this.attrNode.id)
      fromData.append('projectId', this.$store.state.userInfo.currentPro.projectId)
      fromData.append('md5', 'd')
      for (var i = 0; i < this.attrData.length; i++) {
        for (var j in this.attrData[i]) {
          fromData.append(`PDMFDtoList[${i}].${j}`, this.attrData[i][j])
        }
      }
      for (var k = 0; k < this.fileList.length; k++) {
        fromData.append('fileList', this.fileList[k])
      }
      task.addModel(fromData).then(res => {
        this.$message.success('添加成功！')
        this.$emit('getDataTask')
        this.close()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.el-header {
  padding-left: 0;
  width: 100%;
}
.el-header .el-row{
  padding-left: 10px;
  line-height: 100%;
}
.el-col{
  font-size: 16px;
}
.el-row{
 line-height: 100%;
}
.upload-demo {
  display: inline-block;
  padding-bottom: 10px;
}
/deep/ .el-upload-list {
  display: none;
}
.btn{
  padding-top: 20px;
  float: right;
}
.el-footer{
  padding-top: 10px;
}
</style>
