import { Transforms, Cartesian3, Model, ModelAnimationLoop } from 'cesium'

/**
 * 初始化漫游模型
 * @param {Object} viewer
 * @param {Object} options
 * @returns
 */
export default function(viewer, options) {
  const x = options.position.x
  const y = options.position.y
  const z = options.position.z
  const url = options.url
  const modelMatrix = Transforms.eastNorthUpToFixedFrame(
    new Cartesian3(x, y, z) // options.position
  )

  console.log(z)

  const model = viewer.scene.primitives.add(
    Model.fromGltf({
      url,
      modelMatrix
    })
  )
  model.readyPromise.then((model) => {
    model.activeAnimations.addAll({
      multiplier: 1.5,
      loop: ModelAnimationLoop.REPEAT
    })
  })

  return model
}
