<template>
    <!-- 上传器 -->
    <uploader
        ref="uploader"
        :options="options"
        :autoStart=false
        :file-status-text="fileStatusText"
        @file-added="onFileAdded"
        @file-success="onFileSuccess"
        @file-error="onFileError"
        class="uploader-ui upload-excel">
        <uploader-unsupport></uploader-unsupport>
        <uploader-drop>
            <div>
                <uploader-btn id="global-uploader-btn" :attrs="attrs" ref="uploadBtn">选择文件<i class="el-icon-upload el-icon--right"></i></uploader-btn>
            </div>
        </uploader-drop>
        <uploader-list></uploader-list>
        </uploader>
</template>
<script>
import SparkMD5 from 'spark-md5'
import file from '@/api/file'
export default {
  name: 'UploadBigFile',
  data () {
    return {
      options: {
        target: '/car/uploader/chunk', // 目标上传 URL，默认POST
        chunkSize: '2048000',
        fileParameterName: 'upfile',
        maxChunkRetries: 3,
        testChunks: true,
        checkChunkUploadedByResponse: function (chunk, responseMsg) {
          let objMessage = JSON.parse(responseMsg)
          if (objMessage.skipUpload) {
            return true
          }
          return (objMessage.uploadedChunks || []).indexOf(chunk.offset + 1) >= 0
        }
      },
      attrs: {
        accept: file.uploadTypeList.getAll()
      },
      fileStatusText: {
        success: '上传成功',
        error: '上传失败',
        uploading: '上传中',
        paused: '暂停',
        waiting: '等待上传'
      }
    }
  },
  methods: {
    onFileAdded(file) {
      this.computeMD5(file)
      console.log(file)
    },
    onFileSuccess(rootFile, file, response, chunk) {
      // refProjectId为预留字段，可关联附件所属目标，例如所属档案，所属工程等
      // file.refProjectId = '123456789'
      console.log(file)
      file.mergeFile(file).then(responseData => {
        if (responseData.data.code === 415) {
          console.log('合并操作未成功，结果码：' + responseData.data.code)
        }
      }).catch(function(error) {
        console.log('合并后捕获的未知异常：' + error)
      })
    },
    onFileError(rootFile, file, response, chunk) {
      console.log('上传完成后异常信息：' + response)
    },
    computeMD5(file) {
      file.pause()
      // 单个文件的大小限制2G
      let fileSizeLimit = 2 * 1024 * 1024 * 1024
      console.log('文件大小：' + file.size)
      console.log('限制大小：' + fileSizeLimit)
      if (file.size > fileSizeLimit) {
        this.$message({
          showClose: true,
          message: '文件大小不能超过2G'
        })
        file.cancel()
      }
      let fileReader = new FileReader()
      let time = new Date().getTime()
      let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      let currentChunk = 0
      const chunkSize = 10 * 1024 * 1000
      let chunks = Math.ceil(file.size / chunkSize)
      let spark = new SparkMD5.ArrayBuffer()
      // 由于计算整个文件的Md5太慢，因此采用只计算第1块文件的md5的方式
      let chunkNumberMD5 = 1
      loadNext()
      fileReader.onload = e => {
        spark.append(e.target.result)
        if (currentChunk < chunkNumberMD5) {
          loadNext()
        } else {
          let md5 = spark.end()
          file.uniqueIdentifier = md5
          file.resume()
          console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`)
        }
      }
      fileReader.onerror = function () {
        this.error(`文件${file.name}读取出错，请检查该文件`)
        file.cancel()
      }
      function loadNext() {
        let start = currentChunk * chunkSize
        let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end))
        currentChunk++
        console.log('计算第' + currentChunk + '块')
      }
    }
  }
}
</script>

<style>
  .uploader-ui {
    padding: 15px;
    /*margin: 20px auto 0;*/
    font-size: 12px;
    font-family: Microsoft YaHei;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
  }
  .uploader-ui .uploader-btn {
    margin-right: 4px;
    font-size: 12px;
    border-radius: 3px;
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
  }
  .uploader-ui .uploader-list {
    max-height: 340px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
