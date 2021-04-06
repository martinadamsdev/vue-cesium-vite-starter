<template>
  <el-container :style="{backgroundImage: 'url('+bgUrl+')',backgroundPosition: 'center'}">
    <el-header class="header">
      <!-- <Header v-on:projectId="getProjectId"/> -->
      <Header />
    </el-header>
    <el-container>
      <el-aside>
        <el-container class="nav-aside">
          <el-header>
            <el-input
              style="width:92%"
              size="medium"
              placeholder="请输入关键字"
              v-model="filterVal"
            >
            </el-input
          ></el-header>
          <div class="btns">
            <el-button type="primary" size="mini" @click="append">新增</el-button>
            <el-button size="mini" @click="editMenu">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteMenuList">删除</el-button>
          </div>
          <el-main>
            <el-tree
              class="filter-tree"
              :data="data"
              node-key="id"
              :props="defaultProps"
              default-expand-all
              :filter-node-method="filterNode"
              :expand-on-click-node="false"
              :render-content="renderContent"
              ref="tree"
            >
              <template slot-scope="scope">
                <el-input placeholder="请输入内容" v-show="true" v-model="scope.row.laber"></el-input>
                <span v-show="!scope.row.show">{{scope.row.label}}</span>
              </template>
            </el-tree>
          </el-main>
      </el-container>
      </el-aside>
      <el-main class="conter">
        <Conter @upDialogMask="upDialogMask"
                @getPageSize="getPageSize"
                :centerData="centerData"
                :changeData="changeData"
                :total="total"
                :currentPage="getCurrentPage"/>
      </el-main>
    </el-container>
    <el-dialog title="编辑" :visible.sync="documentEditMask">
        <DEMask @upDialogMask="upDialogMask" />
    </el-dialog>
  </el-container>
</template>
<script>
import file from '@/api/file'
import { mapState } from 'vuex'
import { loading, loadingClose } from '@/utils/index'
export default {
  name: 'ProjectDetail',
  data() {
    return {
      documentEditMask: false,
      isEdit: false,
      data: [],
      total: 0,
      changeData: {},
      folderId: '',
      filterVal: '',
      edit_name: '',
      delDialogVisible: false,
      select_id: null,
      count: 1,
      projectId: '',
      pageSize: 10,
      currentPage: 1,
      centerData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      bgUrl: require('@/assets/bg.png')
    }
  },
  components: {
    Header: () => import('@/components/common-header'),
    Conter: () => import('./components/project-conter'),
    DEMask: () => import('./components/document-edit')
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapState('userInfo', {
      currentPro: state => state.currentPro,
      userName: state => state.userInfo.realName
    })
    // ,
    // projectId() {
    //  return this.$store.state.userInfo.currentPro.projectId
    // }
  },
  watch: {
    filterVal(value) {
      this.$refs.tree.filter(value.trim())
    },
    projectId() {
      this.getList()
      this.folderId = ''
      this.centerData = []
    },
    deep: true

    // ,
    // projectId(newVal, oldVal) {
    //  this.getList()
    // }
  },
  methods: {
    // changeCenterData(centerListData) {
    //   this.changeData = centerListData
    // },
    getCurrentPage(value) {
      this.currentPage = value
    },
    getPageSize(pageSize) {
      this.pageSize = pageSize
    },
    deleteMenuList() {
      console.log(this.folderId)
      if (this.folderId === '') {
        this.changeData.folderId = this.data[0].folderId
      }
      console.log(this.changeData)
      if (this.changeData.parentId === '0') {
        this.$message({
          type: 'error',
          message: '不支持删除!'
        })
      } else {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          file.deleteMenuList({
            'folderId': this.changeData.folderId,
            'projectId': this.currentPro.projectId
          }).then(res => {
            if (res.code === 200) {
              this.delDialogVisible = false
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    filterText() {
      // debugger
    },
    getProjectId(value) {
      this.projectId = value
      console.log(this.projectId)
    },
    getList() {
      file.getMenulist(this.currentPro.projectId).then(res => {
        this.$set(this, 'data', res)
      })
    //  .catch(err => {
    //      console.log(err)
    //    this.$message({
    //      type: 'error',
    //      message: err.msg
    //    })
    //  })
    },
    upDialogMask(flag) {
      this.documentEditMask = flag
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    append() {
      if (this.folderId === '' || this.folderId === undefined) {
        if (this.data) {
          console.log(this.changeData.length)
          if (this.changeData.length === undefined) {
            this.folderId = 0
          } else {
            this.folderId = this.changeData.folderId
          }
        } else {
          this.folderId = 0
        }
      } else if (this.folderId === 0 && this.data) {
        this.folderId = this.changeData.folderId
      }
      this.$prompt('文件夹名称', '新增', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        file.addMenuList({
          'createBy': this.userName,
          'name': value,
          'parentId': this.folderId,
          'projectId': this.currentPro.projectId
        }).then(res => {
          this.getList()
          this.$message({
            type: 'success',
            message: '添加成功'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    editMenu() {
      this.select_id = this.changeData.folderId
      if (this.select_id === '0') {
        this.$message({
          type: 'error',
          message: '不支持编辑'
        })
      } else {
        this.isEdit = true
        this.edit_name = this.changeData.name
      }
    },
    remove() {
      this.delDialogVisible = true
    },
    changeItem(node, data) {
      loading()
      file.getChildrenList({
        'projectId': this.currentPro.projectId,
        'folderId': data.folderId,
        'currentPage': this.currentPage,
        'pageSize': this.pageSize
      }).then(res => {
        loadingClose()
        this.$set(this, 'total', res.total)
        this.$set(this, 'centerData', res.list)
      }).catch(err => {
        console.log(err)
        this.$message({
          type: 'error',
          message: err.msg
        })
      })
      // this.folderId = data.folderId
      this.changeData = data
      console.log(this.folderId)
    },
    nameChange(e) {
      e = event || window.event
      e.stopPropagation()
      this.edit_name = e.target.value
    },
    isSelect(data) {
      return data.folderId === this.select_id
    },
    close(data, node) {
      this.select_id = null
      this.edit_name = this.data.name
      this.isEdit = false
    },
    editMsg(data, node) {
      node.data.name = this.edit_name
      file.editMenuList({
        'createBy': 'admini',
        'folderId': data.folderId,
        'name': this.edit_name
      }).then(res => {
        this.getList()
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.msg
        })
      })
      this.isEdit = false
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          {
            (this.isEdit === true && this.isSelect(data))
              ? <input
                class='ly-edit__text'
                style='width:60%'
                on-keyup={() => this.nameChange()}
                value={this.edit_name} />
              : <span on-click = { () => this.changeItem(node, data) }>{node.data.name}</span>
          }
          {
            (this.isEdit === true && this.isSelect(data))
              ? (
                <span class="ly-visible">
                  <el-button
                    size="mini"
                    type="text"
                    on-click={ () => this.close(data, node) }
                  >
                    取消
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    on-click={ () => this.editMsg(data, node) }
                  >
                    确认
                  </el-button>
                </span>
              )
              : null
          }
        </span>
      )
    }
  }
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  padding: 0;
  margin-bottom: 15px;
}
/deep/.el-aside{
  background: rgba(21, 43, 76, 0.6);
  animation: aside 1s linear infinite alternate;
}
@keyframes aside {
  0% {
    box-shadow: 2px 2px 15px rgba(44,76,124,1);
  }
  50% {
    box-shadow: 2px 2px 25px rgba(44,76,124,1);
  }
  100% {
    box-shadow: 2px 2px 35px rgba(44,76,124,1);
  }
}
// .nav-aside {
//   background: 0 0;
// }
.el-aside {
  background: rgba(21, 24, 45, 0.9);
  padding: 10px;
  height: calc(100% - 20px);
  margin-left: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  width: 250px !important;
}
.nav-aside .el-header {
  height: auto !important;
  margin: 0;
}
.nav-aside .el-main {
  padding: 10px 0 0 0;
}
.nav-aside .el-main::-webkit-scrollbar {
  display: none;
}
.el-input {
  width: 80%;
}
.nav-tree {
  margin-top: 10px;
}
.filter-tree {
  background: 0 0;
}
/deep/ .el-tree-node:focus > .el-tree-node__content {
  background: 0 0;
  color: #66b1ff;
}
/deep/ .el-tree-node__content:hover {
  color: #66b1ff;
  background: 0 0;
}
/deep/ .el-tree-node__expand-icon {
  padding: 6px 6px 6px 0;
}
.conter{
  padding: 0 20px 20px;
}
.el-tree{
  color:#fff;
  font-size: 14px;
}
.btns{
padding: 8px 0;
.el-button--mini, .el-button--mini.is-round {
    padding: 8px 16px;
    font-family: Roboto;
    font-size: 14px;
}
}
.el-tree-node__content .custom-tree-node .ly-edit__text {
    width: 60% !important;
    margin-right: 36px;
    height: 25px;
    border: 1px solid #e6e6e6;
    border-radius: 3px;
    color: #666;
    text-indent: 10px;
}
.el-message-box__wrapper .el-message-box{
    vertical-align: center;
}
</style>
