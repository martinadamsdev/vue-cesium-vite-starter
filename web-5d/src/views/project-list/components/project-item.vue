<template>
  <el-container>
    <el-header>
      <span class="user-name" v-text="userInfo.realName" />
      <span> 欢迎您！</span>
      <span>机构：</span>
      <span v-text="userInfo.comMesDto ? userInfo.comMesDto.comName : '暂无机构'" />
    </el-header>
    <el-main>
      <el-row @click.native="goHomePage" class="project-des">
        <p class="item-tittle">项目描述 </p>
        <p class="project-desc">{{ projectInfo.desc }}</p>
        <p class="right-arrow"><i class="el-icon-right"></i></p>
      </el-row>
      <el-row>
        <p class="item-tittle">里程碑 </p>
        <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto">
          <li v-for="key in milestArry" :key="key.id" class="infinite-list-item">
            <el-tooltip :class="key.id!='false'?'progress-lable':'no-data'" effect="dark" :content="key.name" placement="top">
              <span>{{ key.name }}</span>
            </el-tooltip>
           <el-progress v-if="key.id!='false'" :text-inside="true" :stroke-width="13" :percentage="key.schedule" :color="customColor" />
          </li>
        </ul>
      </el-row>
      <el-row :gutter="3">
        <p class="item-tittle">我的任务 </p>
          <el-col :span="8">
            <el-card class="box-card" @click.native="jumpPage('Delivery')">
              <div slot="header" class="clearfix">
                <span style="color:rgba(114, 169, 234, 100)">交付任务</span>
              </div>
              <div>
                <ul class="infinite-list" v-infinite-scroll="deliveryLoad" style="height:200px;overflow:auto">
                  <li v-for="(key,index) in myDeliveryTaskList" :key="index" class="infinite-list-item">
                    {{ index+1 }} 、{{key}}
                  </li>
                </ul>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card" @click.native="jumpPage('Review')">
              <div slot="header" class="clearfix">
                <span style="color:orange">审核任务</span>
              </div>
              <div>
                <ul class="infinite-list" v-infinite-scroll="deliveryLoad" style="height:200px;overflow:auto">
                  <li v-for="(key,index) in myReviewTaskList" :key="index" class="infinite-list-item">
                    {{ index+1 }} 、{{key}}
                  </li>
                </ul>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card"  @click.native="jumpPage('Acceptance')">
              <div slot="header" class="clearfix">
                <span style="color:green">验收任务</span>
              </div>
              <div>
                <ul class="infinite-list" v-infinite-scroll="deliveryLoad" style="height:200px;overflow:auto">
                  <li v-for="(key,index) in myAcceptanceTaskList" :key="index" class="infinite-list-item">
                    {{ index+1 }} 、{{key}}
                  </li>
                </ul>
              </div>
            </el-card>
          </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
import { mapState } from 'vuex'
import getProject from '@/api/project-list'
import myTask from '@/api/task'
export default {
  name: 'project-item',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      milestone: {
        currentPage: 1,
        name: '',
        pageSize: 5,
        projectId: ''
      },
      myAcceptanceTaskList: [], // 验收任务
      myDeliveryTaskList: [], // 交付任务
      myReviewTaskList: [], // 审核任务
      milestoneFlag: true,
      milestArry: [],
      projectInfo: {
        name: '',
        desc: ''
      },
      downloadFileShow: ['1'],
      downloadFile: []
    }
  },
  created() {
    // 加载页面初始数据
    this.init()
    this.getMyTaskList(this.id)
    this.getProDetails(this.id)
    this.getMilestone(this.id)
    // this.getTaskAll(this.id)
  },
  computed: {
    ...mapState('userInfo', {
      userInfo: state => state.userInfo
    })
  },
  methods: {
    getMyTaskList(id) {
      myTask.findMyTaskList(this.userInfo.userId, id).then(res => {
        this.$set(this, 'myAcceptanceTaskList', res.myAcceptanceTaskList)
        this.$set(this, 'myDeliveryTaskList', res.myDeliveryTaskList)
        this.$set(this, 'myReviewTaskList', res.myReviewTaskList)
      }).catch(err => {
        console.log(err)
      })
    },
    jumpPage(path) {
      // 页面跳转
      this.$router.push({ path: '/digital-delivery', query: { type: path } })
    },
    handleClick(data) {
      // 操作预览功能
      console.log(data)
    },
    customColor(num) { },
    getProDetails(id) {
      if (!id) {
        return false
      }
      getProject.getProjectDetails(id).then(res => {
        let data = res[0]
        this.projectInfo = Object.assign({}, this.projectInfo, {
          name: data.name,
          desc: data.description
        })
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.msg
        })
      })
    },
    getMilestone(id) {
      // 获取里程碑
      if (!id) {
        return false
      }
      this.$set(this.milestone, 'projectId', id)
      getProject.getMilestone(this.milestone).then(res => {
        this.$set(this, 'milestoneFlag', false)
        for (var i = 0; i < res.list.length; i++) {
          res.list[i].schedule = parseFloat(res.list[i].schedule.split('%')[0])
          this.milestArry.push(res.list[i])
        }
        var currentPage = this.milestone.currentPage + 1
        this.$set(this.milestone, 'currentPage', currentPage)
        if (res.list.length < 5) {
          this.milestArry.push({id: 'false', name: '没有更多了~~~'})
          this.$set(this, 'milestoneFlag', true)
        }
        console.log(this.milestArry)
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.msg
        })
      })
    },
    deliveryLoad() {
      // 交付任务滚动加载
    },
    load() {
      // 里程碑滚动加载
      if (this.milestoneFlag) {
        return false
      }
      this.$set(this.milestone, 'currentPage', this.milestone.currentPage)
      var projectId = this.milestone.projectId
      this.getMilestone(projectId)
    },
    init() {
      // 初始化数据
      this.$set(this, 'milestArry', [])
      this.$set(this, 'milestone', {
        currentPage: 1,
        name: '',
        pageSize: 5,
        projectId: ''
      })
    },
    goHomePage() {
      this.$emit('goNextPage')
    }
  }
}
</script>
<style lang="less" scoped>
@backgroundColor: #475e9a;
@borderRadius: 4px;
.el-container {
  height: 100% !important;
}
.tab{
  margin-top: 20px;
}
.el-header {
  color: white;
  height: auto !important;
  padding: 10px;
}
.user-name{
  color: rgba(56, 148, 255, 100);
  font-weight: 900;
  font-size: 16px;
  vertical-align: bottom;
}
.infinite-list{
  max-height: 250px;
}
.el-progress{
  display: inline-block;
  width: 40%;
  margin-bottom: 10px;
}
.progress-lable{
  display: inline-block;
  vertical-align: middle;
  width: 10%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.progress-lable:hover{
  cursor: pointer;
}
.no-data{
  display: inline-block;
  width: 30%;
  text-align: center;
}
/deep/ .el-card__header{
  padding: 9px 8px;
}
/deep/ .el-card__body{
  padding: 10px 8px;
  min-height: 200px;
}
.box-card /deep/ .infinite-list-item{
  padding: 5px 0;
  font-size: 15px;
}
.project-name{
  line-height: 36px;
}
.project-desc{
  line-height: 18px;
  text-indent: 20px;
  flex: 1;
  white-space: pre-wrap;
  word-break: break-word;
}
.el-main {
  padding: 20px 0;
}
.el-main::-webkit-scrollbar {
  display: none;
}
.el-main .el-row {
  width: 100%;
}
.el-main .diagram {
  height: 20%;
}
.el-main .el-row{
  color: white;
  margin-bottom: 20px;
}
.el-main .el-row::after,.el-header{
  content: '';
  display: block;
  border-bottom: 1px dashed gray;
  padding-top: 20px;
}
.project-des:hover{
  cursor: pointer;
}
.item-tittle{
  font-weight: 800;
  font-size: 16px;
  margin-bottom: 16px;
}
.item-tittle::before {
  content: '';
  display: inline-block;
  border: 4px solid rgba(56, 148, 255, 100);
  height: 14px;
  margin:0 10px 0 5px;
  vertical-align: middle;
}
.diagram .el-col {
  height: 100%;
}
/deep/ .el-collapse {
  border: none;
}
/deep/ .el-collapse-item__header {
  border-radius: @borderRadius !important;
  background: @backgroundColor !important;
  border-bottom: none;
  height: 35px;
  line-height: 35px;
  color: #fff;
  text-indent: 5px;
}
/deep/ .el-collapse-item__wrap {
  margin-top: 2px;
  border-radius: 2px;
}
.right-arrow{
  line-height: 30px;
  text-align: right;
}
@keyframes arrowmove{
  0% {margin-right: 0;}
  25% {margin-right: 5px;}
  75% {margin-right: 15px;}
  100% {margin-right: 20px;}
}
.el-icon-right{
  font-size: 24px;
  animation: arrowmove 1s linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
.el-card:hover{
  cursor: pointer;
}
</style>
