import { Cartesian3, Matrix4 } from "cesium";
/**
 * 矩阵平移
 * @param {*} matrix 原矩阵
 * @param {*} cartesian3 矩阵偏移量
 */
export default function (matrix, cartesian3) {
  // 矩阵偏移量
  // 笛卡尔坐标转换为 4x4 矩阵
  const translation = Matrix4.fromTranslation(new Cartesian3(cartesian3.x, cartesian3.y, cartesian3.z));
  // 平移矩阵
  // 矩阵乘积
  Matrix4.multiply(matrix, translation, matrix);
}
