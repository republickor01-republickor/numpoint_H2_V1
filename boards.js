// boards.js
/**
 * boards.js
 * ------------------------------------
 * 📦 BOARD DATA ONLY
 *
 * - 수판/수직선/카드 영역의 "정적 정의"만 담당
 * - 좌표, 범위, 크기, step 등 설정값만 포함
 *
 * ❌ 금지
 * - draw 관련 코드
 * - ctx 접근
 * - valueToX / 계산 로직
 * - 이벤트 처리
 *
 * ✅ 이 파일은 "JSON처럼" 사용한다
 */

export const boards = [
  {
    id: "sub_card",
    kind: "sub_number_card",
    domain: "sub_n_card",
    min: 0,
    max: 10,
    split: 2,
    x: 50,
    y: 80,
    width: 700,
    height: 50,
    majorStep: 2
  },
  // =========================
  // 수를 위한 판 설계
  // =========================
  {
    id: "rational_card",
    kind: "number_card",
    domain: "rational_non_integer_card",
    min: 0,
    max: 10,
    split: 2,
    x: 50,
    y: 80,
    width: 700,
    height: 50,
    majorStep: 2
  },

  // 수를 위한  수직선 
  {
    id: "rational_line",
    kind: "number_line",
    domain: "rational_non_integer_line",
    min: 0,
    max: 10,
    split: 2,
    x: 50,
    y: 130,
    width: 700,
    height: 60,
    majorStep: 2,
    minorStep: 2
  },

  // =========================
  // 앞으로 영문이나 다른 것울 위한 카드
  // =========================
  {
    id: "int_card",
    kind: "card",
    min: -10,
    max: 10,
    split: 2,
    x: 50,
    y: 220,
    width: 700,
    height: 60,
    majorStep: 2
  },

  // 다른것을 위한 라인판..  
  {
    id: "int_line",
    kind: "numberline",
    min: -10,
    max: 10,
    split: 2,
    x: 50,
    y: 280,
    width: 700,
    height: 60,
    majorStep: 2,  // 두칸씩
    minorStep: 1
  }
];
/* 
// boards.js
export const boards = [
  { id: "NAT_LINE", ... },
  { id: "INT_LINE", ... },
  { id: "RATIONAL_FINITE_LINE", ... },
  { id: "RATIONAL_INFINITE_LINE", ... },
  { id: "IRRATIONAL_LINE", ... },
];



*/