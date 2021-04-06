<template>
  <!-- 通用交付文档规定、质量审核规定、交付物规定  --doc-->
  <div>
    <el-menu
      class="el-menu-demo"
      :default-active="fileType"
      mode="horizontal"
      @select="changeTable"
    >
      <el-menu-item index="doc">交付文档规定</el-menu-item>
      <el-menu-item index="del">交付物规定</el-menu-item>
      <el-menu-item index="qua">质量审核规定</el-menu-item>
    </el-menu>
    <div class="line">
      <el-table :data="tableFileData" style="width: 100%" border>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="typeNo" label="编号" />
        <el-table-column prop="description" label="备注" />
        <el-table-column label="附件" align="center">
          <div v-for="item in file" :key="item.attachmentId">
            <span v-if="item.attachmentId" class="dowanload" @click="uploadClick(item.attachmentId, item.name)">{{item.name}}</span>
            <span v-else>{{item.name}}</span>
          </div>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import file from '@/api/file'
import task from '@/api/task'
export default {
  props: {
    deliveryContentId: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      fileType: 'doc', // 文件列表切换
      docAcceptDto: [], // 质量审核规定列表
      docAcceptDtoFile: [], // 文件
      docDeliveryDto: [], // 交付物规定文档列表
      docDeliveryDtoFile: [], // 文件
      docRuleDto: [], // 命名规则列表
      docRuleDtoFile: [] // 文件
    }
  },
  computed: {
    tableFileData() {
      var data = []
      switch (this.fileType) {
        case 'doc':
          data = this.docRuleDto
          break
        case 'del':
          data = this.docDeliveryDto
          break
        case 'qua':
          data = this.docAcceptDto
          break
      }
      return data
    },
    file() {
      var data = []
      switch (this.fileType) {
        case 'doc':
          data = this.docRuleDtoFile
          break
        case 'del':
          data = this.docDeliveryDtoFile
          break
        case 'qua':
          data = this.docAcceptDtoFile
          break
      }
      return data
    }
  },
  created() {
    this.getRegFileList()
  },
  methods: {
    setData(arry, key) {
      for (var i = 0; i < arry.length; i++) {
        if (arry[i]['attachmentId'][0]) {
          file.findMoreById(arry[i]['attachmentId']).then(res => {
            this.$set(this, key + 'File', res)
            this.$set(this, key, arry)
          })
        } else {
          this.$set(this, key + 'File', [
            {
              name: '无附件',
              type: '',
              attachmentId: ''
            }
          ])
          this.$set(this, key, arry)
        }
      }
    },
    getRegFileList() {
      task
        .findMyDelRegFlieList(this.deliveryContentId)
        .then((res) => {
          for (var i in res) {
            this.setData(res[i], i)
          }
        })
        .catch((err) => {
          this.$message.error(err.msg)
        })
    },
    changeTable(type) {
      this.$set(this, 'fileType', type)
    },
    browseClick(row) {
      // 浏览
      file
        .previewExcal(row.attachmentId)
        .then((res) => {
          window.open(`http://${res}`, '_blank')
        })
        .catch((err) => {
          this.$message({
            type: 'error',
            message: err.msg
          })
        })
    },
    uploadClick(attachmentId, name) {
      // 下载
      file
        .downloadExcel(attachmentId)
        .then((res) => {
          let url = window.URL.createObjectURL(
            new Blob([res], { type: 'arraybuffer' })
          )
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', name)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
        .catch((err) => {
          this.$message({
            type: 'error',
            message: err.msg
          })
        })
    }
  }
}
</script>
<style>
.dowanload:hover{
  color: #409EFF !important;
  cursor: pointer !important;
}
</style>
