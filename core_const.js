// core_const.js
// =======================================
// 웹 · 앱 공용 상수 코어
// 값이 절대 변하지 않는 것만 선언
// =======================================

globalThis.CONST = Object.freeze({

  // =========================
  // 이벤트 이름 (브라우저 표준)
  // =========================
  EVENT: Object.freeze({
    POINTER_DOWN: "pointerdown",
    POINTER_MOVE: "pointermove",
    POINTER_UP: "pointerup",
    POINTER_CANCEL: "pointercancel",

    RESIZE: "resize",
    SCROLL: "scroll",
    VISIBILITY_CHANGE: "visibilitychange",
  }),

  // =========================
  // 좌표계 타입
  // =========================
  COORD: Object.freeze({
    WINDOW: "window",
    CANVAS: "canvas",
    LOGIC: "logic",
  }),

  // =========================
  // 앱 모드 (문자 규칙)
  // =========================
  APP_MODE: Object.freeze({
    PLAY: "play",
    EDIT: "edit",
    DEBUG: "debug",
    PAUSE: "pause",
  }),

  // =========================
  // 포인터 타입 (표준)
  // =========================
  POINTER_TYPE: Object.freeze({
    MOUSE: "mouse",
    TOUCH: "touch",
    PEN: "pen",
  }),

  // =========================
  // 방향 / 정렬 규칙
  // =========================
  ALIGN: Object.freeze({
    LEFT: "left",
    CENTER: "center",
    RIGHT: "right",
    TOP: "top",
    MIDDLE: "middle",
    BOTTOM: "bottom",
  }),

  // =========================
  // 숫자 / 한계값
  // =========================
  NUM: Object.freeze({
    EPSILON: 1e-6,
    MAX_SAFE: Number.MAX_SAFE_INTEGER,
    MIN_SAFE: Number.MIN_SAFE_INTEGER,
  }),
 /* export const BOARD_ROLE = {
  NATURAL_CARD: "NATURAL_CARD",
  INTEGER_CARD: "INTEGER_CARD",
  NATURAL_LINE: "NATURAL_LINE",
  INTEGER_LINE: "INTEGER_LINE",
  },
  */

});
