<!--
 * @Author: your name
 * @Date: 2021-01-25 14:26:51
 * @LastEditTime: 2021-03-18 15:36:09
 * @LastEditors: Please set LastEditors
 * @Description: 文档交付model
 * @FilePath: \web-5d\src\views\task-list\delivery-task\components\document-model.vue
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
          multiple
          :auto-upload="false"
          :accept="accept1"
        >
          <el-button type="primary">添加文档</el-button>
        </el-upload>
        <el-button @click.native="analysis">解析</el-button>
      </el-row>
      <el-row class="tab">
        <el-table ref="tab" :data="tableData" border style="width: 100%">
          <el-table-column prop="docNo" label="编码" width="180">
          </el-table-column>
          <el-table-column label="文档名称" width="180">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name" />
            </template>
          </el-table-column>
          <el-table-column prop="docType" label="文档类型" width="50"> </el-table-column>
          <el-table-column prop="area" label="区域/单元"> </el-table-column>
          <el-table-column prop="categoryName" label="所属分类"> </el-table-column>
          <el-table-column prop="professionName" label="专业"> </el-table-column>
          <el-table-column prop="associatedObject" label="关联对象"> </el-table-column>
          <el-table-column label="编码校验" width="180">
            <template slot-scope="scope">
              <el-select v-model="scope.row.reg" placeholder="请选择">
                <el-option
                  v-for="item in scope.row.codeReg"
                  :key="item.id"
                  :label="item.name"
                  :value="item.regular">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
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
  data() {
    return {
      fileType: 'doc', // 文件列表切换
      fileList: [], // 存放新增文件
      pdcddtoList: [], // 存放code编码之类
      tableData: [],
      regArry: [],
      accept1: '',
      docAcceptDto: [], // 质量审核规定列表
      docDeliveryDto: [], // 交付物规定文档列表
      docRuleDto: [] // 命名规则列表
    }
  },
  components: {
    RegS: RegS
  },
  created() {
    this.getRegByProjectId()
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
      if (this.accept === '无限制' || !(this.accept)) {
        this.$set(this, 'accept1', '.')
        return
      }
      var arry = this.accept.split(',')
      for (var i = 0; i < arry.length; i++) {
        accept += '.' + arry[i] + ','
      }
      accept = accept.substring(0, accept.length - 1)
      this.$set(this, 'accept1', accept)
    },
    getRegByProjectId() {
      // 根据项目id查找 对应正则
      var projectId = this.$store.state.userInfo.currentPro.projectId //
      task.findRegByProjectId(projectId).then(res => {
        this.regArry = res
      }).catch(err => {
        this.$message.error(err)
      })
    },
    addClick() {
      // 确定按钮 添加事件
      var fromData = new FormData()
      fromData.append('createBy', this.userInfo.realName)
      fromData.append('deliveryContentId', this.deliveryContentId)
      fromData.append('projectId', this.$store.state.userInfo.currentPro.projectId)
      fromData.append('md5', 'd')
      for (var i = 0; i < this.tableData.length; i++) {
        this.tableData[i].codeDocId = this.tableData[i].reg.name
        for (var j in this.tableData[i]) {
          fromData.append(`PDCDDtoList[${i}].${j}`, this.tableData[i][j])
        }
      }
      for (var k = 0; k < this.fileList.length; k++) {
        fromData.append('fileList', this.fileList[k])
      }
      task.addDY(fromData).then(res => {
        this.$message.success('添加交付完成！')
        this.close()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    analysis() {
      // 编码解析全部
      // this.tableData
      for (var i = 0; i < this.tableData.length; i++) {
        var reg = new RegExp(this.tableData[i].reg.split('/g')[0].slice(1))
        if (reg === '') {
          continue
        } else {
          let regRes = reg.test(this.tableData[i].docNo)
          var dom = this.$refs
          if (regRes) {
            dom.tab.$vnode.elm.getElementsByClassName('el-table__row')[0].style.background = 'white'
            this.$set(this.tableData[i], 'area', RegExp.$1)
            this.$set(this.tableData[i], 'categoryName', RegExp.$2)
            this.$set(this.tableData[i], 'professionName', RegExp.$3)
            this.$set(this.tableData[i], 'associatedObject', RegExp.$4)
          } else {
            dom.tab.$vnode.elm.getElementsByClassName('el-table__row')[i].style.background = 'red'
            this.$set(this.tableData[i], 'area', '')
            this.$set(this.tableData[i], 'categoryName', '')
            this.$set(this.tableData[i], 'professionName', '')
            this.$set(this.tableData[i], 'associatedObject', '')
          }
        }
      }
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
      // 设置默认pdcddtoList
      var obj = {
        // 尚未解析
        name: '',
        docType: row.name.split('.')[1],
        docNo: row.name.split('.')[0],
        area: '',
        categoryName: '',
        professionName: '',
        associatedObject: '',
        codeReg: [],
        reg: '',
        codeDocId: ''
      }
      if (obj.docNo.length > 50) {
        this.$message.error('上传文件名称不能超过50')
        return
      }
      this.fileList.push(row)
      this.analysisFIleOne(obj)
    },
    analysisFIleOne(obj) {
      var arr = this.regArry
      for (var i = 0; i < arr.length; i++) {
        if (!(arr[i].regular)) {
          continue
        }
        var tmp = arr[i].regular.split('/g').length === 1 ? arr[i].regular : arr[i].regular.split('/g')[0].slice(1)
        var reg = new RegExp(tmp)
        let regRes = reg.test(obj.docNo)
        if (regRes) {
          obj.area = RegExp.$1
          obj.categoryName = RegExp.$2
          obj.professionName = RegExp.$3
          obj.associatedObject = RegExp.$4
          obj.codeReg.push(arr[i])
          obj.reg = arr[i]
        } else {
          continue
        }
      }
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
