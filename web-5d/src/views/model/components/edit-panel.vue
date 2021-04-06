/** @Author: wuhaimin * @Date: 2020-10-17 15:41:32 * @Last Modified by:   wuhaimin * @Last Modified time: 2020-10-17 15:41:32 * @Description: 模型标注面板 */
<template>
  <el-row ref="markPanel" class="mark-panel" v-loading="loading" element-loading-text="数据发送中...">
    <el-card style="width: 25%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
      <div slot="header">
        <span>编辑标注</span>
        <el-button type="text" style="float: right; padding: 0" @click="cancel">
          <i class="el-icon-close"></i>
        </el-button>
      </div>
      <el-form ref="form" :model="form" label-width="50px" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input type="text" maxlength="50" v-model="form.name" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" maxlength="200" v-model="form.description" show-word-limit></el-input>
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
import modelApi from '@/api/home-page'
export default {
  name: 'MarkPanel',
  props: {
    position: {
      type: Object,
      default() {
        return {
          left: 0,
          top: 0
        }
      }
    },
    recordMsg: {
      type: Object,
      default() {
        return {
          id: '',
          name: '',
          description: ''
        }
      }
    }
  },
  data() {
    return {
      form: {
        id: '',
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入标注名称', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  created() {
    this.$set(this, 'form', this.recordMsg)
  },
  watch: {
    position(val) {
      console.log(val)
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    postData() {
      this.loading = true
      modelApi.updateMark(this.form).then(res => {
        this.loading = false
        this.$emit('postData', {
          type: 'success',
          msg: '编辑成功',
          content: this.form
        })
      }).catch((error) => {
        this.loading = false
        this.$emit('postData', {
          type: 'error',
          msg: error.msg,
          content: {}
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.mark-panel{
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
</style>
