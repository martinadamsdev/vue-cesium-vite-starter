/**
@Author: wuhaimin * @Date: 2020-10-12 15:14:26 * @Last Modified by:   wuhaimin * @Last Modified time: 2020-10-12 15:14:26 * @Description: 模型
*/

<template>
  <div class="pid-model">
    <div id='cesium-pid'>
      <embed :src="svgUrl" type="image/svg+xml" id="svg-tigger"/>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import * as svgPanZoom from '../../../../static/svg-pan-zoom.min.js'
var oldStyle = ''
var prevEle = ''
export default {
  name: 'PidModel',
  data() {
    return {
      svgUrl: require('@/assets/pid-2.svg')
    }
  },
  computed: {
    ...mapState('userInfo', {
      currentPro: state => state.currentPro,
      userInfo: state => state.userInfo
    })
  },
  created() {
  },
  mounted() {
    var svgEmbed = document.getElementById('svg-tigger')
    console.log(svgEmbed)
    svgEmbed.addEventListener('load', () => {
      svgPanZoom('#svg-tigger', {
        preventMouseEventsDefault: false,
        onZoom: (scale) => {
          console.log(scale)
        },
        onPan: (point) => {
          console.log(point)
        }
      })
      var svgCon = svgEmbed.getSVGDocument().querySelector('svg')
      console.log(svgCon.getElementsByTagName('g')[1].getBoundingClientRect())
      svgCon.style = 'cursor: pointer;'
      svgCon.addEventListener('click', (evt) => {
        console.log(evt)
        // svgPan.zoomAtPoint(9.999999446720656, { x: 32.130313873291016, y: 8.444174766540527 })
        if (evt.target !== prevEle) {
          if (prevEle) {
            prevEle.style.fill = oldStyle.fill
            prevEle.style.stroke = oldStyle.stroke
          }
          oldStyle = JSON.parse(JSON.stringify(evt.target.style))
          prevEle = evt.target
          evt.target.style.fill = 'rgb(255,0,0)'
          evt.target.style.stroke = 'rgb(255,0,0)'
        }
      })
    })
  },
  methods: {
  }
}
</script>
<style lang='less' scoped>
.pid-model{
  width: 550px;
  height: 350px;
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
}
#cesium-pid{
  width: 100%;
  height: 100%;
  background: #fff;
  cursor: pointer;
}
#svg-tigger{
  width: 100%;
  height: 100%;
}
</style>
