import updatePosition from "./updatePosition";
import firstPersonCamera from "./firstPersonCamera";
import thirdPersonCamera from "./thirdPersonCamera";
import keyboard from "keyboardjs";
export default function (viewer, model, mode) {
  keyboard._listeners = [];
  console.log(window);
  keyboard.bind(["up", "down", "left", "right"], keyBoard);
  if (mode === 1) {
    firstPersonCamera(viewer, model);
  }

  if (mode === 3) {
    thirdPersonCamera(viewer, model);
  }

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
      default:
    }
  }

  function keyBoard2(e) {
    // document.removeEventListener("keydown", keyBoard1, true);
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
      default:
    }
  }
}
