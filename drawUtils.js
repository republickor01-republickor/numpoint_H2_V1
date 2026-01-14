// drawUtils.js
/**
 * drawUtils.js
 * ------------------------------------
 * 🎴 UI DRAW UTILITIES
 *
 * - 카드, 포인터, 말풍선 등 "보드 위에 얹는 UI" 담당
 *
 * 포함:
 * - drawSoftPointerCard
 * - drawVerticalPointer
 *
 * ❌ 금지
 * - board 데이터 직접 참조
 * - valueToX / 좌표 계산
 * - 전역 State 접근
 *
 * ⚠️ 규칙
 * - 이 파일의 함수는 "좌표를 받아서 그리기만" 한다
 */

export function drawVerticalPointer(ctx, x, board, options = {}) {
  const {
    width = 6,
    color = "#333",
    arrowSize = 10
  } = options;

  const topY = board.y;
  const bottomY = board.y + board.height;

  ctx.fillStyle = color;

  // 세로 막대
  ctx.fillRect(
    x - width / 2,
    topY,
    width,
    board.height
  );

  // 아래 화살촉
  ctx.beginPath();
  ctx.moveTo(x - arrowSize, bottomY);
  ctx.lineTo(x + arrowSize, bottomY);
  ctx.lineTo(x, bottomY + arrowSize);
  ctx.closePath();
  ctx.fill();
}

// 카드 하나 (아래 뾰족 포함)
export function drawSoftPointerCard(
  ctx,
  x,
  y,
  value,
  options = {}
) {
  const {
    width = 48,
    height = 36,
    pointerHeight = 10,
    radius = 6,
    fill = "#f7f7f7",
    stroke = "#666",
    textColor = "#222"
  } = options;

  const topY = y - height - pointerHeight;

  ctx.beginPath();

  // 왼쪽 위
  ctx.moveTo(x - width / 2 + radius, topY);

  // 위
  ctx.lineTo(x + width / 2 - radius, topY);
  ctx.quadraticCurveTo(
    x + width / 2,
    topY,
    x + width / 2,
    topY + radius
  );

  // 오른쪽
  ctx.lineTo(x + width / 2, topY + height - radius);
  ctx.quadraticCurveTo(
    x + width / 2,
    topY + height,
    x + width / 2 - radius,
    topY + height
  );

  // 아래 중앙 (뾰족으로 들어가기)
  ctx.lineTo(x + 10, topY + height);
  ctx.lineTo(x, topY + height + pointerHeight);
  ctx.lineTo(x - 10, topY + height);

  // 왼쪽 아래
  ctx.lineTo(x - width / 2 + radius, topY + height);
  ctx.quadraticCurveTo(
    x - width / 2,
    topY + height,
    x - width / 2,
    topY + height - radius
  );

  // 왼쪽
  ctx.lineTo(x - width / 2, topY + radius);
  ctx.quadraticCurveTo(
    x - width / 2,
    topY,
    x - width / 2 + radius,
    topY
  );

  ctx.closePath();

  // 채우기
  ctx.fillStyle = fill;
  ctx.fill();

  // 테두리
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.stroke();

  // 숫자
  ctx.fillStyle = textColor;
  ctx.font = "bold 17px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(value, x, topY + height / 2);
}
