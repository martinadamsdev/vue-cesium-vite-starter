/**
 * 更改相机默认设置
 */
export default function(cameraController, status) {
  // disable the default event handlers
  cameraController.enableRotate = status
  cameraController.enableTranslate = status
  cameraController.enableZoom = status
  cameraController.enableTilt = status
  cameraController.enableLook = status
}
