/** @Author: wuhaimin * @Date: 2020-10-12 15:54:04 * @Last Modified by:   wuhaimin * @Last Modified time: 2020-10-12 15:54:04 * @Description: 模型操作功能按钮 */

<template>
  <div class="model-btn">
    <el-dropdown trigger="click" @command="handleCommand">
      <p class="btns el-dropdown-link" title="视图方向"><img :src="img.view" class="oprate-img"/></p>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="item of viewDirArr" :key="item.id" class="view-title" :command="item.id"> {{ item.label }} </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <p class="btns" @click="home" title="主视角"><i class="el-icon-s-home"></i></p>
    <p class="btns" @click="details" title="构件详情" :class="[artifactsActive ? 'btn-active': '']"><i class="iconfont icon--shuxing"></i></p>
    <p class="btns" @click="clipping" :class="[clippingActive ? 'btn-active': '']" title="剖切"><i class="iconfont icon-pouqie"></i></p>
    <p class="btns" v-if="hasMark" @click="mark" :class="[markActive ? 'btn-active': '']" title="添加标注"><i class="iconfont icon-kaishipizhu"></i></p>
    <p class="btns" v-if="hasTag" @click="hanlderViewTag" :class="[viewMarkActive ? 'btn-active': '']" title="添加视点"><i class="iconfont icon-shituzhuizong"></i></p>
    <p class="btns" @click="measure" :class="[measureActive ? 'btn-active': '']" title="测量"><i class="iconfont icon-celiang"></i></p>
    <p class="btns" @click="linkFolder" :class="[folderActive ? 'btn-active': '']" title="关联文档"><i class="el-icon el-icon-folder-add"></i></p>
    <p class="btns" @click="roaming" :class="[roamingActive ? 'btn-active': '']" title="漫游"><i class="el-icon el-icon-video-play"></i></p>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'ToolBtn',
  data() {
    return {
      markActive: false,
      clippingActive: false,
      measureActive: false,
      artifactsActive: true,
      viewMarkActive: false,
      folderActive: false,
      roamingActive: false,
      img: {
        clipping: require('@/common/image/clipping.png'),
        measure: require('@/common/image/measure.png'),
        view: require('@/common/image/view.png')
      },
      markArr: [
        {label: '添加', id: '0', icon: 'el-icon-circle-plus-outline'},
        {label: '查看', id: '1', icon: 'el-icon-view'}
      ],
      viewDirArr: [
        {label: '前', id: '0'},
        {label: '后', id: '180'},
        {label: '左', id: '90'},
        {label: '右', id: '-90'},
        {label: '上', id: '-1'},
        {label: '下', id: '1'}
      ],
      markStyle: ''
    }
  },
  computed: {
    ...mapState('userInfo', {
      permission: state => state.permission
    }),
    hasMark() {
      if (this.permission.indexOf('model:label') !== -1) {
        return true
      }
      return false
    },
    hasTag() {
      if (this.permission.indexOf('model:viewpoint') !== -1) {
        return true
      }
      return false
    }
  },
  methods: {
    // 构件详情
    details() {
      this.$set(this, 'artifactsActive', !this.artifactsActive)
      this.$emit('details', this.artifactsActive)
    },
    // 漫游
    roaming() {
      this.$set(this, 'roamingActive', !this.roamingActive)
      this.$emit('roaming', this.roamingActive)
    },
    // 点击标注按钮 测试
    mark() {
      this.$set(this, 'markActive', !this.markActive)
      this.$set(this, 'viewMarkActive', false)
      this.$set(this, 'measureActive', false)
      this.$emit('mark', this.markActive)
      this.$emit('hanlderViewTag', false)
      this.$emit('measure', false)
    },
    // 取消标注
    markCancel() {
      this.$set(this, 'markActive', false)
      this.$emit('mark', false)
    },
    // 视点标注
    hanlderViewTag() {
      this.$set(this, 'markActive', false)
      this.$set(this, 'viewMarkActive', !this.viewMarkActive)
      this.$set(this, 'measureActive', false)
      this.$emit('mark', false)
      this.$emit('measure', false)
      this.$emit('hanlderViewTag', this.viewMarkActive)
    },
    // 剖切
    clipping() {
      this.$set(this, 'clippingActive', !this.clippingActive)
      console.log(this.clippingActive)
      this.$emit('clipping', this.clippingActive)
    },
    closeClipping() {
      this.$set(this, 'clippingActive', !this.clippingActive)
    },
    home() {
      this.$emit('home')
    },
    // 测量
    measure() {
      this.$set(this, 'markActive', false)
      this.$set(this, 'viewMarkActive', false)
      this.$set(this, 'measureActive', !this.measureActive)
      this.$emit('mark', false)
      this.$emit('hanlderViewTag', false)
      this.$emit('measure', this.measureActive)
    },
    // 视图方向
    handleCommand(command) {
      this.$emit('handleViewDir', command)
    },
    // 标注
    handleMark(command) {
      this.markStyle = command
      if (command === '0') {
        this.mark()
      } else {
        // 查看标注
        this.$emit('viewMark')
      }
    },
    // 标注下拉菜单关闭
    hideDropdown(val) {
      if (!val) {
        console.log('关闭')
        if (this.markStyle && this.markStyle === '0') {
          this.mark()
        } else if (this.markStyle && this.markStyle === '1') {
          // 关闭查看
          this.$emit('closeViewMark')
        }
        this.markStyle = ''
      }
    },
    // 文档关联
    linkFolder() {
      this.$set(this, 'artifactsActive', false)
      this.$emit('details', this.artifactsActive)
      this.$set(this, 'markActive', false)
      this.$set(this, 'viewMarkActive', false)
      this.$set(this, 'measureActive', false)
      this.$emit('mark', false)
      this.$emit('hanlderViewTag', false)
      this.$emit('measure', false)
      this.$set(this, 'folderActive', !this.folderActive)
      this.$emit('linkFolder', this.folderActive)
    },
    // 取消文档关联
    cancelDocLink() {
      this.$set(this, 'folderActive', false)
    }
  }
}
</script>
<style lang="less" scoped>
.model-btn{
  position: fixed;
  left: 50%;
  bottom: 30px;
  height: 40px;
  transform:translateX(-50%) ;
  border-radius: 30px;
  background:  rgba(44,76,124,1);
  .btn-active{
    .iconfont,.el-icon{
      color: #66f1f1;
      background: rgba(102,241,241, 0.3);
      box-shadow: 0px 0px 5px #66f1f1;
      transition: all 1s;
    }
  }
}
.btns{
  width: 60px;
  line-height: 40px;
  float: left;
  color: #fff;
  // margin-left: 4px;
  text-align: center;
  cursor: pointer;
  i{
    font-size: 18px;
    vertical-align: middle;
  }
}
.oprate-img{
  vertical-align: middle;
}
.view-title{
  text-align: center;
  line-height: 30px;
}
</style>
