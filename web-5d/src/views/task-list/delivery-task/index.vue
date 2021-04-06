<!--
 * @Author: your name
 * @Date: 2021-01-21 16:33:11
 * @LastEditTime: 2021-02-04 14:09:06
 * @LastEditors: Please set LastEditors
 * @Description: 交付任务
 * @FilePath: \web-5d\src\views\task-list\my-task\index.vue
-->
<template>
<el-container class="warp">
  <el-header>
      <Header
        leftIconClass="el-icon-s-custom"
        leftTitle="交付任务"
        @leftClick="leftClick"
      />
  </el-header>
  <el-main>
    <el-row>
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="名称：">
          <el-input v-model="query.name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryClick">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="btns">
      <el-button @click="changeTable('document')">文档交付</el-button>
      <el-button @click="changeTable('model')">模型交付</el-button>
      <el-button @click="changeTable('dataModel')">数据交付</el-button>
    </el-row>
    <el-row v-loading="loadingFlag">
      <component :is="path" @open="openModel" :data="listData" @updataClick="openDiaUpdata" @deleteClick="deleteClick" @taskOk="taskOk"/>
    </el-row>
  </el-main>
  <el-dialog
    v-if="dialogVisible"
    :title="title"
    :visible.sync="dialogVisible"
    width="80%">
    <component :is="pathModel" :query="query" @close="dialogClose" :delivery-content-id="deliveryContentId"/>
  </el-dialog>
  <el-dialog
    v-if="dialogVisibleUp"
    title="编辑"
    :visible.sync="dialogVisibleUp"
    width="60%">
    <el-form>
      <el-form-item label="文件名称">
        <el-input v-model="updataFrom.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native="updataClick">确定</el-button>
        <el-button @click.native="dialogClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-footer>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="query.currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="query.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-footer>
</el-container>
</template>
<script>
import { mapState } from 'vuex'
import mytask from '@/api/task.js'
export default {
  name: 'task',
  components: {
    Header: () => import('@/components/header'),
    document: () => import('./components/document'),
    dataModel: () => import('./components/data'),
    model: () => import('./components/model'),
    documentModel: () => import('./components/document-model')
  },
  data() {
    return {
      dialogVisibleUp: false,
      deliveryContentId: '', // 交付id
      dialogVisible: false, // 对话框开关
      loadingFlag: false,
      query: { // 查询条件
        currentPage: 1,
        name: '',
        pageSize: 10,
        type: 'doc',
        userId: '',
        status: 1
      },
      updataFrom: {
        id: '',
        name: ''
      },
      total: 0,
      listData: [], // 不同类型展示不同数据
      path: 'document',
      pathModel: 'documentModel',
      title: '文档交付'
    }
  },
  computed: {
    ...mapState('userInfo', {
      userId: state => state.userInfo.userId
    })
  },
  created() {
    this.getDataTask()
  },
  methods: {
    taskOk(fromData) {
      // 完成交付
      fromData.userId = this.userId
      fromData.opinions = ''
      fromData.result = ''
      fromData.status = '1'
      fromData.taskType = ''
      fromData.userName = ''
      this.$confirm('确定完成交付？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        mytask.taskOk(fromData).then(() => {
          this.$message({
            type: 'success',
            message: '已确认交付'
          })
          this.getDataTask()
        }).catch(err => {
          this.$message.error(err.msg)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消确认交付'
        })
      })
    },
    deleteClick(row) {
      // 删除点击
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteSub(row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteSub(id) {
      mytask.deleteDD([id]).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getDataTask()
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.msg
        })
      })
    },
    openDiaUpdata(row) {
      this.$set(this.updataFrom, 'id', row.id)
      this.$set(this.updataFrom, 'name', row.name)
      this.dialogVisibleUp = true
    },
    updataClick() {
      // 确定修改按钮
      if (this.updataFrom.name) {
        mytask.updateDD(this.updataFrom).then(res => {
          this.$message.success('文件编辑成功！')
          this.dialogClose()
        }).catch(err => {
          this.$message.error(err.msg)
        })
      } else {
        this.$message.error('文件名不能为空！')
      }
    },
    getDataTask() {
      this.$set(this, 'loadingFlag', true)
      this.$set(this.query, 'userId', this.userId)
      mytask.findMyTaskByUserId(this.query).then((res) => {
        this.$set(this, 'loadingFlag', false)
        this.$set(this, 'listData', res.list)
        this.$set(this.query, 'currentPage', res.currentPage)
        this.$set(this.query, 'pageSize', res.pageSize)
        this.$set(this, 'total', res.total)
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    queryClick() {
      // 查询按钮
      this.getDataTask()
    },
    changeTable(path) {
      switch (path) {
        case 'document':
          this.$set(this, 'title', '文档交付')
          this.$set(this.query, 'type', 'doc')
          break
        case 'model':
          this.$set(this, 'title', '模型交付')
          this.$set(this.query, 'type', 'model')
          break
        case 'dataModel':
          this.$set(this, 'title', '数据交付')
          this.$set(this.query, 'type', 'data')
          break
      }
      this.$set(this, 'path', path)
      this.$set(this, 'pathModel', path + 'Model')
    },
    leftClick() {
      // 做相对应的操作
      console.log('做相对应的操作')
    },
    openModel(row) {
      this.deliveryContentId = row.id // 修改当前交付的id
      this.$set(this, 'dialogVisible', true) // 打开添加交付页面
    },
    handleSizeChange(num) {
      this.$set(this.query, 'pageSize', num)
      this.getDataTask()
    },
    handleCurrentChange(num) {
      this.$set(this.query, 'currentPage', num)
      this.getDataTask()
    },
    dialogClose() {
      this.getDataTask()
      this.dialogVisible = false
      this.dialogVisibleUp = false
    }
  }
}
</script>
<style scoped>
.btns{
  margin-bottom: 20px;
}
.warp {
  width: 100%;
  box-sizing: border-box;
  background: black;
  height: 100%;
}
.el-header {
  height: auto !important;
  padding: 0;
}
.el-main, .el-header, .el-footer {
  background: rgba(21, 24, 45, 0.9) !important;
}
.el-pagination{
  float: right;
  /*color: white !important;*/
}
</style>
