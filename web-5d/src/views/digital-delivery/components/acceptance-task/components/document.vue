<!--
 * @Author: your name
 * @Date: 2021-01-21 17:17:19
 * @LastEditTime: 2021-03-18 15:06:07
 * @LastEditors: Please set LastEditors
 * @Description: 文档验收
 * @FilePath: \web-5d\src\views\task-list\delivery-task\components\document.vue
-->
<template>
  <el-container>
    <el-main style="width:100%">
      <el-table :data="data" style="width: 100%" :row-class-name="getRowClass">
        <el-table-column type="expand">
          <template slot-scope="scope1">
            <el-table :data="scope1.row.pdcdoc" class="drawer">
              <el-table-column prop="docNo" width="250">
              </el-table-column>
              <el-table-column prop="name">
              </el-table-column>
              <el-table-column prop="docType">
              </el-table-column>
              <el-table-column prop="area">
              </el-table-column>
              <el-table-column prop="categoryName">
              </el-table-column>
              <el-table-column prop="professionName">
              </el-table-column>
              <el-table-column prop="associatedObject">
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button v-if="permission.indexOf('docAcceptance:browse') !== -1" type="text" @click.native="browseClick(scope.row)">浏览</el-button>
                  <el-button v-if="permission.indexOf('docAcceptance:download') !== -1" type="text" @click.native="uploadClick(scope.row)">下载</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name"> </el-table-column>
        <el-table-column label="编码" prop="contentNo"> </el-table-column>
        <el-table-column label="文件格式" prop="docTypes"> </el-table-column>
        <el-table-column label="类别" prop="categoryId"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-button type="text" @click.native="openHistory(scope.row)">
              {{ scope.row.status === '1'? '待交付' : scope.row.status === '2'? '待审核' :scope.row.status === '3'? '待验收': '验收完成'}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="permission.indexOf('docAcceptance:acceptance') !== -1" :disabled="scope.row.status === '2'" type="text" @click.native="okCick(scope.row)">验收</el-button>
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
  name: 'document',
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
      permission: state => state.permission
    })
  },
  methods: {
    getRowClass(row, index) {
      if (row.row.pdcdoc) {
        if (row.row.pdcdoc.length === 0) {
          return 'row-expand-cover'
        }
      }
    },
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
        var name = row.name || row.docNo
        link.setAttribute('download', name + '.' + row.docType)
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
    okCick(row) {
      // 完成验收事件
      this.$emit('open', row)
    },
    openHistory(row) {
      var query = {
        id: row.id,
        type: 'doc'
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
