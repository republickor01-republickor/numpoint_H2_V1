// renderBoard.js
/**
 * renderBoard.js
 * ------------------------------------
 * 📐 BOARD RENDER & COORDINATE
 *
 * - board 데이터를 받아 canvas에 "보드"를 그린다
 * - value ↔ canvas 좌표 변환을 담당한다
 *
 * 포함:
 * - drawBoard(ctx, board)
 * - drawNumberLine(ctx, board)
 * - drawCard(ctx, board)
 * - valueToX / xToValue
 *
 * ❌ 금지
 * - 카드(UI 말풍선) 그리기
 * - 상태(State) 접근
 * - 이벤트 처리
 *
 * ⚠️ 규칙
 * - 모든 좌표는 board.x / board.y 기준
 */
//
// 이곳이 처음으로 불린다. 
//
export function drawBoard(ctx, board) {
  if (board.kind === "card") {
    drawCard(ctx, board);
  } else if (board.kind === "numberline") {
    drawNumberLine(ctx, board);
  } else if (board.kind === "sub_num"){
    draw_sub_Card(ctx, board);
  }
}

const NUMBERLINE_LABELS = {
  RATIONAL_FINITE_LINE: "유한소수",
  RATIONAL_REPEAT_LINE: "순환소수",
  INT_LINE: "정수가 아닌 유리수",
  IRRATIONAL_LINE: "무리수",
};




/////////////////===========
// 🎴 둥근 뒤집힌 오각형 카드 (외곽선 없음)/// 카드 스타일
//============================
function drawPentagonCard(ctx, cx, cy, w, h) {
  const top = cy - h / 2;
  const bottom = cy + h / 2;
  const left = cx - w / 2;
  const right = cx + w / 2;

  const neck = h * 0.22; // 위쪽 뾰족함
  const r = Math.min(w, h) * 0.12; // 둥근 정도

  ctx.beginPath();

  // 위 꼭짓점
  ctx.moveTo(cx, top - neck * 0.6);

  // 오른쪽 위
  ctx.quadraticCurveTo(right, top, right, top + r);

  // 오른쪽 아래
  ctx.lineTo(right, bottom - r);
  ctx.quadraticCurveTo(right, bottom, right - r, bottom);

  // 왼쪽 아래
  ctx.lineTo(left + r, bottom);
  ctx.quadraticCurveTo(left, bottom, left, bottom - r);

  // 왼쪽 위
  ctx.lineTo(left, top + r);
  ctx.quadraticCurveTo(left, top, cx, top - neck);

  ctx.closePath();

  // 카드 색 (부드러운 느낌)
  const grad = ctx.createLinearGradient(0, top, 0, bottom);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(1, "#f2f2f2");

  ctx.fillStyle = grad;
  ctx.fill();
}
//---------------------
//============================
// 🎴 둥근 사각 카드 (이미지 스타일)
function drawRoundCard(ctx, cx, cy, w, h) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  const r = Math.min(w, h) * 0.25;

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();

  ctx.fillStyle = "#f4f4f4";
  ctx.fill();
}
//------------------------------

/////////////////////////////////
//===========================
// 🎴 아래가 뾰족한 둥근 오각형 카드
function drawBottomPointPentagon(ctx, cx, cy, w, h) {
  const top = cy - h / 2;
  const bottom= cy + h /2;
  const left = cx - w / 2;
  const right = cx + w / 2;

  const tipY = bottom + h * 0.22;   // 아래 뾰족한 길이
  const r = Math.min(w, h) * 0.12;  // 둥근 정도

  ctx.beginPath();

  // 왼쪽 위
  ctx.moveTo(left + r, top);
  ctx.quadraticCurveTo(left, top, left, top + r);

  // 왼쪽 아래
  ctx.lineTo(left, bottom - r);
  ctx.quadraticCurveTo(left, bottom, left + r, bottom);

  // 아래 뾰족
  ctx.lineTo(cx - r, bottom);
  ctx.lineTo(cx, tipY);
  ctx.lineTo(cx + r, bottom);

  // 오른쪽 아래
  ctx.lineTo(right - r, bottom);
  ctx.quadraticCurveTo(right, bottom, right, bottom - r);

  // 오른쪽 위
  ctx.lineTo(right, top + r);
  ctx.quadraticCurveTo(right, top, right - r, top);

  ctx.closePath();

  // 부드러운 카드 색
  const grad = ctx.createLinearGradient(0, top, 0, tipY);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(1, "#f0f0f0");

  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

//---------------------------
///////////-----------------------------------
// 슬롯기반 변환 함수 
//공통
function getSlotCount(board) {
  return (board.max - board.min) * board.split;
}
// value(슬롯의 값) -> x(포인트 위치) 
export function valueToX(value, board) {
  const slotCount = getSlotCount(board);
  const slotWidth = board.width / slotCount;

  const slotIndex = (value - board.min) * board.split;
  return board.x + slotIndex * slotWidth;
}
// x(포인트 위치) -> 슬롯의 값
export function xToValue(x, board) {
  const slotCount = getSlotCount(board);
  const slotWidth = board.width / slotCount;

  const slotIndex = (x - board.x) / slotWidth;
  return board.min + slotIndex / board.split;
}

export function valueToX_card(value, board) {
  const step = board.width / (board.max - board.min);
  const baseX = valueToX_line(value, board);
  return baseX + step / 2;
}


function drawNumberLine(ctx, board) {
  const midY = board.y + board.height / 2;
  const slotCount = (board.max - board.min + 1) * 2;
  const slotWidth = board.width/slotCount;  ///한개의 슬롯크기
  const zeroRatio = (0-board.min)/(board.max - board.min);
  const zeroX = board.x + zeroRatio * board.width;
  //////판글씨 쓰기/////
  const label = NUMBERLINE_LABELS[board.judgeId];
  if (label) {
    ctx.save();

    // ⭐ 보드 영역으로 클리핑
    ctx.beginPath();
    ctx.rect(board.x, board.y, board.width, board.height);
    ctx.clip();

    const fontSize = Math.floor(board.height);

  ctx.font = `bold ${fontSize}px Arial`;
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    label,
    board.x + board.width / 2,
    board.y + board.height / 2
  );

  ctx.restore();
  }
  //------------------//
  ctx.strokeStyle = "#4a6cff";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(board.x, midY);
  ctx.lineTo(zeroX, midY);
  ctx.stroke();
//양수 구간
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(zeroX, midY);
  ctx.lineTo(board.x + board.width, midY);
  ctx.stroke();
  for (let i = 1; i <= slotCount; i++) {
    const value = (board.min + i / 2)-0.5;
    const x = board.x+(i*slotWidth);
    if(value < 0){
      ctx.strokeStyle = "#4a6cff";
      ctx.lineWidth=1;
    } else {
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      }
   
    if((i%2)===0) continue;
    ctx.beginPath();
    ctx.moveTo(x, board.y);
    ctx.lineTo(x, board.y + board.height);
    ctx.stroke();
    if(value === 0) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 3;
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(x,midY,5,0,Math.PI*2);
      ctx.stroke();
      ctx.fill();
    }
   
  }
}

function drawCard(ctx, board) {
  const slotCount = (board.max - board.min + 1) * 2;
  const slotWidth = board.width/slotCount;  ///한개의 슬롯크기
  // 카드 글자
  ctx.font = "bold 15px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < slotCount; i+=2) {
    const leftX = board.x + i*slotWidth;
    const rightX = board.x + (i+2)*slotWidth;
    const cellWidth = rightX - leftX;
    const cx = (leftX + rightX) / 2 ;
    const cy = board.y + board.height / 2;
    const cardW = cellWidth * 0.78;
    const cardH = board.height * 0.72;

    drawBottomPointPentagon(ctx, cx, cy, cardW, cardH); 
    const value = board.min + (i / 2);
    ctx.fillStyle = (value === 0) ? "red" : "#000";
    ctx.fillText(value, cx, cy);
  }
};


///////////sub_num_card////////
function draw_sub_Card(ctx, board) {
  const slotCount = (board.max - board.min + 1) * 2;
  const slotWidth = board.width/slotCount;  ///한개의 슬롯크기
  ctx.font = "bold 15px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < slotCount; i+=2) {
    const leftX = board.x + i*slotWidth;
    const rightX = board.x + (i+2)*slotWidth;
    const cellWidth = rightX - leftX;
    const cx = (leftX + rightX) / 2 ;
    const cy = board.y + board.height / 2;
    const cardW = cellWidth * 0.78;
    const cardH = board.height * 0.72;
    const value = board.min + (i / 2);
    ctx.fillStyle = (value === 0) ? "red" : "#000";
    ctx.fillText(value, cx, cy);
  }
}