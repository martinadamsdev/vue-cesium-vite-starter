import { Math as CesiumMath, Cartesian3, Matrix4 } from "cesium";

/**
 * 第三人称视角
 */
export default function (viewer, model) {
  // 获取相机
  const camera = viewer.camera;
  // 获取模型中心点
  const center = Matrix4.multiplyByPoint(
    model.modelMatrix,
    model.boundingSphere.center,
    new Cartesian3()
  );
  console.log(center);
  camera.setView({
    destination: center,
    orientation: {
      heading: CesiumMath.toRadians(90.0),
      pitch: 0.0,
      roll: 0.0,
    },
  });

  camera.moveUp(0.8);
  camera.moveBackward(10);
}
