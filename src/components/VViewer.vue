<template>
  <div id="v-viewer"></div>
</template>

<script>
import { onMounted } from "vue";
import { Viewer } from "cesium";

export default {
  setup() {
    onMounted(() => {
      window.viewer = new Viewer("v-viewer", {
        animation: false, //是否显示左下角的仪表盘
        baseLayerPicker: false, //是否显示图层选择器按钮，右上角那个地图图标
        fullscreenButton: false, //是否显示全屏按钮
        vrButton: false, //是否显示VR按钮
        geocoder: false, //是否显示搜索按钮
        homeButton: false, //是否显示主页按钮
        infoBox: false, //是否显示提示信息
        sceneModePicker: false, //是否显示右上角的模式切换按钮
        selectionIndicator: false, //是否显示选取指示器组件
        timeline: false, //是否显示下边的时间轴
        navigationHelpButton: false, //是否显示右上角的帮助按钮
        navigationInstructionsInitiallyVisible: true, //是不显示导航
        scene3DOnly: true, //是否指定仅为三维模式，全部使用三维模式可节约GPU资源
        // imageryProvider: new UrlTemplateImageryProvider(),
        navigationHelpButtonViewModel: false,
        // orderIndependentTranslucency: false,
        // contextOptions: {
        //   webgl: {
        //     alpha: true,
        //   },
        // },
        // // maximumRenderTimeChange: Infinity,
        // // sceneMode: this.Cesium.SceneMode.COLUMBUS_VIEW,
        // requestRenderMode: false,
      });
    });
  },
};
</script>
