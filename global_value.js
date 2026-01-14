// global_value.js
globalThis.GLOBAL = globalThis.GLOBAL || {
  app: {
    mode: "play",
  },

  pointer: {
    winX: 0,
    winY: 0,
    canvasX: 0,
    canvasY: 0,
  },

  game: {
    currentCount: null, // global_value.js
    targetValue: null,
    result: null,
    phase: "playing"        // 플레이 중
          | "roundResult"    // 이번 판 결과 표시
          | "askContinue"    // 계속 진행 여부 질문
          | "finished",    // 시즌 종료 (전체 결과)
  },

  canvas: {
    width: 0,
    height: 0,
  },

  // ⭐ 보더 관련 전역 상태 (여기에 추가)
  board: {
    type: null,        // CONST.BOARD_TYPE.BOARD_4
    instance: null,    // CompositeBoard4 인스턴스
  },
  debug: {
    hitBoard: null, 
    boardResults: {},   // 마지막으로 토큰이 올라간 보더
  },

  tokens: [],
  // global_value.js (GLOBAL 안에 추가)
  // global_value.js (session 안에 추가)
  session: {
  round: 0,            // 지금까지 진행한 판 수
  totalTries: 0,       // 누적 도전 횟수
  roundTries: [],      // 판별 도전 횟수 기록
  roundScores: [],     // 판별 정답 개수 기록
},

}