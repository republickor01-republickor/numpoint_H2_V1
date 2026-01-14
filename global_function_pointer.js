// core_function_point.js
// =======================================
// Pointer / Coordinate Engine (Mobile OK)
// window → canvas 좌표 변환 전담
// =======================================

let canvas = null;
let canvasRect = null;

// 초기화
function initPointer(targetCanvas) {
  canvas = targetCanvas;
  updateCanvasRect();

  // 모바일 회전 / 리사이즈 대응
  window.addEventListener("resize", updateCanvasRect);
}

// rect 갱신
function updateCanvasRect() {
  if (!canvas) return;
  canvasRect = canvas.getBoundingClientRect();
}

// 포인터 좌표 갱신 (pointer event 전제)
function updatePointerPosition(e) {
  if (!canvasRect) updateCanvasRect();

  // =========================
  // 1. window 기준
  // =========================
  GLOBAL.pointer.winX = e.clientX;
  GLOBAL.pointer.winY = e.clientY;

  // =========================
  // 2. canvas 기준
  // =========================
  const inside =
    e.clientX >= canvasRect.left &&
    e.clientX <= canvasRect.right &&
    e.clientY >= canvasRect.top &&
    e.clientY <= canvasRect.bottom;

  GLOBAL.pointer.insideCanvas = inside;

  if (inside) {
    GLOBAL.pointer.canvasX = e.clientX - canvasRect.left;
    GLOBAL.pointer.canvasY = e.clientY - canvasRect.top;
  } else {
    GLOBAL.pointer.canvasX = null;
    GLOBAL.pointer.canvasY = null;
  }
}

// pointer capture (모바일 끊김 방지 핵심)
function capturePointer(e) {
  if (canvas && e.pointerId != null) {
    canvas.setPointerCapture(e.pointerId);
  }
}

function releasePointer(e) {
  if (canvas && e.pointerId != null) {
    canvas.releasePointerCapture(e.pointerId);
  }
}

// 전역 노출
globalThis.PointerEngine = {
  init: initPointer,
  updateRect: updateCanvasRect,
  update: updatePointerPosition,
  capture: capturePointer,
  release: releasePointer,
};
