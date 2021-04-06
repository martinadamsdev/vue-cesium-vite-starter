<template>
  <el-row class="folder-list" :gutter="20">
    <el-col :span="10">
      <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </el-col>
    <el-col :span="14">
      <el-table
        ref="folderTable"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="30"
        >
        </el-table-column>
        <el-table-column
          label="名称"
          prop="name"
        >
        </el-table-column>
      </el-table>
      <el-button type="primary" class="sure-btn" @click="sureLink">确定</el-button>
      <el-button @click="cancelLink">取消</el-button>
    </el-col>
  </el-row>
</template>
<script>
import modelApi from '@/api/home-page'
export default {
  name: 'FolderList',
  props: {
    projectId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeData: [],
      tableData: [],
      multipleSelection: []
    }
  },
  created() {
    this.getTreeData()
  },
  methods: {
    handleNodeClick(data) {
      this.getFolderData(data.id)
    },
    getTreeData() {
      modelApi.getFolderTreeList(this.projectId).then(data => {
        this.$set(this, 'treeData', data)
        if (data.length === 0) {
          this.tableData.splice(0)
        } else {
          this.getFolderData(data[0].id)
        }
      }).then(err => {
        console.log(err)
      })
    },
    getFolderData(id) {
      modelApi.getFolderData(id).then(data => {
        this.$set(this, 'tableData', data)
      }).then(err => {
        console.log(err)
      })
    },
    handleSelectionChange(val) {
      const filterArr = val.map((item) => {
        return item.attachmentId
      })
      this.$set(this, 'multipleSelection', filterArr)
      console.log(val)
    },
    sureLink() {
      if (this.multipleSelection.length === 0) {
        return
      }
      this.$emit('sureLink', this.multipleSelection)
    },
    cancelLink() {
      this.$emit('cancelLink')
    }
  }
}
</script>
<style lang="less" scoped>
.folder-list{
  width: 40%;
  position: absolute;
  top: 0;
  right: 20px;
  background: #fff;
  padding: 10px 0;
}
.sure-btn{
  margin-top: 10px;
}
</style>
