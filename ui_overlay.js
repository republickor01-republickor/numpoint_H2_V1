// ui_overlay.js

export function drawOverlay(ctx, canvas, state) {
  const PLAY_AREA_Y = 115;

  ctx.save();

  // 기준선
  ctx.strokeStyle = "#ccc";
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, PLAY_AREA_Y);
  ctx.lineTo(canvas.width, PLAY_AREA_Y);
  ctx.stroke();

  // 설명 텍스트
  ctx.fillStyle = "#666";
  ctx.font = "15px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("아래의 점의 위치를 찾아라", 550, 60);
 
  
  ctx.fileStyle = "#732";
  ctx.font = "15px";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("정수 자연수 => 칸안에 두세요", 30, 50);
  ctx.fillText("무리수,정수가 아닌 유리수", 30, 70);
  ctx.fillText("수직선에 닿아야 해요 ", 30, 90);
  ctx.restore();



}

export function drawJudgeResult(ctx, canvas) {
  const result = GLOBAL.game.result;
  if (!result || !result.visible) return;

  const bubbleW = 300;
  const bubbleH = 80;
  const rect = canvas.getBoundingClientRect();
  const x = rect.width / 2 - bubbleW / 2;
  //const x=rect.width/2;
  const y = 40;

  drawSpeechBubble(
    ctx,
    x,
    y,
    bubbleW,
    bubbleH,
    result.ok ? "정답입니다" : "다시 생각해보세요",
    result.ok
  );
}


//// 토큰당 나오는 결과값
function drawSpeechBubble(ctx, cx, cy, w, h, text, ok) {
  const r = 16;
  const x = cx;
  const y=cy;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + w / 2 + 10, y + h);
  ctx.lineTo(x + w / 2, y + h + 12); // 꼬리
  ctx.lineTo(x + w / 2 - 10, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();

  ctx.fillStyle = ok ? "#eafaf1" : "#fdecea";
  ctx.fill();
  ctx.strokeStyle = ok ? "#2ecc71" : "#e74c3c";
  ctx.stroke();

  ctx.fillStyle = ok ? "#2ecc71" : "#e74c3c";
  ctx.font = "bold 22px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + w / 2, y + h / 2);
}
/*
export function drawScoreBoard(ctx) {
  const { tries, maxTries } = GLOBAL.game;
  const canvas = ctx.canvas;
  const startX = 40;
  const y = 50;

  for (let i = 0; i < maxTries; i++) {
    ctx.fillStyle = i < tries ? "#555" : "#ddd";
    ctx.beginPath();
    ctx.arc(startX + i * 22, y, 7, 0, Math.PI * 2);
    ctx.fill();
  }
   // 숫자 표시 (⭐ 추가)
  ctx.fillStyle = "#666";
  ctx.font = "14px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const textX = startX + maxTries * 22 + 10;
  ctx.fillText(`${tries} / ${maxTries}`, textX, y);
  // 판별 점수 리스트
  ctx.font = "16px Arial";
  ctx.fillStyle = "#444";

  let startY = 360;



}
*/
export function drawCurrentValue(ctx) {
  const value = GLOBAL.game.result?.value;
  if (value == null) return;
  const canvas = ctx.canvas; // ⭐ 핵심
  const rect = canvas.getBoundingClientRect();

  ctx.fillStyle = "#333";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  ctx.fillText(`현재 값: ${value}`, rect.width / 2, 20);
}
export function drawGameResult(ctx) {
  if (!GLOBAL.game.roundFinished) return;

  const canvas = ctx.canvas;

  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = "center";
  ctx.fillStyle = "#333";

  ctx.font = "bold 28px Arial";
  ctx.fillText("게임 결과", canvas.width / 2, 120);

  ctx.font = "18px Arial";
  ctx.fillText(`총 판 수: ${GLOBAL.session.maxRound}판`, canvas.width / 2, 180);
  ctx.fillText(`총 도전 횟수: ${GLOBAL.session.totalTries}`, canvas.width / 2, 220);
  ctx.fillText(
    `평균 도전 횟수: ${getAverageTries()}회`,
    canvas.width / 2,
    260
  );

  ctx.font = "bold 20px Arial";
  let msg = "아주 잘했어요!";
  const avg = Number(getAverageTries());
  if (avg > 4) msg = "조금 더 생각해볼 수 있어요 🙂";
  if (avg > 6) msg = "다시 한 번 도전해볼까요? 💪";

  ctx.fillText(msg, canvas.width / 2, 320);

  // drawGameResult 안, 아래쪽에 추가
  ctx.font = "16px Arial";
  ctx.fillStyle = "#444";

  let startY = 360;

  GLOBAL.session.roundScores.forEach((score, index) => {
    ctx.fillText(
      `${index + 1}판 : ${score} / 5`,
      canvas.width / 2,
      startY + index * 24
    );
  });

  ctx.restore();
}
// 좌측 상단 토큰 개수 표시
// 좌측 상단 토큰 개수 표시 (정답 버전)
export function drawTokenDots(ctx) {
  const total = GLOBAL.tokens.length;
  const correct = GLOBAL.game.correctCount;
  const remaining = total - correct;

  const startX = 40;
  const y = 30;
  const gap = 16;
  const radius = 6;

  ctx.save();

  let x = startX;

  // 🔴 맞힌 토큰
  for (let i = 0; i < correct; i++) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#e74c3c";
    ctx.fill();
    x += gap;
  }

  // 🔵 아직 남은 토큰
  for (let i = 0; i < remaining; i++) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#3498db";
    ctx.fill();
    x += gap;
  }

  ctx.restore();
}

export function drawNextRoundHint(ctx) {
  if (
    GLOBAL.game.phase !== "roundResult" &&
    GLOBAL.game.phase !== "askContinue"
  ) return;


  const canvas = ctx.canvas;

  ctx.save();
  ctx.fillStyle = "#555";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const rect = canvas.getBoundingClientRect();
  ctx.fillText(
    "클릭하면 다음 판으로 넘어갑니다",
    rect.width / 2,
    140
  );

  ctx.restore();
}






