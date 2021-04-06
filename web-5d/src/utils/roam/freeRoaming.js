import { Cartesian3, Matrix4 } from 'cesium'
import firstPersonCamera from './firstPersonCamera'
export default function(viewer, model) {
  console.log(model, '自由漫游模式')
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp':
        if (e.shiftKey) {
        } else {
          const translation = Matrix4.fromTranslation(new Cartesian3(1, 0, 0))
          Matrix4.multiply(model.modelMatrix, translation, model.modelMatrix)
        }
        break
      case 'ArrowLeft':
        if (e.shiftKey) {
        } else {
          const translation = Matrix4.fromTranslation(new Cartesian3(0, 1, 0))
          Matrix4.multiply(model.modelMatrix, translation, model.modelMatrix)
        }
        break
      case 'ArrowRight':
        if (e.shiftKey) {
        } else {
          const translation = Matrix4.fromTranslation(new Cartesian3(0, -1, 0))
          Matrix4.multiply(model.modelMatrix, translation, model.modelMatrix)
        }
        break
      case 'ArrowDown':
        if (e.shiftKey) {
        } else {
          const translation = Matrix4.fromTranslation(new Cartesian3(-1, 0, 0))
          Matrix4.multiply(model.modelMatrix, translation, model.modelMatrix)
        }
        break
      default:
    }
  })

  firstPersonCamera(viewer, model)
}
