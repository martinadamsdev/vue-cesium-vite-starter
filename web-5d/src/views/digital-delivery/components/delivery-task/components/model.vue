<!--
 * @Author: your name
 * @Date: 2021-01-21 17:17:26
 * @LastEditTime: 2021-03-18 15:42:54
 * @LastEditors: Please set LastEditors
 * @Description: 模型交付
 * @FilePath: \web-5d\src\views\task-list\delivery-task\components\model.vue
-->
<template>
  <el-container>
    <el-main style="width:100%">
      <el-table :data="data" style="width: 100%" :row-class-name="getRowClass">
        <el-table-column type="expand">
          <template slot-scope="scope1">
            <el-table :data="scope1.row.pdmflist" :default-expand-all="false" class="drawer">
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
              <el-table-column>
                <template slot-scope="scope">
                  <el-button type="text" @click.native="attrClick(scope1.row, scope.row)">属性补录</el-button>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button v-if="permission.indexOf('modelDeliveryTask:browse') !== -1" type="text" @click.native="browseClick(scope.row)">浏览</el-button>
                  <el-button v-if="permission.indexOf('modelDeliveryTask:download') !== -1" type="text" @click.native="uploadClick(scope.row)">下载</el-button>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button v-if="permission.indexOf('modelDeliveryTask:update') !== -1" :disabled="scope1.row.status === '2'" type="text" @click.native="updateClick(scope.row)">编辑</el-button>
                  <el-button v-if="permission.indexOf('modelDeliveryTask:delete') !== -1" :disabled="scope1.row.status === '2'" type="text" @click.native="deleteClick(scope.row)">删除</el-button>
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
            <el-button v-if="permission.indexOf('modelDeliveryTask:fulfilDelivery') !== -1" :disabled="scope.row.status === '2'" type="text" @click.native="okCick(scope.row)">完成交付</el-button>
            <el-button v-if="permission.indexOf('modelDeliveryTask:Delivery') !== -1" :disabled="scope.row.status === '2'" type="text" @click.native="addDocumentClick(scope.row)">交付</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
     <div v-if="dialogVisibleAttr">
      <el-dialog
        v-if="dialogVisibleAttr"
        title="属性补录"
        :visible.sync="dialogVisibleAttr"
        width="80%">
      <attrModel
        :attr-node="attrNode"
        :attr-item="attrItem"
        :delivery-content-id="deliveryContentId"
        @close="close"
        @getDataTask="getDataTask"
      />
    </el-dialog>
  </div>
  </el-container>
</template>
<script>
import mytask from '@/api/task.js'
import file from '@/api/file'
import { mapState } from 'vuex'
export default {
  name: 'model',
  components: {
    attrModel: () => import('./attr-collection')
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    deliveryContentId: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      dialogVisibleAttr: false,
      attrNode: {},
      attrItem: {},
      query: { // 查询条件
        dataType: '',
        currentPage: 1,
        name: '',
        pageSize: 10,
        type: 'model',
        userId: '',
        projectId: '',
        status: '1'
      },
      total: ''
    }
  },
  created() {
    this.query.projectId = this.currentPro.projectId
    this.getDataTask()
  },
  computed: {
    ...mapState('userInfo', {
      userId: state => state.userInfo.userId,
      currentPro: state => state.currentPro
    })
  },
  methods: {
    getDataTask() {
      this.$set(this.query, 'userId', this.userId)
      mytask.findMyTaskByUserId(this.query).then((res) => {
        this.$set(this, 'attrItem', res.list)
        this.$set(this.query, 'currentPage', res.currentPage)
        this.$set(this.query, 'pageSize', res.pageSize)
        this.$set(this, 'total', res.total)
      }).catch((err) => {
        this.$message.error(err)
      })
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
      if (row.row.pdmflist) {
        if (row.row.pdmflist.length === 0) {
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
        type: 'model',
        id: row.id
      }
      this.$emit('taskOk', fromData)
    },
    addDocumentClick(row) {
      // 交付时添加文档
      row.type = 'model'
      row.docTypes = row.format === '1' ? '.zip' : row.format
      this.$emit('open', row)
    },
    openHistory(row) {
      var query = {
        id: row.id,
        type: 'model'
      }
      this.$emit('openHistory', query)
    },
    attrClick(node, item) {
      this.attrNode = node
      this.attrItem = item
      this.dialogVisibleAttr = true
    },
    close() {
      this.dialogVisibleAttr = false
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
