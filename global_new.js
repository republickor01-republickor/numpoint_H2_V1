/**
 * global_new.js
 * ------------------------------------
 * ✅ FINAL STABLE VERSION (PC + MOBILE)
 *
 * - 기존 설계 유지
 * - Pointer 기반 통합
 * - 모바일 드래그 끊김 방지
 * - canvas 비율 안정화
 */
/*
export const JudgeRegistry = {
  NAT_LINE: judgeInteger_line,
  INT_LINE: judgeInteger_line,
  RATIONAL_LINE: judgeInteger_line,        // 유리수 전체
  RATIONAL_FINITE_LINE: judgeRationalFinite,   // 유한소수
  RATIONAL_INFINITE_LINE: judgeRationalInfinite, // 무한소수
  IRRATIONAL_LINE: judgeIrrational,        // 무리수
};

*/

//import { boards } from "./boards.js";
//import { drawBoard, valueToX, xToValue } from "./renderBoard.js";
//import { drawVerticalPointer, drawSoftPointerCard } from "./drawUtils.js";
import "./global_value.js";
import "./panel.js";
import "./core_const.js";
import "./global_function_pointer.js";
import { CompositeBoard } from "./compositeBoard.js";
import { JudgeRegistry } from "./judgeRegistry.js";
import {
  drawOverlay,
  drawJudgeResult,
  drawNextRoundHint,
  drawCurrentValue,
  drawTokenDots,
  drawGameResult,
} from "./ui_overlay.js";
import { generateTokensForCurrentBoards } from "./tokenGenerator.js";
import SoundManager from "./soundManager.js";

console.log("BOOT ok")
/* =====================================================
   Canvas & Context
===================================================== */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

/* =====================================================
   Canvas Resize (PC / Mobile 공통)
===================================================== */
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

console.log(canvas.width, canvas.height);

/* =====================================================
   Board Setup
===================================================== */
let y = 120;
const gap = 5;
const min_Start = -10
const max_Start = 10;
GLOBAL.board.instance = new CompositeBoard([
  {id:"int_card", kind:"card", min: min_Start, max:max_Start, x:50, y:y, width:700, height:50, judgeId:"INT_CARD"},
  y += 50 + gap,
  //중2용 start
  //{ id:"INT_LINE", kind:"numberline", min: min_Start, max:max_Start, x:50, y:y, width:700, height:50, judgeId:"RATIONAL_FINITE_LINE" },
  //y += 50 + gap,
  //{ id:"lin_a", kind:"sub_num", min: min_Start, max:max_Start, x:50, y:y, width:700, height:5},
  //y += 0 + gap,
  //{ id:"INT_LINE1", kind:"numberline", min: min_Start, max:max_Start, x:50, y:y, width:700, height:50, judgeId:"RATIONAL_REPEAT_LINE" },
  //y += 50 + gap,
  //{ id:"lin_a1", kind:"sub_num", min: min_Start, max:max_Start, x:50, y:y, width:700, height:5},
  // 중2 end
  // 초등 중1용
  //{ id:"INT_LINE", kind:"numberline", min: min_Start, max:max_Start, x:50, y:y, width:700, height:80, judgeId:"INT_LINE" },
  //y += 80 + gap,
  //{ id:"lin_a", kind:"sub_num", min: min_Start, max:max_Start, x:50, y:y, width:700, height:5, judgeId:"NAT_CARD"},
  // 중3 무리수 ~~
  { id:"INT_LINE", kind:"numberline", min: min_Start, max:max_Start, x:50, y:y, width:700, height:50, judgeId:"INT_LINE" },
  y += 50 + gap,
  { id:"lin_a", kind:"sub_num", min: min_Start, max:max_Start, x:50, y:y, width:700, height:5},
  y += 0 + gap,
  { id:"IRRATIONAL_LINE", kind:"numberline", min: min_Start, max:max_Start, x:50, y:y, width:700, height:50, judgeId:"IRRATIONAL_LINE" },
  y += 50 + gap,
  { id:"lin_a1", kind:"sub_num", min: min_Start, max:max_Start, x:50, y:y, width:700, height:5},
  
  // 중3~ 무리수 end
]);

/* =====================================================
   Game State
===================================================== */
GLOBAL.game = {
  phase: "playing",
  correctCount : 0,
  result: null,
  targetValue: false,
};

let activeToken = null;

/* =====================================================
   Pointer Engine Init
===================================================== */
PointerEngine.init(canvas);

/* =====================================================
   Pointer Events (통합, 모바일 안정)
===================================================== */
canvas.addEventListener(CONST.EVENT.POINTER_DOWN, (e) => {
 
   // ⭐ B 설계 기준 다음 판 트리거
// ⭐ 다음 판 트리거 (최종본)
  switch (GLOBAL.game.phase) {

    case "roundResult":
      // 결과를 본 뒤 → 계속할지 묻기
      GLOBAL.game.phase = "askContinue";
      startRound();      // 바로 다음 판
    //  draw();
      return;

    //case "askContinue":
      // 버튼 판별 (예시)
    //  if (clickedContinue(e)) {
   //     startRound(); // 다음 판
    //  } else if (clickedEnd(e)) {
   //     GLOBAL.game.phase = "finished";
    //  }
    //  draw();
    //  return;

    case "finished":
      // 시즌 종료 화면
      return;

    case "playing":
      // 기존 토큰 처리 로직
      break;
  }
  canvas.setPointerCapture(e.pointerId);
  PointerEngine.update(e);
//
  const x = GLOBAL.pointer.canvasX;
  const y = GLOBAL.pointer.canvasY;

  for (let i = GLOBAL.tokens.length - 1; i >= 0; i--) {
    const token = GLOBAL.tokens[i];
    if (token.used) continue;   // 정답 토큰 잠금

    if (token.contains(x, y)) {
      activeToken = token;
      GLOBAL.game.activeToken = activeToken;
      activeToken.pointerDown(x, y);
      GLOBAL.game.result = null;
      break;
    }
    console.log("token global_new 162",token.raw)

    
  }
  //console.log("Token",GLOBAL.tokens);
  draw();
});

canvas.addEventListener(CONST.EVENT.POINTER_MOVE, (e) => {
  if (!activeToken) return;

  PointerEngine.update(e);
  if (!GLOBAL.pointer.insideCanvas) return;

  activeToken.pointerMove(
    GLOBAL.pointer.canvasX,
    GLOBAL.pointer.canvasY
  );

  draw();
});

canvas.addEventListener(CONST.EVENT.POINTER_UP, (e) => {
  if (!activeToken) return;
  if (GLOBAL.game.phase !== "playing") {
  activeToken = null;
  return;
  }




  canvas.releasePointerCapture(e.pointerId);
  PointerEngine.update(e);

  activeToken.pointerUp();

  const board = findBoardAtToken(activeToken, GLOBAL.board.instance);
  
  ///////////////////12/24///////////
  let ok = false;
  if (board) {
    const judgeFn = JudgeRegistry[board.judgeId];
    if(!judgeFn) return false;
    ok = judgeFn({ token: activeToken, board });
    console.log("globasl_new.js 205",ok);

    GLOBAL.game.result = {
      ok,
      raw: activeToken.raw,
      value: activeToken.value,
      visible: true,
    };
    if (ok) {
    // 정답일 때만 토큰 소모
    SoundManager.playCorrect();   // ✅ 정답 소리
    activeToken.used = true;
    GLOBAL.game.correctCount +=1;
    } else {
    // 오답은 다시 사용 가능
    SoundManager.playWrong();     // ❌ 오답 소리
    activeToken.used = false;
    }
  }
  
  // ⭐⭐⭐ B 설계 핵심 ⭐⭐⭐
  

  // 모든 토큰 정답 → 판 종료
  if (GLOBAL.game.correctCount === GLOBAL.tokens.length) {
    GLOBAL.game.phase = "roundResult";
  }


  activeToken = null;
  GLOBAL.game.activeToken = null;
 
  console.log(
  "PHASE:", GLOBAL.game.phase,
  "CORRECT:", GLOBAL.game.correctCount,
  "TOKENS:", GLOBAL.tokens.length
  );


  draw();
});

canvas.addEventListener(CONST.EVENT.POINTER_CANCEL, (e) => {
  if (e.pointerId != null) {
    canvas.releasePointerCapture(e.pointerId);
  }
  activeToken = null;
});

/* =====================================================
   Draw Loop
===================================================== */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  GLOBAL.board.instance.render(ctx);
  GLOBAL.tokens.forEach(token => {
    token.draw(ctx);
    token.drawBalloon(ctx);
  });
  //drawOverlay(ctx, canvas, { activeToken });


  drawCurrentValue(ctx); 
  drawTokenDots(ctx);

  drawJudgeResult(ctx, canvas);
  drawNextRoundHint(ctx);
  drawGameResult(ctx)
  drawOverlay(ctx, canvas, { activeToken });
  //drawStatusPanel(ctx);
  

}

/* =====================================================
   Board Hit Test
===================================================== */
function findBoardAtToken(token, compositeBoard) {
  const { x, y } = token.getCenter();
  for (const board of compositeBoard.boards) {
    if (
      x >= board.x &&
      x <= board.x + board.width &&
      y >= board.y &&
      y <= board.y + board.height
    ) {
      return board;
    }
  }
  return null;
}

/* =====================================================
   Round Control
===================================================== */
function startRound() {

  activeToken = null;

  GLOBAL.game.activeToken = null;
  GLOBAL.game.phase = "playing";
  GLOBAL.game.result = null;
  GLOBAL.game.correctCount = 0;
  
  // 토큰 완전 교체
  GLOBAL.tokens.length = 0;

  

  const newTokens = generateTokensForCurrentBoards(
    GLOBAL.board.instance,
    5, /// 토큰의 갯수 생성 이것은 개발자가 정의 하기로 한다.
  );
  
  newTokens.forEach(t => {
    t.used = false;
  });

  GLOBAL.tokens.push(...newTokens);

  draw();
}
/*function clickedContinue(e) {
  return true; // 항상 계속
}

function clickedEnd(e) {
  return false;
}
  */


/* =====================================================
   Init
===================================================== */
startRound();

draw();
