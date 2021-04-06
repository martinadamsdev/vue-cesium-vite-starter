<!--
 * @Author: your name
 * @Date: 2021-01-21 16:32:36
 * @LastEditTime: 2021-02-25 09:36:35
 * @LastEditors: Please set LastEditors
 * @Description: 验收任务
 * @FilePath: \web-5d\src\views\task-list\acceptance-task\index.vue
-->
<template>
<el-container class="warp">
  <el-main>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="changeTable">
      <el-menu-item v-if="hasDoc" index="document">文档验收</el-menu-item>
      <el-menu-item v-if="hasModel" index="model">模型验收</el-menu-item>
      <el-submenu v-if="hasData" index="dataModel">
        <template slot="title">数据验收</template>
        <el-menu-item v-if="hasProperty" index="dataProperty">属性</el-menu-item>
        <el-menu-item v-if="hasMaterial" index="dataMaterials">材料</el-menu-item>
        <el-menu-item v-if="hasConstruct" index="dataCustom">自定义</el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="line">
      <el-row v-loading="loadingFlag">
        <component :is="path" @open="openModel" :data="listData" @updataClick="openDiaUpdata" @deleteClick="deleteClick" @taskOk="taskOk" @openHistory="openHistory"/>
      </el-row>
    </div>
    <!--<el-row class="btns">
      <el-button @click="changeTable('document')">文档验收</el-button>
      <el-button @click="changeTable('model')">模型验收</el-button>
      <el-button @click="changeTable('dataModel')">数据验收</el-button>
    </el-row>
    <el-row v-loading="loadingFlag">
      <component :is="path" @open="openModel" :data="listData" @updataClick="openDiaUpdata" @deleteClick="deleteClick" @taskOk="taskOk" @openHistory="openHistory"/>
    </el-row>-->
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
  <el-dialog
    v-if="dialogVisibleHistory"
    title="历史记录"
    :visible.sync="dialogVisibleHistory"
    width="80%">
    <historyModel :table-data="historyTableData"/>
  </el-dialog>
</el-container>
</template>
<script>
import { mapState } from 'vuex'
import mytask from '@/api/task.js'
export default {
  name: 'task',
  components: {
    historyModel: () => import('./../history'),
    Header: () => import('@/components/header'),
    document: () => import('./components/document'),
    model: () => import('./components/model'),
    modelModel: () => import('./components/model-model'),
    documentModel: () => import('./components/document-model'),
    dataProperty: () => import('./components/data'),
    dataPropertyModel: () => import('./components/data-model'),
    dataCustom: () => import('./components/data-custom'),
    dataMaterials: () => import('./components/data-materials'),
    firstPage: () => import('@/views/project-list')
  },
  data() {
    return {
      historyTableData: [],
      dialogVisibleHistory: false, // 历史记录弹框
      dialogVisibleUp: false,
      deliveryContentId: '', // 交付id
      dialogVisible: false, // 对话框开关
      loadingFlag: false,
      query: { // 查询条件
        currentPage: 1,
        name: '',
        pageSize: 10,
        dataType: 'property',
        projectId: this.$store.state.userInfo.currentPro.projectId,
        type: 'doc',
        userId: '',
        status: '3'
      },
      updataFrom: {
        id: '',
        name: ''
      },
      activeIndex: 'document',
      total: 0,
      listData: [], // 不同类型展示不同数据
      path: 'document',
      pathModel: 'documentModel',
      title: '文档交付验收'
    }
  },
  computed: {
    ...mapState('userInfo', {
      userId: state => state.userInfo.userId,
      permission: state => state.permission
    }),
    hasDoc() {
      if (this.permission.indexOf('acceptanceTask:docAcceptance') !== -1) {
        return true
      }
      return false
    },
    hasModel() {
      if (this.permission.indexOf('acceptanceTask:modelAcceptance') !== -1) {
        return true
      }
      return false
    },
    hasData() {
      if (this.permission.indexOf('acceptanceTask:dataAcceptance') !== -1) {
        return true
      }
      return false
    },
    hasProperty() {
      if (this.permission.indexOf('dataAcceptance:propertyAcceptance') !== -1) {
        return true
      }
      return false
    },
    hasMaterial() {
      if (this.permission.indexOf('dataAcceptance:materialAcceptance') !== -1) {
        return true
      }
      return false
    },
    hasConstruct() {
      if (this.permission.indexOf('dataAcceptance:constructionAcceptance') !== -1) {
        return true
      }
      return false
    }
  },
  created() {
    this.getDataTask()
  },
  methods: {
    taskOk(fromData) {
      // 完成交付
      fromData.userId = this.userId
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
      }).catch(() => {})
    },
    deleteClick(row) {
      // 删除点击
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteSub(row.id)
      }).catch(() => {})
    },
    deleteSub(id) {
      mytask.deleteDD([id]).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getDataTask()
      }).catch(() => {})
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
        console.log(res)
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
          this.$set(this, 'title', '文档交付验收')
          this.$set(this.query, 'type', 'doc')
          break
        case 'model':
          this.$set(this, 'title', '模型交付验收')
          this.$set(this.query, 'type', 'model')
          break
        case 'dataProperty':
          this.$set(this, 'title', '数据验收-属性')
          this.$set(this.query, 'type', 'data')
          this.$set(this.query, 'dataType', 'property')
          break
        case 'firstPage':
          break
      }
      this.$set(this, 'path', path)
      this.$set(this, 'pathModel', path + 'Model')
      this.$set(this.query, 'currentPage', 1)
      this.$set(this.query, 'pageSize', 10)
      this.getDataTask()
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
    },
    openHistory(row) {
      mytask.findHistoryById(row).then(res => {
        this.$set(this, 'historyTableData', res)
        this.$set(this, 'dialogVisibleHistory', true)
      }).catch(err => {
        this.$message.error(err.msg)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.btns{
  margin-bottom: 20px;
}
.warp {
  width: 100%;
  box-sizing: border-box;
  height: 100%;
}
.el-header {
  height: auto !important;
  padding: 0;
}
.el-pagination{
  float: right;
  // color: white !important;
}
</style>
