/**
 * API_INDEX.js
 * ------------------------------------
 * 📌 이 프로젝트의 "이름 정본(正本)"
 * - 파일명
 * - 함수명
 * - 역할
 * ------------------------------------
 * ⚠️ 이 파일에 정의된 이름만 사용한다
 * ⚠️ 새로운 함수/파일이 필요하면 먼저 여기에 추가한다
 */

// ================================
// 📁 FILE INDEX
// ================================
export const FILES = {
  CORE: "global_core.js",
  BOARDS: "boards.js",
  RENDER_BOARD: "renderBoard.js",
  DRAW_UTILS: "drawUtils.js",
  MAIN: "main.js" // (현재 canvas 이벤트, draw 루프 있는 파일)
};

// ================================
// 🧱 BOARD / NUMBER LINE
// ================================
export const BOARD_API = {
  DRAW_BOARD: "drawBoard",

  VALUE_TO_X: "valueToX",
  X_TO_VALUE: "xToValue",

  // ⚠️ 아래는 아직 사용 중이지만 정리 대상
  VALUE_TO_X_CARD: "valueToX_card" // (유지 여부 추후 결정)
};

// ================================
// 🎴 CARD / POINTER
// ================================
export const CARD_API = {
  DRAW_SOFT_POINTER_CARD: "drawSoftPointerCard",
  DRAW_VERTICAL_POINTER: "drawVerticalPointer"

  // ❌ drawSingleCard : 사용 금지 (정의 없음)
};

// ================================
// 🧠 STATE / DEBUG
// ================================
export const DEBUG_API = {
  DEBUG_PANEL: "createDebugPanel",
  UPDATE_PANEL: "updateDebugPanel",
  ENABLE_PANEL_DRAG: "enablePanelDrag"
};

// ================================
// 📐 COORDINATE RULES (문서화용)
// ================================
export const COORD_RULES = {
  CANVAS: "모든 좌표의 최상위 기준",
  BOARD: "board.x, board.y는 canvas 기준",
  CARD: "카드는 반드시 board 기준 좌표에서만 배치",
  FORBIDDEN: [
    "drawSoftPointerCard(ctx, 400, 200, value) // 전역 좌표 금지"
  ]
};
