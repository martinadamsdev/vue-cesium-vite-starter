import matrixTranslation from "./matrixTranslation";
import firstPersonCamera from "./firstPersonCamera";
import thirdPersonCamera from "./thirdPersonCamera";

export default function(viewer, model, mode, cartesian3) {
  // 矩阵平移
  matrixTranslation(model.modelMatrix, cartesian3);
  
  if (mode === 1) {
    firstPersonCamera(viewer, model);
  }

  if (mode === 3) {
    thirdPersonCamera(viewer, model);
  }
}