<template>
  <div id="v-viewer"></div>
  <div class="btn">
    <div @click="firstPersonCamera()">第一人称</div>
    <div @click="thirdPersonCamera">第三人称</div>
    <div @click="freeRoaming">自由漫游</div>
    <div @click="pathRoaming()">路径漫游</div>
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
var center;
export default {
  setup() {
    onMounted(async () => {
      window.viewer = init3d();
      window.camera = viewer.camera;
      // 开发测试工具
      // 发版需要注释掉
      viewer.extend(viewerCesiumInspectorMixin);
      viewer._cesiumWidget._creditContainer.style.display = "none";
      const roam = await initRoamingModel();
      when(roam.readyPromise).then((model) => {
        model.activeAnimations.addAll({
          multiplier: 0.5,
          loop: ModelAnimationLoop.REPEAT,
        });

        // 获取模型中心点
        center = Matrix4.multiplyByPoint(
          model.modelMatrix,
          model.boundingSphere.center,
          new Cartesian3()
        );
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

    /**
     * 初始化漫游模型
     */
    const initRoamingModel = async () => {
      const modelMatrix = Transforms.eastNorthUpToFixedFrame(
        Cartesian3.fromDegrees(118, 40, 0.0)
      );

      return await viewer.scene.primitives.add(
        Model.fromGltf({
          url: "/model/man.glb",
          modelMatrix,
          // minimumPixelSize: 0.0,
        })
      );
    };

    /**
     * 第一人称视角
     */
    const firstPersonCamera = () => {
      openOrCloseDefaultCamera(false);
      camera.setView({
        destination: center,
        orientation: {
          heading: CesiumMath.toRadians(90.0),
          pitch: 0.0,
          roll: 0.0,
        },
      });

      camera.moveUp(0.8);
      camera.moveForward(0.5);
    };

    /**
     * 第三人称视角
     */
    const thirdPersonCamera = () => {
      openOrCloseDefaultCamera(false);
      camera.setView({
        destination: center,
        orientation: {
          heading: CesiumMath.toRadians(90.0),
          pitch: 0.0,
          roll: 0.0,
        },
      });

      camera.moveUp(20);
      camera.moveBackward(10);
    };

    /**
     * 相机默认控制
     */
    const openOrCloseDefaultCamera = (status) => {
      const cameraController = viewer.scene.screenSpaceCameraController;
      // disable the default event handlers
      cameraController.enableRotate = status;
      cameraController.enableTranslate = status;
      cameraController.enableZoom = status;
      cameraController.enableTilt = status;
      cameraController.enableLook = status;
    };

    /**
     * 自由漫游
     */
    const freeRoaming = () => {
      // 键盘事件监听
      //   document.addEventListener("keydown", (e) => {
      //     switch (e.key) {
      //       case "ArrowUp":
      //         if (e.shiftKey) {
      //         } else {
      //         }
      //         break;
      //       case "ArrowLeft":
      //         if (e.shiftKey) {
      //         } else {
      //         }
      //         break;
      //       case "ArrowRight":
      //         if (e.shiftKey) {
      //         } else {
      //         }
      //         break;
      //       case "ArrowDown":
      //         if (e.shiftKey) {
      //         } else {
      //         }
      //         break;
      //       default:
      //     }
      //   });
    };

    /**
     * 路径漫游
     */
    const pathRoaming = () => {
      // 加载路径数据
      // 
    }

    return {
      firstPersonCamera,
      thirdPersonCamera,
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
