<!--
 * @Author: your name
 * @Date: 2021-01-21 17:17:32
 * @LastEditTime: 2021-03-19 14:02:17
 * @LastEditors: Please set LastEditors
 * @Description: 数据审核-属性
 * @FilePath: \web-5d\src\views\task-list\delivery-task\components\data.vue
-->
<template>
  <el-container>
    <el-main style="width:100%">
      <el-table :data="data" style="width: 100%" :row-class-name="getRowClass">
        <el-table-column type="expand">
          <template slot-scope="scope1">
            <el-table :data="scope1.row.pdpflist" :default-expand-all="true" class="drawer">
              <el-table-column prop="name" >
              </el-table-column>
              <el-table-column prop="fileNo">
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
              <el-table-column>
                <template slot-scope="scope">
                  <el-button v-if="permission.indexOf('propertyAuditTask:browse') !== -1" type="text" @click.native="browseClick(scope.row)">浏览</el-button>
                  <el-button v-if="permission.indexOf('propertyAuditTask:download') !== -1" type="text" @click.native="uploadClick(scope.row)">下载</el-button>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button :disabled="scope1.row.status === '2'" type="text" @click.native="updateClick(scope.row)">编辑</el-button>
                  <el-button :disabled="scope1.row.status === '2'" type="text" @click.native="deleteClick(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name"> </el-table-column>
        <el-table-column label="交付范围" prop="treeFolderName"> </el-table-column>
        <el-table-column label="属性类别">
          <template slot-scope="{row}">
            {{ row.category === '1'? '三维模型': 'P&ID'}}
          </template>
        </el-table-column>
        <el-table-column label="模板">
          <el-button type="text">模板下载</el-button>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-button type="text" @click.native="openHistory(scope.row)">
              {{ scope.row.status === '1'? '待交付' : scope.row.status === '2'? '待审核' :scope.row.status === '3'? '待验收': '验收完成'}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="permission.indexOf('propertyAuditTask:audit') !== -1" :disabled="scope.row.status === '3'" type="text" @click.native="okCick(scope.row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
import { mapState } from 'vuex'
import file from '@/api/file'
export default {
  name: 'model',
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState('userInfo', {
      userInfo: state => state.userInfo
    })
  },
  methods: {
    browseClick(row) {
      // 浏览
      file.previewExcal(row.attachmentId).then(res => {
        window.open(`http://${res}`, '_blank')
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.msg
        })
      })
    },
    uploadClick(row) {
      // 下载
      file.downloadExcel(row.attachmentId).then(res => {
        let url = window.URL.createObjectURL(new Blob([res], {type: 'arraybuffer'}))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        var name = row.name || row.fileNo
        link.setAttribute('download', name + '.' + row.type)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.msg
        })
      })
    },
    getRowClass(row, index) {
      if (row.row.pdpflist) {
        if (row.row.pdpflist.length === 0) {
          return 'row-expand-cover'
        }
      }
    },
    updateClick(row) {
      // 编辑当前文件名称事件
      this.$emit('updataClick', row)
    },
    deleteClick(row) {
      // 删除当前文件事件
      this.$emit('deleteClick', row)
    },
    okCick(row) {
      // 打开审核
      row.type = 'data'
      this.$emit('open', row)
    },
    addDocumentClick(row) {
      // 交付时添加文档
      row.type = 'model'
      this.$emit('open', row)
    },
    openHistory(row) {
      var query = {
        id: row.id,
        type: 'model'
      }
      this.$emit('openHistory', query)
    }
  }
}
</script>
<style lang="less" scoped>
.el-main {
  padding: 0;
}
.drawer{
  width: 96%;
  margin-left: 4%;
}
.drawer /deep/ td {
  padding: 0;
}
.drawer /deep/ .el-table__header-wrapper{
  display: none;
}
/deep/ .el-table .row-expand-cover .cell .el-table__expand-icon {
  display: none;
}
</style>
