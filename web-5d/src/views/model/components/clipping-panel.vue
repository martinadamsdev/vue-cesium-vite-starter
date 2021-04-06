/** @Author: wuhaimin * @Date: 2020-10-28 13:32:17 * @Last Modified by:   wuhaimin * @Last Modified time: 2020-10-28 13:32:17 * @Description: 剖切面板 */

<template>
  <el-row class="clipping-panel">
    <el-row>
      <span class="clipping-title">剖切方向:</span>
      <el-select v-model="selVal" @change="changeAxial" :style="{background: 'url('+bgUrl+') no-repeat center'}">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-row>
    <el-row class="clipping-slider">
      <el-slider v-model="sliderVal" :show-tooltip="false" @input="sliderInput" :min="-100" :max="100"></el-slider>
    </el-row>
  </el-row>
</template>
<script>
export default {
  name: 'ClippingPanel',
  data() {
    return {
      selVal: '',
      options: [
        {value: 'x', label: 'x轴'},
        {value: 'y', label: 'y轴'},
        {value: 'z', label: 'z轴'},
        {value: '-x', label: '-x轴'},
        {value: '-y', label: '-y轴'},
        {value: '-z', label: '-z轴'}
      ],
      sliderVal: 0,
      bgUrl: require('@/assets/selectBg.png')
    }
  },
  methods: {
    closeClipping() {
      this.$emit('closeClipping', false)
    },
    changeAxial(val) {
      console.log(val)
      this.$emit('changeAxial', val)
    },
    sliderInput(val) {
      console.log(val)
      this.$emit('sliderInput', val * 5)
    }
  }
}
</script>
<style lang="less" scoped>
.clipping-panel{
  display: flex;
  flex-direction: row;
  height: 68px;
  position: fixed;
  top: 68px;
  background: rgba(21, 24, 45, 0.6);
  border-radius: 3px;
  padding: 0;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.clipping-title{
  color: #fff;
  font-size: 14px;
  padding: 10px;
}
.el-icon-close{
  float: right;
  cursor: pointer;
}
.el-select,.el-slider{
  margin: 0 10px;
}
/deep/.el-slider__runway{
  height: 4px;
}
/deep/.el-slider__runway.show-input{
  margin-right: 70px;
}
/deep/.el-slider__bar{
  background: linear-gradient(-5deg, #f7dd5e, transparent);
  height: 4px;
}
/deep/.el-slider__button-wrapper{
  height: 20px;
  width: 20px;
  top: -8px;
}
/deep/.el-slider__button{
  width: 10px;
  height: 10px;
  border: none;
}
/deep/.el-input__inner{
  width: 115px;
  height: 28px;
  line-height: 28px;
  border: 1px solid #66f1f1;
  background: none;
  border-radius: 0;
  color: #fff;
}
/deep/.el-input__icon{
  line-height: 28px;
  color: #fff;
}
.clipping-slider{
  width: 400px;
}
.slider-label{
  color: #fff;
}
</style>
