<template>
  <el-row class="edit-tag-box">
    <el-card style="width: 25%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
      <div slot="header">
        <span>保存视点</span>
      </div>
      <el-form ref="form" :model="form" label-width="50px" :rules="rules">
        <el-form-item label="名称" prop="name" required>
          <el-input type="text" maxlength="50" v-model="form.name" show-word-limit></el-input>
        </el-form-item>
        <el-form-item class="create-btn">
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button type="primary" size="small" @click="postData">确定</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>
<script>
import { loading, loadingClose } from '@/utils/index'
import modelApi from '@/api/home-page'
export default {
  name: 'EditTag',
  props: {
    recordMsg: {
      type: Object,
      default() {
        return {
          id: '',
          name: '',
          x: 0,
          y: 0,
          z: 0,
          heading: 0,
          pitch: 0,
          roll: 0,
          projectId: '',
          entityId: '',
          createBy: '',
          createById: ''
        }
      }
    }
  },
  data() {
    return {
      form: {
        id: '',
        name: '',
        x: 0,
        y: 0,
        z: 0,
        heading: 0,
        pitch: 0,
        roll: 0,
        projectId: '',
        entityId: '',
        createBy: '',
        createById: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入视点名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在1到50个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$set(this, 'form', this.recordMsg)
  },
  methods: {
    cancel() {
      this.$emit('editTag', {
        type: 'cancel',
        flag: false
      })
    },
    editData() {
      loading('数据发送中...')
      modelApi.editTag({
        id: this.form.id,
        name: this.form.name
      }).then(res => {
        loadingClose()
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.$emit('editTag', {
          type: 'edit',
          flag: false
        })
      }).catch(error => {
        loadingClose()
        this.$message({
          type: 'error',
          message: error.msg
        })
      })
    },
    addData() {
      loading('数据发送中...')
      modelApi.addTag(this.form).then(res => {
        loadingClose()
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.$emit('editTag', false)
      }).catch(error => {
        loadingClose()
        this.$message({
          type: 'error',
          message: error.msg
        })
      })
    },
    postData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            this.editData()
          } else {
            this.addData()
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.edit-tag-box{
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}
/deep/.el-card__header{
  padding: 10px 20px;
}
/deep/.el-card__body{
  padding: 10px;
}
</style>
