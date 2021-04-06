/**
 * 更改相机默认设置
 */
export default function(viewer, status) {
  const cameraController = viewer.scene.screenSpaceCameraController
  // disable the default event handlers
  // cameraController.enableRotate = status
  cameraController.enableTranslate = status
  cameraController.enableZoom = status
  cameraController.enableTilt = status
  cameraController.enableLook = status
}
