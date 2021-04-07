<template>
  <div id="v-viewer"></div>
  <div class="btn">
    <div @click="freeRoam(1)">第一人称</div>
    <div @click="freeRoam(3)">第三人称</div>
    <div @click="freeRoam(1)">自由漫游</div>
    <div>路径漫游</div>
    <div @click="resetCamera">解除锁定</div>
    <div>
      <a
        aria-label="martinageradams"
        title="GitHub"
        href="https://github.com/martinageradams/vue-cesium-vite-app"
      >
        <svg height="20" version="1.1" width="35" aria-hidden="true">
          <text x="0" y="16" fill="black">Star</text>
        </svg>
        <svg
          height="20"
          viewBox="0 0 16 16"
          version="1.1"
          width="20"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          ></path>
        </svg>
      </a>
    </div>
    <div>
      <a
        aria-label="martinageradams"
        title="Gitee"
        href="https://gitee.com/martinageradams/vue-cesium-vite-app"
        ><svg height="20" version="1.1" width="35" aria-hidden="true">
          <text x="0" y="16" fill="black">国内</text>
        </svg></a
      >
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue";
// import JSZip from "jszip";
import {
  Viewer,
  // Cesium3DTileset,
  // Matrix4,
  // when,
  // Transforms,
  // ModelAnimationLoop,
  // Model,
  // Math as CesiumMath,
  Cartesian3,
  // Cartographic,
  // viewerCesiumInspectorMixin,
  // FeatureDetection,
  // Color,
  // HeadingPitchRoll,
  // HeadingPitchRange,
  // PolylineGlowMaterialProperty,
  // SampledPositionProperty,
  // Ellipsoid,
} from "cesium";
import {
  initRoamingModel,
  changeDefaultCamera,
  freeRoaming,
} from "../utils/roam";
var center;
export default {
  setup(props, context) {
    console.log(props.data, context.data);
    onMounted(async () => {
      window.viewer = init3d();
      // 开发测试工具
      // 发版需要注释掉
      // viewer.extend(viewerCesiumInspectorMixin);
      viewer._cesiumWidget._creditContainer.style.display = "none";
      window.model = await initRoamingModel(viewer, {
        position: new Cartesian3.fromDegrees(110, 40, 0),
        url: "model/man.glb",
      });

      model.readyPromise.then((model) => {
        // 默认
        // 第一人称自由漫游
        freeRoam(1)
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

    const freeRoam = (mode) => {
      freeRoaming(viewer, model, mode);
    };

    // const pathRoam = (mode) => {
    //   freeRoaming(viewer, model, mode);
    // };

    const resetCamera = () => {
      changeDefaultCamera(viewer.scene.screenSpaceCameraController, true)
    }

    return {
      freeRoam,
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
  left: calc((100% - 416px) / 2);
  height: 20px;
  padding: 5px;
  line-height: 20px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.71);
}

.btn div {
  padding: 0 5px;
  cursor: pointer;
}
</style>
