<template>
  <el-container>
    <el-header>
      <el-form :inline="true" ref="form" :model="form" class="laberItem">
        <el-form-item label="文件名">
          <el-input
            v-model="uploadName"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp"
            placeholder="请输入文件名">
          </el-input>
         </el-form-item>
        <el-form-item label="文件类型">
           <el-select v-model="uploadType" clearable placeholder="请选择">
            <el-option
              v-for="item in uploadTypeList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传时间">
          <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-row class="btns">
        <el-upload
          style="marginRight:18px"
          class="upload-excel"
          action="string"
          :show-file-list="false"
          :on-change="handleChange"
          :http-request="getFile">
          <el-button type="primary" size="small">上传文件</el-button>
        </el-upload>
        <!--<el-button
          size="small"
          type="primary"
        @click="uploadFiles()"
          >上传文件</el-button>-->
        <el-button
          size="small"
          type="danger"
        @click="deleteFiles"
          >批量删除</el-button>
    </el-row>
    <el-row class="table">
        <el-table
          stripe
          border
          ref="multipleTable"
          :data="centerDataList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="name"
                  header-align="left"
                  label="文件名"
                >
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  header-align="left"
                  label="上传时间"
                >
                </el-table-column>
                <el-table-column
                  prop="type"
                  header-align="left"
                  label="文件类型"
                >
                </el-table-column>
                <el-table-column
                  prop="createBy"
                  header-align="left"
                  label="上传人"
                >
                </el-table-column>
                <el-table-column header-align="center" align="center" label="操作" width="240">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="mini"
                      @click="filePreview(scope.$index, scope.row)"
                      >预览</el-button
                    >
                    <!-- <el-button size="mini" @click="fileEdit(scope.$index, scope.row)"
                      >编辑</el-button
                    > -->
                    <el-button
                      type="text"
                      size="mini"
                      @click="fileDownload(scope.$index, scope.row)"
                      >下载</el-button
                    >
                    <el-button
                      type="text"
                      size="mini"
                      @click="fileDelete(scope.$index, scope.row)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="numTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </el-row>
    </el-main>
    <!--<el-dialog title="文件上传" center :visible.sync="uploadVisible" width="50%" :close="handlerClose">
        <UploadBigFile class="uploadSlot"></UploadBigFile>
    </el-dialog>-->
  </el-container>
</template>
<script>
import file from '@/api/file'
import Blob from 'blob'
import SparkMD5 from 'spark-md5'
import { mapState } from 'vuex'
import { dateFormat, loading, loadingClose } from '@/utils/index'
export default {
  name: 'project-conter',
  props: ['centerData', 'changeData', 'total'],
  data() {
    return {
      form: {
        name: ''
      },
      sparkEnd: '',
      uploadVisible: false,
      value1: '',
      uploadType: '',
      uploadName: '',
      centerDataList: [],
      numTotal: 0,
      uploadTypeList: file.uploadTypeList.getAll(),
      // fileList: [],
      multipleSelection: [],
      currentPage: 1, // 初始页
      pageSize: 10 // 每页的数据
    }
  },
  created() {
  },
  watch: {
    centerData: {
      handler(newVal, oldVal) {
        this.centerDataList = newVal
      }
    },
    total: {
      handler(newVal, oldVal) {
        this.numTotal = newVal
      }
    }
  },
  computed: {
    ...mapState('userInfo', {
      currentPro: state => state.currentPro,
      userName: state => state.userInfo.realName
    })
  },
  methods: {
    // handlerClose() {
    // this.$set(this.query, 'pageIndex', 1)
    // this.getData()
    // },
    // uploadFiles() {
    //  this.uploadVisible = true
    // },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pageSize = size// 每页下拉显示数据
      this.$emit('getPageSize', this.pageSize)
      console.log(this.pageSize)
      this.getExcalList()
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage// 点击第几页
      this.getExcalList()
    //  this.$emit('currentPage', this.currentPage)
    },
    // 获取当前文件夹下的所有文件
    getExcalList() {
      file.getChildrenList({
        'projectId': this.currentPro.projectId,
        'folderId': this.changeData.folderId,
        'currentPage': this.currentPage,
        'pageSize': this.pageSize
      }).then(res => {
        // this.$emit('changeCenterData', this.centerData)
        this.$set(this, 'numTotal', res.total)
        this.$set(this, 'centerDataList', res.list)
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.msg
        })
      })
    },
    handleChange(file) {
      const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      const fileReader = new FileReader()
      const chunkSize = 2097152
      const chunks = Math.ceil(file.size / chunkSize)
      let currentChunk = 0
      const spark = new SparkMD5.ArrayBuffer()
      var that = this
      fileReader.onload = function(e) {
        spark.append(e.target.result)
        currentChunk++
        if (currentChunk < chunks) {
          loadNext()
        } else {
          that.sparkEnd = spark.end()
        }
      }
      fileReader.onerror = function() {
        console.warn('FileReader error.')
      }
      function loadNext() {
        const start = currentChunk * chunkSize
        const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
        // 注意这里的 fileRaw
        fileReader.readAsArrayBuffer(blobSlice.call(file.raw, start, end))
      }
      loadNext()
    },
    // 覆盖默认上传行为
    getFile(uploadFile) {
      console.log(this.changeData.folderId)
      if (this.changeData.folderId !== undefined) {
        loading()
        var params = new FormData()
        params.append('createBy', this.userName)
        params.append('folderId', this.changeData.folderId)
        params.append('file', uploadFile.file)
        params.append('parentId', this.changeData.parentId)
        params.append('projectId', this.currentPro.projectId)
        params.append('date', new Date())
        params.append('md5', this.sparkEnd)
        file.uploadExcel(params).then(res => {
          this.getExcalList()
          loadingClose()
        }).catch(err => {
          console.log(err)
          loadingClose()
          this.$message({
            type: 'error',
            message: err.msg
          })
        })
      }
    },
    query() {
      if (this.value1.length === 0) {
        this.startTime = ''
        this.endTime = ''
      } else {
        this.startTime = dateFormat(this.value1[0])
        this.endTime = dateFormat(this.value1[1])
      }
      console.log(this.currentPage)
      file.selectCerterList({
        'folderId': this.changeData.folderId,
        'projectId': this.currentPro.projectId,
        'currentPage': this.currentPage,
        'name': this.uploadName,
        'pageSize': this.pageSize,
        'type': this.uploadType,
        'startTime': this.startTime,
        'endTime': this.endTime
      }).then(res => {
        this.$set(this, 'numTotal', res.total)
        this.$set(this, 'centerDataList', res.list)
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.msg
        })
      })
      // 条件查询按钮
    },
    filePreview(index, row) {
      // 文件预览
      file.previewExcal(row.attachmentId).then(res => {
        window.open(`http://${res}`, '_blank')
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.msg
        })
      })
    },
    // fileEdit(index, row) {
    //   // 文件编辑
    //   console.log(row, index)
    //   this.$emit('upDialogMask', true)
    //   file.getEditFile({
    //     'attachmentId': '2',
    //     'name': 'wenjian1',
    //     'url': '/src'
    //   }).then(res => {

    //   })
    // },
    fileDownload(index, row) {
      // 文件下载
      file.downloadExcel(row.attachmentId).then(res => {
        let url = URL.createObjectURL(new Blob([res]), {type: 'application/json'})
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.download = row.name
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(link.href)
        document.body.removeChild(link)
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.msg
        })
      })
    },
    fileDelete($index, row) {
      // 文件删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        file.deleteExcal(row.attachmentId).then(res => {
          if (res.code === 200) {
            this.getExcalList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteFiles() {
      // 批量删除文件
      let ids = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].attachmentId)
      }
      if (ids.length) {
        file.deleteExcalNum(ids).then(res => {
          if (res.code === 200) {
            this.getExcalList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err.msg
          })
        })
      }
    },
    handleSelectionChange(val) {
      // 手动点击选择列表行
      this.multipleSelection = val
    }
  },
  components: {
    UploadBigFile: () => import('./upload')
  }
}
</script>
<style lang="less" scoped>
.el-header {
  background: rgba(21, 24, 45, 0.9);
  height: auto !important;
  border-radius: 4px;
}
.el-main {
  padding: 20px 0 0 0;
}
.table {
  padding-top: 20px;
}
.btns{
  display: flex;
  flex-direction: row;
}
.btns .el-button {
  font-size: 14px;
}
.cell .el-button {
  font-size: 14px;
}
.el-form {
  padding: 20px 0;
}
.el-form-item {
  margin-bottom: 0px
}
.el-pagination {
  float: right;
  // color: #fff !important;
}
.el-pagination__total{
    color:#fff;
}
.el-pager{
    color:#303133 !important;
}
//.uploader {
//    border-radius: 3px;
//}
.uploader-drop{
    background-color: #409EFF;
    border: none;
    border-radius: 3px;
    margin-right: 18px;
    padding: 0 2px;
}
.uploader-btn{
    border: none;
    font-size: 14px;
    color: #fff;
    padding: 9px 16px;
    border-radius: 3px;
    font-weight: 500;
}
.uploader-ui .uploader-list {
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
}
.el-dialog{
    width: 50%;
}

</style>
