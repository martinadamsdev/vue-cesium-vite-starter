<template>
  <div id="v-viewer"></div>
  <div class="btn">
    <div @click="firstPerson">第一人称</div>
    <div @click="thirdPerson">第三人称</div>
    <div @click="freeRoaming">自由漫游</div>
    <!-- <div @click="pathRoaming()">路径漫游</div> -->
    <div @click="resetCamera">解除锁定</div>
  </div>
</template>

<script>
import { onMounted } from "vue";
// import JSZip from "jszip";
import {
  Viewer,
  Cesium3DTileset,
  Matrix4,
  when,
  Transforms,
  ModelAnimationLoop,
  Model,
  Math as CesiumMath,
  Cartesian3,
  Cartographic,
  viewerCesiumInspectorMixin,
  FeatureDetection,
  Color,
  HeadingPitchRoll,
  HeadingPitchRange,
  PolylineGlowMaterialProperty,
  SampledPositionProperty,
  Ellipsoid,
} from "cesium";
import {
  initRoamingModel,
  changeDefaultCamera,
  freeRoaming,
  firstPersonCamera,
  thirdPersonCamera
} from "../utils/roam";
var center;
export default {
  setup() {
    onMounted(async () => {
      window.viewer = init3d();
      // 开发测试工具
      // 发版需要注释掉
      viewer.extend(viewerCesiumInspectorMixin);
      viewer._cesiumWidget._creditContainer.style.display = "none";
      window.model = await initRoamingModel(viewer, {
        position: new Cartesian3.fromDegrees(110, 40, 0),
        url: "model/man.glb",
      });

      model.readyPromise.then((model) => {
        freeRoaming(viewer, model);
        firstPersonCamera(viewer, model);
      });
    });

    /**
     * 初始化 Cesium 3D
     */
    const init3d = () => {
      return new Viewer("v-viewer", {
        shouldAnimate: true, // 动画
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
        // imageryProvider: [],
        navigationHelpButtonViewModel: false,
        orderIndependentTranslucency: false,
        contextOptions: {
          webgl: {
            alpha: true,
          },
        },
      });
    };

    const firstPerson = () => {
      firstPersonCamera(viewer, model);
    }
    const thirdPerson = () => {
      thirdPersonCamera(viewer, model);
    }

    const resetCamera = () => {
      changeDefaultCamera(viewer, true)
    }

    return {
      firstPerson,
      thirdPerson,
      resetCamera
    };
  },
};
</script>

<style lang="scss" scoped>
.btn {
  position: absolute;
  display: flex;
  justify-content: center;
  top: 20px;
  left: calc((100% - 306px) / 2);
  height: 20px;
  padding: 5px;
  line-height: 20px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.71);
}

.btn div {
  padding: 0 5px;
}
</style>
