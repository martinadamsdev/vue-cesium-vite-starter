/** @Author: wuhaimin * @Date: 2020-10-16 11:06:45 * @Last Modified by:   wuhaimin * @Last Modified time: 2020-10-16 11:06:45 * @Description: 模型旋轉縮放面板 */

<template>
  <el-row class="rs-panel">
    <el-col>
      <span class="slider-label">X轴</span>
      <el-slider
        label="X轴"
        v-model="xValue"
        show-input
        :min="-180"
        :max="180"
        :show-input-controls="false"
        :show-tooltip="false"
        input-size="mini"
        @input="change('x', xValue)"
        >
      </el-slider>
    </el-col>
    <el-col>
      <span class="slider-label">Y轴</span>
      <el-slider
        label="Y轴"
        v-model="yValue"
        show-input
        :min="-180"
        :max="180"
        input-size="mini"
        :show-input-controls="false"
        :show-tooltip="false"
        @input="change('y', yValue)"
        >
      </el-slider>
    </el-col>
    <el-col>
      <span class="slider-label">Z轴</span>
      <el-slider
        label="Z轴"
        v-model="zValue"
        show-input
        :min="-180"
        :max="180"
        input-size="mini"
        :show-input-controls="false"
        :show-tooltip="false"
        @input="change('z', zValue)"
      >
      </el-slider>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'RotateScale',
  data() {
    return {
      xValue: 0,
      yValue: 0,
      zValue: 0
    }
  },
  methods: {
    change(type, value) {
      this.$emit('change', {
        type: type,
        value: value
      })
    }
  }
}
</script>
<style lang="less" scoped>
.rs-panel{
  position: fixed;
  right: 10px;
  bottom: 30px;
  padding: 10px;
  background: rgba(21, 24, 45, 0.7);
  border-radius: 3px;
}
/deep/.el-slider__input{
  width: 55px;
}
/deep/.el-slider__runway{
  height: 2px;
}
/deep/.el-slider__runway.show-input{
  margin-right: 70px;
}
/deep/.el-slider__bar{
  height: 2px;
}
/deep/.el-slider__button-wrapper{
  height: 20px;
  width: 20px;
  top: -10px;
}
/deep/.el-slider__button{
  width: 10px;
  height: 10px;
  border: none;
}
/deep/.el-input--mini .el-input__inner {
  height: 24px;
  line-height: 24px;
}
.slider-label{
  color: #fff;
}
</style>
