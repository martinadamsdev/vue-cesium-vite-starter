<template>
  <el-row :class="['view-tag-box', isShrink ? 'view-tag-box-shrink' : 'view-tag-box-spread']">
    <div :class="['tag-list', isShrink ? 'tag-list-shrink' : 'tag-list-spread']">
      <div class="nav-tab">
        <p class="tabs" :class="[active ? 'tab-active' : '']" @click="toggleTag(true)">我的视点</p>
        <p class="tabs" :class="[active ?  '' : 'tab-active']" @click="toggleTag(false)">共享视点</p>
      </div>
      <el-table
        :data="tagList"
        stripe
      >
        <el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="!active" prop="createBy" label="创建人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建日期" width="150"></el-table-column>
        <el-table-column label="操作" align="center" width="240">
          <template slot-scope="scope">
            <el-button type="text" size="min" @click="toTag(scope.row)">转向视点</el-button>
            <el-button v-if="active && scope.row.isShare === '0'" type="text" size="min" @click="handleShare(scope.row, '2')">分享</el-button>
            <el-button v-else-if="active && scope.row.isShare !== '0'" type="text" size="min" @click="handleShare(scope.row, '0')">取消分享</el-button>
            <el-button v-else-if="!active && scope.row.isShare !== '0' && scope.row.createById === userId" type="text" size="min" @click="handleShare(scope.row, '0')">取消分享</el-button>
            <el-button v-if="active" type="text" size="min" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="active" type="text" size="min" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryData.currentPage"
        :page-size="5"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    <div v-show="!isShrink" class="arrow">
      <i class="el-icon-caret-left icon" @click="spreadTable" title="收起"></i>
    </div>
    <div v-show="isShrink" class="spread-btn" @click="spreadTable">
      展开视点
      <i class="el-icon-caret-right"></i>
    </div>
  </el-row>
</template>
<script>
import modelApi from '@/api/home-page'
import { loading, loadingClose } from '@/utils/index'
export default {
  name: 'ViewTag',
  props: {
    modelId: {
      type: String,
      default() {
        return ''
      }
    },
    projectId: {
      type: String,
      default() {
        return ''
      }
    },
    userId: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      tagList: [],
      queryData: {
        projectId: this.projectId,
        entityId: this.modelId,
        currentPage: 1,
        createById: this.userId,
        description: '',
        name: '',
        pageSize: 5
      },
      queryShareData: {
        projectId: this.projectId,
        entityId: this.modelId,
        currentPage: 1,
        pageSize: 5
      },
      total: 0,
      active: true,
      isShrink: false
    }
  },
  created() {
    this.queryTag()
  },
  methods: {
    handleCurrentChange(val) {
      console.log(val)
      if (this.active) {
        this.$set(this.queryData, 'currentPage', val)
      } else {
        this.$set(this.queryShareData, 'currentPage', val)
      }
      this.toggleTag(this.active)
    },
    handleEdit(row) {
      this.$emit('handleEditTag', JSON.parse(JSON.stringify(row)))
    },
    handleDel(row) {
      this.$confirm('确认删除所选视点吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        loading('正在删除...')
        modelApi.delTag([row.id]).then(res => {
          loadingClose()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.queryTag()
        }).catch(error => {
          loadingClose()
          this.$message({
            type: 'error',
            message: error.msg
          })
        })
      })
    },
    queryTag() {
      loading('数据加载中...')
      modelApi.getTag(this.queryData).then(res => {
        loadingClose()
        this.$set(this, 'tagList', res.list)
        this.total = res.total
      }).catch(error => {
        loadingClose()
        this.$message({
          type: 'error',
          message: error.msg
        })
      })
    },
    queryShareTag(parmas) {
      loading('数据加载中...')
      modelApi.getShareTag(parmas).then(res => {
        loadingClose()
        this.$set(this, 'tagList', res.list)
        this.total = res.total
      }).catch(error => {
        loadingClose()
        this.$message({
          type: 'error',
          message: error.msg
        })
      })
    },
    // 转向视点
    toTag(row) {
      this.$emit('toTag', row)
    },
    // 视点分享
    handleShare(row, type) {
      modelApi.shareTag({
        id: [row.id],
        isShare: type
      }).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        if (this.active) {
          this.queryTag()
        } else {
          this.queryShareTag(this.queryShareData)
        }
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.msg
        })
      })
    },
    // 我的视点(true)、共享视点(fale)切换
    toggleTag(type) {
      this.$set(this, 'active', type)
      if (type) {
        this.queryTag()
      } else {
        this.queryShareTag(this.queryShareData)
      }
    },
    spreadTable() {
      this.$set(this, 'isShrink', !this.isShrink)
    }
  }
}
</script>
<style lang="less" scoped>
.view-tag-box{
  position: fixed;
  left: 70px;
  bottom: 200px;
  display: flex;
  flex-direction: row;
}
.view-tag-box-spread{
  width: 680px;
  padding: 10px 10px 10px 20px;
  background: rgba(44,76,124,0.2);
  box-shadow: 2px 2px 15px rgba(44,76,124,1);
  height: 380px;
  transition: width 0.5s;
}
.view-tag-box-shrink{
  width: auto;
  transition: width 0.5s;
}
.tag-list{
  display: flex;
  flex-direction: column;
}
.tag-list-spread{
  flex: 1;
  transition: all 1s;
}
.tag-list-shrink{
  flex: 0;
  height: 0;
  overflow: hidden;
}
.nav-tab{
  height: 40px;
}
/deep/.el-table{
  color: #444;
  flex: 1;
  overflow: unset;
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
.arrow{
  width: 16px;
  font-size: 16px;
  cursor: pointer;
  text-align: center;
  line-height: 360px;
  color: #fff;
}
.icon:hover{
  color: #2fc8d0;
}
.spread-btn{
  color: #fff;
  line-height: 20px;
  padding: 10px;
  border-radius: 20px;
  cursor: pointer;
  background: rgba(102, 241, 241, 0.3);
  box-shadow: 0px 0px 100px rgb(102 241 241);
  transition: box-shadow .2s ease-out;
}
.spread-btn:hover{
  color: antiquewhite;
  box-shadow: 0px 0px 70px rgb(102 241 241);
}
</style>
