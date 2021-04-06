import { Cartesian3, Matrix4 } from 'cesium'
import firstPersonCamera from './firstPersonCamera'
export default function(viewer, model) {
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp':
        if (e.shiftKey) {
        } else {
          const translation = Matrix4.fromTranslation(new Cartesian3(0.01, 0, 0))
          Matrix4.multiply(model.modelMatrix, translation, model.modelMatrix)
          firstPersonCamera(viewer, model)
        }
        break
      case 'ArrowLeft':
        if (e.shiftKey) {
        } else {
          const translation = Matrix4.fromTranslation(new Cartesian3(0, 0.01, 0))
          Matrix4.multiply(model.modelMatrix, translation, model.modelMatrix)
          firstPersonCamera(viewer, model)
        }
        break
      case 'ArrowRight':
        if (e.shiftKey) {
        } else {
          const translation = Matrix4.fromTranslation(new Cartesian3(0, -0.01, 0))
          Matrix4.multiply(model.modelMatrix, translation, model.modelMatrix)
          firstPersonCamera(viewer, model)
        }
        break
      case 'ArrowDown':
        if (e.shiftKey) {
        } else {
          const translation = Matrix4.fromTranslation(new Cartesian3(-0.01, 0, 0))
          Matrix4.multiply(model.modelMatrix, translation, model.modelMatrix)
          firstPersonCamera(viewer, model)
        }
        break
      default:
    }
  })
}
