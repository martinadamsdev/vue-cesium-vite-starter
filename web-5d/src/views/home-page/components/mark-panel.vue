/** @Author: wuhaimin * @Date: 2020-10-17 15:41:32 * @Last Modified by:   wuhaimin * @Last Modified time: 2020-10-17 15:41:32 * @Description: 模型标注面板 */
<template>
  <el-row :style="style" ref="markPanel" class="mark-panel">
    <el-card>
      <div slot="header">
        <span>新增标注</span>
        <el-button type="text" style="float: right; padding: 0" @click="cancel">
          <i class="el-icon-close"></i>
        </el-button>
      </div>
      <el-form ref="form" :model="form"  :rules="rules" label-width="50px">
        <el-form-item label="名称" prop="name">
          <el-input type="text" v-model="form.name" show-word-limit maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input type="textarea" v-model="form.desc" show-word-limit maxlength="200"></el-input>
        </el-form-item>
        <el-form-item class="create-btn">
          <el-button type="primary" size="small" @click="sure">确定</el-button>
          <el-button size="small" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>
<script>
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
    }
  },
  data() {
    return {
      form: {
        name: '',
        desc: ''
      },
      style: `position: fixed; top: ${this.position.top}px; left: ${this.position.left}px;`,
      rules: {
        name: [
          { required: true, message: '请输入标注名称', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    position(val) {
      this.$refs.markPanel.$el.style.top = `${val.top}px`
      this.$refs.markPanel.$el.style.left = `${val.left}px`
    }
  },
  created() {
    console.log(this.positon)
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    sure(data) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('sureMark', this.form)
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs['form'].resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.mark-panel{
  transition: all 1s;
}
/deep/.el-card__header{
  padding: 10px 20px;
}
/deep/.el-input__inner{
  height: 30px;
  line-height: 30px;
}
</style>
