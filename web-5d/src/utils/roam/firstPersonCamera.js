import { Math as CesiumMath, Cartesian3, Matrix4 } from 'cesium'
import changeDefaultCamera from './changeDefaultCamera'
/**
 * 第一人称视角
 */
export default function(viewer, model) {
  // 禁止相机默认行为
  changeDefaultCamera(viewer, false)
  // 获取相机
  const camera = viewer.camera
  // 获取模型中心点
  const center = Matrix4.multiplyByPoint(
    model.modelMatrix,
    model.boundingSphere.center,
    new Cartesian3()
  )
  // 设置相机位置
  camera.setView({
    destination: center,
    orientation: {
      heading: CesiumMath.toRadians(90.0),
      pitch: 0.0,
      roll: 0.0
    }
  })

  // camera.lookAt(center, new Cartesian3(0.0, 0.0, 0.000000001))
  // 相机向上移动
  camera.moveUp(0.8)
  // 相机向前移动
  camera.moveForward(0.5)
}
