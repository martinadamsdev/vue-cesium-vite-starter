<!--
 * @Author: your name
 * @Date: 2021-01-25 14:26:51
 * @LastEditTime: 2021-02-02 15:39:51
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
          :auto-upload="false"
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
              <el-select v-model="scope.row.codeDocId" @change="codeRegChange(scope.row,scope.$index)" placeholder="请选择">
                <el-option
                  v-for="item in scope.row.codeReg"
                  :key="item.id"
                  :label="'文档编码校验' + item.id"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-main>
    <el-footer>
      <el-button @click.native="addClick">确定</el-button>
      <el-button @click.native="close()">取消</el-button>
    </el-footer>
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
      fileList: [], // 存放新增文件
      pdcddtoList: [], // 存放code编码之类
      tableData: []
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
    codeRegChange(row, index) {
      // 设置当前行数 数据的正则表达式
      let reg
      for (var i = 0; i < row.codeReg.length; i++) {
        reg = row.codeReg[i].id === row.codeDocId ? row.codeReg[i].regular : ''
      }
      this.$set(this.tableData[index], 'reg', reg)
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
      this.fileList.push(file.raw)
      this.uploadFile(file)
    },
    setTableData(obj) {
      this.tableData.push(obj)
    },
    uploadFile(obj) {
      // 上传文件
      // 发送请求拿到文件对应编码 对应编码效验
      // 设置默认pdcddtoList
      var fromData = new FormData()
      fromData.append('fileList', obj.raw)
      console.log(fromData)
      task.uploadFileFindFileCode(fromData).then(res => {
        console.log(res)
        var obj = {
          // 尚未解析
          name: '',
          docType: res[0].docType,
          docNo: res[0].docNo,
          area: '',
          categoryName: '',
          professionName: '',
          associatedObject: '',
          codeReg: res[0].regularList,
          reg: '',
          codeDocId: ''
        }
        this.setTableData(obj)
      }).catch(err => {
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
