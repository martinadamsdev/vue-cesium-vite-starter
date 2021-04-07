import { Math as CesiumMath, Cartesian3, Matrix4 } from "cesium";
import changeDefaultCamera from "./changeDefaultCamera";
/**
 * 第一人称视角
 */
export default function (viewer, model) {
  // 禁止相机默认行为
  changeDefaultCamera(viewer.scene.screenSpaceCameraController, false);
  // 获取模型中心点矩阵
  const center = Matrix4.multiplyByPoint(
    model.modelMatrix,
    model.boundingSphere.center,
    new Cartesian3()
  );
  console.log(center);
  // 设置相机位置
  viewer.camera.setView({
    destination: center,
    orientation: {
      heading: CesiumMath.toRadians(90.0),
      pitch: 0.0,
      roll: 0.0,
    },
  });
  // 相机向上移动
  viewer.camera.moveUp(0.8);
  // 相机向前移动
  viewer.camera.moveForward(0.5);
}
