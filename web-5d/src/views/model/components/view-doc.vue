<template>
  <el-row class="view-tag-box">
    <el-table
      :data="docList"
    >
      <el-table-column prop="name" label="文件名称" width="240" show-overflow-tooltip></el-table-column>
      <el-table-column prop="type" label="文件类型"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="min" @click="handleView(scope.row)">预览</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
</template>
<script>
import modelApi from '@/api/home-page'
import { loading, loadingClose } from '@/utils/index'
import file from '@/api/file'
export default {
  name: 'ViewDoc',
  props: {
    entityId: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      docList: []
    }
  },
  watch: {
    entityId(val) {
      this.queryDoc(val)
    }
  },
  created() {
    this.queryDoc(this.entityId)
  },
  methods: {
    queryDoc(id) {
      loading('数据加载中...')
      modelApi.getEntityLinkDoc(id).then(data => {
        loadingClose()
        this.$set(this, 'docList', data)
      }).catch(error => {
        loadingClose()
        this.$message({
          type: 'error',
          message: error.msg
        })
      })
    },
    handleView(row) {
      // 预览
      loading('数据加载中...')
      file.previewExcal(row.attachmentId).then(data => {
        loadingClose()
        window.open(`http://${data}`, '_blank')
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.msg
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.view-tag-box{
  position: fixed;
  left: 70px;
  bottom: 200px;
  width: 680px;
  padding: 10px 20px;
  background: rgba(44,76,124,0.2);
  box-shadow: 2px 2px 15px rgba(44,76,124,1);
}
/deep/.el-table{
  color: #444;
}
/deep/.el-table thead{
  background: #192e4e;
  color: #2fc8d0;
}
.el-pagination{
  text-align: right;
}
/deep/.el-pagination__jump{
  color: #d6d2d2;
}
/deep/.el-table th{
  background: none;
}
/deep/.el-table tr{
  background: none;
}

/deep/.el-table td, .el-table th.is-leaf{
  border: none;
}
/deep/.el-pager li{
  background: none;
}
/deep/.el-pager{
  color: #d6d2d2;
}
/deep/.el-pagination button:disabled{
  background: none;
}
/deep/.el-pagination .btn-next{
  color: #d6d2d2;
  background: none;
}
/deep/.el-pagination .btn-prev{
  color: #d6d2d2;
  background: none;
}
/deep/.el-pager li.btn-quicknext{
  color: #d6d2d2;
}
/deep/.el-pager li.btn-quickprev{
  color: #d6d2d2;
}
/deep/.el-pager li.active {
  color: #2fc8d0;
}
.tabs{
  display: inline-block;
  line-height: 30px;
  padding: 0px 15px;
  margin: 0px 10px 10px 0px;
  color: #fff;
  cursor: pointer;
}
.tab-active{
  background: #2c4c7c;
  border-radius: 20px;
}
.el-checkbox{
  color: #fff;
}
</style>
