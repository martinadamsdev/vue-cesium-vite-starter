<template>
  <el-container>
    <el-main style="width:100%">
      <el-table :data="data" style="width: 100%" :row-class-name="getRowClass">
        <el-table-column type="expand">
          <template slot-scope="scope1">
            <el-table :data="scope1.row.pdmflist" class="drawer">
              <el-table-column prop="name">
              </el-table-column>
              <el-table-column prop="modelNo">
              </el-table-column>
              <el-table-column prop="type" width="50">
              </el-table-column>
              <el-table-column prop="createBy" width="70">
              </el-table-column>
              <el-table-column prop="categoryName" width="50">
              </el-table-column>
              <el-table-column prop="createTime">
              </el-table-column>
              <el-table-column prop="treeFolderName">
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button v-if="permisson.indexOf('modelAuditTask:browse') !== -1" type="text" @click="browseClick(scope.row)">浏览</el-button>
                  <el-button v-if="permisson.indexOf('modelAuditTask:delete') !== -1" type="text" @click.native="uploadClick(scope.row)">下载</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="装置/区域/系统/单元" prop="name"> </el-table-column>
        <el-table-column label="名称" prop="treeFolderName"> </el-table-column>
        <el-table-column label="类别">
          <template slot-scope="{row}">
            {{ row.category === '1'? '三维模型': 'P&ID'}}
          </template>
        </el-table-column>
        <el-table-column label="文件格式">
          <template slot-scope="{row}">
            {{ row.format === '1'? 'zip': row.format}}
          </template>
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
            <el-button v-if="permisson.indexOf('modelAuditTask:audit') !== -1" :disabled="scope.row.status === '3'" type="text" @click.native="okCick(scope.row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
import { mapState } from 'vuex'
import task from '@/api/task'
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
      permisson: state => state.permisson
    })
  },
  methods: {
    attrCollection(row, index) {
    },
    getRowClass(row, index) {
      if (row.row.pdmflist) {
        if (row.row.pdmflist.length === 0) {
          return 'row-expand-cover'
        }
      }
    },
    browseClick(row) {
      // 浏览
      console.log(row)
      task.previewDoc(row.attachmentId).then(res => {
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
      task.downloadDoc(row.attachmentId).then(res => {
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
      // 完成审核事件
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
