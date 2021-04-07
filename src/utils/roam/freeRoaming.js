import updatePosition from "./updatePosition";
import firstPersonCamera from "./firstPersonCamera";
import thirdPersonCamera from "./thirdPersonCamera";
import changeDefaultCamera from "./changeDefaultCamera";
import keyboard from "keyboardjs";

export default function (viewer, model, mode) {
  // 禁止相机默认行为
  changeDefaultCamera(viewer.scene.screenSpaceCameraController, false);
  // 清除键盘事件
  keyboard._listeners = [];
  // 绑定键盘事件
  keyboard.bind(["up", "down", "left", "right"], keyBoard);
  // 第一人称
  if (mode === 1) {
    firstPersonCamera(viewer, model);
  }
  // 第三人称
  if (mode === 3) {
    thirdPersonCamera(viewer, model);
  }
  /**
   * 键盘事件
   * @param {*} e
   */
  function keyBoard(e) {
    switch (e.key) {
      case "ArrowUp":
        if (e.shiftKey) {
        } else {
          updatePosition(viewer, model, mode, { x: 0.5, y: 0.0, z: 0.0 });
        }
        break;
      case "ArrowLeft":
        if (e.shiftKey) {
        } else {
          updatePosition(viewer, model, mode, { x: 0.0, y: 0.5, z: 0.0 });
        }
        break;
      case "ArrowRight":
        if (e.shiftKey) {
        } else {
          updatePosition(viewer, model, mode, { x: 0.0, y: -0.5, z: 0.0 });
        }
        break;
      case "ArrowDown":
        if (e.shiftKey) {
        } else {
          updatePosition(viewer, model, mode, { x: -0.5, y: 0.0, z: 0.0 });
        }
        break;
    }
  }
}
