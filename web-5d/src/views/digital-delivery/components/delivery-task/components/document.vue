<!--
 * @Author: your name
 * @Date: 2021-01-21 17:17:19
 * @LastEditTime: 2021-03-18 15:03:55
 * @LastEditors: Please set LastEditors
 * @Description: 文档交付
 * @FilePath: \web-5d\src\views\task-list\delivery-task\components\document.vue
-->
<template>
  <el-container>
    <el-main style="width:100%">
      <el-table :data="data" style="width: 100%" :row-class-name="getRowClass">
        <el-table-column type="expand">
          <template slot-scope="scope1">
            <el-table :data="scope1.row.pdcdoc" :default-expand-all="true" class="drawer">
              <el-table-column prop="docNo" label="编码" width="250">
              </el-table-column>
              <el-table-column prop="name" label="文档名称">
              </el-table-column>
              <el-table-column prop="docType" label="文档类型">
              </el-table-column>
              <el-table-column prop="area" label="区域/单元">
              </el-table-column>
              <el-table-column prop="categoryName" label="所属分类">
              </el-table-column>
              <el-table-column prop="professionName" label="专业">
              </el-table-column>
              <el-table-column prop="associatedObject" label="关联对象">
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button v-if="permission.indexOf('docDeliveryTask:browse') !== -1" type="text" @click.native="browseClick(scope.row)">浏览</el-button>
                  <el-button v-if="permission.indexOf('docDeliveryTask:download') !== -1" type="text" @click.native="uploadClick(scope.row)">下载</el-button>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button v-if="permission.indexOf('docDeliveryTask:update') !== -1" :disabled="scope1.row.status === '2'" type="text" @click.native="updateClick(scope.row)">编辑</el-button>
                  <el-button v-if="permission.indexOf('docDeliveryTask:delete') !== -1" :disabled="scope1.row.status === '2'" type="text" @click.native="deleteClick(scope.row)">删除</el-button>
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
            <el-button v-if="permission.indexOf('docDeliveryTask:fulfilDelivery') !== -1" :disabled="scope.row.status === '2'" type="text" @click.native="okCick(scope.row)">完成交付</el-button>
            <el-button v-if="permission.indexOf('docDeliveryTask:Delivery') !== -1" :disabled="scope.row.status === '2'" type="text" @click.native="addDocumentClick(scope.row)">交付</el-button>
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
    getRowClass(row, index) {
      if (row.row.pdcdoc) {
        if (row.row.pdcdoc.length === 0) {
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
      // 完成交付事件
      var fromData = {
        type: 'doc',
        id: row.id
      }
      this.$emit('taskOk', fromData)
    },
    addDocumentClick(row) {
      // 交付时添加文档
      row.type = 'doc'
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
