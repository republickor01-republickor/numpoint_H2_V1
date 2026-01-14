// tokenGenerator.js
import { TokenCard } from "./token_card.js";
import { isAlmostInteger } from "./core/math.js";

/////////////////////////////////
// 토큰차
///////////////////////////////////
/////////토큰 타입 결정/////////////
/////////////////////////////////////
/// 유리수 라운드별 정리.. 
const RATIONAL_DENOMINATOR_BY_ROUND = {
  1: 10,
  2: 100,
  3: 1000,
  // 4 : 분모가 1~10 까지인 분수 
};

//🔑 1
export const TOKEN_TYPES = {
  NATURAL: "natural",    // 자연수
  RATIONAL: "rational",  // 유리수
  IRRATIONAL: "irrational", // 무리수
  LOG: "log",// 로그
};
//🔑 2
export const JUDGE_TOKEN_TYPES = {
  NAT_CARD: ["integer_nat"],
  INT_CARD: ["rational"],
  NAT_LINE: ["integer_nat"],
  //NAT_LINE: [
  //  "integer_nonneg",     // 0 포함 정수
  //  "rational_finite",    // 유한소수
  //  "rational_repeat",    // 순환소수
  //],
  INT_LINE: ["rational"],

  RATIONAL_FINITE_LINE: ["rational"],
  RATIONAL_REPEAT_LINE: ["rational"],

  IRRATIONAL_LINE: ["irrational"],
};
/* ==================================================
   타입 → 생성기 매핑  매우 중요 
   🔑 3
================================================== */
const TOKEN_GENERATORS = {
  integer_nat: genNaturalInteger,
  rational: genRationalFraction,
  irrational: genLogToken, //genIrrationalMixed,
};

/* ==================================================
   현재 화면의 보더들로부터
   허용 토큰 타입 "합집합" 계산
================================================== */
// ❣️ 4
function getAllowedTokenTypes(boardInstance) {
  const set = new Set();

  if (!boardInstance || !Array.isArray(boardInstance.boards)) {
    console.error("❌ Invalid boardInstance:", boardInstance);
    return [];
  }

  boardInstance.boards.forEach(board => {
    if (!board || !board.judgeId) return;

    const types = JUDGE_TOKEN_TYPES[board.judgeId];
    if (!Array.isArray(types)) return;

    types.forEach(t => set.add(t));
  });

  return [...set]; // ✅ 항상 배열
}

/////////////////////////////////////////////////
// 👉토큰 메인 작 ⭐🚗🚗 5
/////////////////////////////////////////////////
export function generateTokensForCurrentBoards(
  boardInstance,
  count
) {
  const allowedTypes = getAllowedTokenTypes(boardInstance);
  const tokens = [];

  if (allowedTypes.length === 0) return tokens;

  let safety = 0; // 무한루프 방지

  while (tokens.length < count && safety < 500) {
    safety++;

    const type = chooseTypeByPriority(allowedTypes, boardInstance);
    const gen = TOKEN_GENERATORS[type];
    const { min, max } = getNumberLineRange(boardInstance);
    if (!gen) continue;

    const data = gen(min, max);

    // =========================
    // ⭐ 범위 체크 (핵심)
    // =========================
    const inRange = boardInstance.boards.every(board => {
      if (typeof board.min !== "number" || typeof board.max !== "number") {
        return true; // 범위 없는 보드는 통과
      }
      return data.value >= board.min && data.value <= board.max;
    });

    if (!inRange) continue; // ❌ 범위 밖 → 버림

    // =========================
    // 통과 → 토큰 생성////////////
    // =========================
    tokens.push(
      new TokenCard(
        700 - tokens.length * 40,
        80,
        20,  // 토큰 사이즈 ?
        data.raw,
        data.value,
        data.com_raw,
        data.difficulty
      )
    );
  }

  return tokens;
}
/////////////////////////////////////////////////
// 👉수 라인 min max 값 반환 ⭐🚗🚗 5
/////////////////////////////////////////////////
function getNumberLineRange(boardInstance) {
  const lines = boardInstance.boards.filter(
    b => b.kind === "numberline"
  );

  return {
    min: Math.min(...lines.map(b => b.min)),
    max: Math.max(...lines.map(b => b.max)),
  };
}
////////////////////////////////////////////////////
////////토큰 타입 결정/////////////
////////////////////////////////////////////////////
function chooseTypeByPriority(allowedTypes, boardInstance) {
  // 🛡 1차 방어
  if (!Array.isArray(allowedTypes) || !boardInstance?.boards) {
    return null;
  }

  // 🛡 judgeId 있는 보더만 필터
  const judgeBoards = boardInstance.boards.filter(
    b => typeof b?.judgeId === "string"
  );

  const hasIrrationalBoard = judgeBoards.some(
    b => b.judgeId === "IRRATIONAL_LINE"
  );

  if (hasIrrationalBoard && allowedTypes.includes("irrational")) {
    return "irrational";
  }

  const hasRationalBoard = judgeBoards.some(
    b =>
      b.judgeId === "INT_LINE" ||
      b.judgeId.includes("RATIONAL")
  );

  if (hasRationalBoard && allowedTypes.includes("rational")) {
    return "rational";
  }

  if (allowedTypes.includes("integer_nat")) {
    return "integer_nat";
  }

  return randChoice(allowedTypes);
}
///////////////////////////////////////////////////////

/////////////////////////////////////////////////////////
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}





////////////////////////////////////////////
///////////수 생성 함수들 집합 //////////////
///////////////////////////////////////////
// 👉 자연수 생성 
//----------------------
function genNaturalInteger(min, max) {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  if (lo > hi) return null;
  const n = randInt(lo, hi);
  return {
    raw: String(n),
    value: n,
    com_raw: {
    kind: "integer",
    domain: "natural"
  },
  difficulty: 0
  };
}
function genRationalFraction(min, max, level = "R5"){
    switch (level) {
    case "R1":
      return genRational_PowerOf10(min, max, 10, 1);
    case "R2":
      return genRational_PowerOf10(min, max, 10, 2);
    case "R3":
      return genRational_PowerOf10(min, max, 10, 3);
    case "R4": // 유리수 생성
      return genRational_R4(min, max);
    case "R5":// 기초약분 단계 추가
      return genRational_R5(min, max);
  }
}
// 👉 무리수 생성
// -------------
function genIrrationalRoot(min, max, version=2) {
  // ==================================================
  // 1️⃣ 보드 범위 기반 피제수 상한
  //    √base ≤ max  →  base ≤ max²
  // ==================================================
  switch (version) {
    case 2:
      return genIrrational_V2(min, max);
    case 1:
    default:
      return genIrrational_V1(min, max);
  }
}



//////////////////////////////////////////////
//수 생성함수 마지막


////////////유리수 난이도별 생성 함수들 //////////////
function genRational_PowerOf10(min, max, denominator, difficulty) {
  const nMin = Math.ceil(min * denominator);
  const nMax = Math.floor(max * denominator);
  if (nMin > nMax) return null;

  const numerator = randInt(nMin, nMax);
  const value = numerator / denominator;

  return {
    raw: `${numerator}/${denominator}`,
    value,
    com_raw: {
      kind: "rational",
      denominator,
      decimalType: "finite"
    },
    difficulty
  };
}
 // 분모가 10의 거듭제곱

// 분모가 1~10 까지인수 관리
function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return Math.abs(a);
}

function isFiniteDecimalDenominator(d) {
  while (d % 2 === 0) d /= 2;
  while (d % 5 === 0) d /= 5;
  return d === 1;
}

function genRational_R4(min, max) {
  const d = randInt(1, 10);

  const nMin = Math.ceil(min * d);
  const nMax = Math.floor((max - 1e-9) * d);
  if (nMin > nMax) return null;

  const n = randInt(nMin, nMax);

  // ⭐ 분모가 1이면 → 정수로 재분류
  if (d === 1) {
    return {
      raw: `${n}/1`,
      value: n,
      com_raw: {
        kind: "integer",
        source: "R4"
      },
      difficulty: 4
    };
  }

  // ⭐ 여기서 약분 (핵심)
  const g = gcd(n, d);
  const rn = n / g;
  const rd = d / g;

  // ⭐ 약분된 분모로 판정
  const finite = isFiniteDecimalDenominator(rd);
  console.log("tokenGen 304", finite);
  return {
    raw: `${n}/${d}`,          // 표현은 원본 유지
    value: rn / rd,
    com_raw: {
      kind: "rational",
      round: 4,
      numerator: rn,
      denominator: rd,
      decimalType: finite ? "finite" : "infinite"
    },
    difficulty: 4
  };
}
  // 분모가 한번의 약분 필요 까지인 분수
function genRational_R5(min, max) {
  const d = randInt(2, 10); 
  const nMin = Math.ceil(min * d);
  const nMax = Math.floor((max - 1e-9) * d);
  
  if (nMin > nMax) return null;
  const n = randInt(nMin, nMax);

  // 약분 전 숫자를 만듭니다 (R5의 핵심)
  const multiplier = randInt(2, 5);
  const displayN = n * multiplier;
  const displayD = d * multiplier;

  // 판정을 위한 기약분수화
  const g = gcd(displayN, displayD);
  const rn = displayN / g;
  const rd = displayD / g;

  // 판정 코드(JudgeRegistry)가 사용하는 기준에 맞춤
  let decimalType;
  if (rd === 1) {
    decimalType = "integer"; // 정수는 별도 관리
  } else {
    decimalType = isFiniteDecimalDenominator(rd) ? "finite" : "infinite";
  }

  return {
    raw: `${displayN}/${displayD}`, 
    value: rn / rd,
    com_raw: {
      kind: "rational", 
      round: 5,
      numerator: rn,
      denominator: rd,
      decimalType: decimalType // ✅ 이 값이 JudgeRegistry의 필터와 연결됩니다.
    },
    difficulty: 5
  };
}

/////무리수 생성 V1////////
function genIrrational_V1(min,max){
  const maxBase = Math.floor(max * max);

  let base;
  let absValue;

  // ==================================================
  // 2️⃣ 자연수 base 선택 (1 포함)
  //    완전제곱 여부는 "배제"가 아니라 "분류" 대상
  // ==================================================
  base = Math.floor(Math.random() * maxBase) + 1; // 1 ~ max²
  absValue = Math.sqrt(base);

  // ==================================================
  // 3️⃣ 부호 결정 (±)
  // ==================================================
  const sign = Math.random() < 0.5 ? -1 : 1;

  const value = sign * absValue;
  const raw = sign === -1 ? `-√${base}` : `√${base}`;

  // ==================================================
  // 4️⃣ 판정 메타데이터 구성
  // ==================================================
  const isPerfectSquare = Number.isInteger(absValue);
  console.log("tokenGen 257 :", value);
  return {
    raw,
    value,
    com_raw: {
      kind: isPerfectSquare ? "rational" : "irrational",
      form: "root",
      exact: isPerfectSquare,      // √1, √4, √9 …
      derivedFrom: "root",
      base,
      sign,
    },
    difficulty: isPerfectSquare ? 2 : 5,
  };
}
//// 무리수 생성 V2 /////////
function genIrrational_V2(min, max) {
  let base, k, value;
  let safety = 0;

  while (safety++ < 100) {
    // 1️⃣ base는 넉넉하게
    base = randInt(1, 500);

    const root = Math.sqrt(base);

    // 2️⃣ 정수 이동량
    const kMin = Math.ceil(min - root);
    const kMax = Math.floor(max - root);
    if (kMin > kMax) continue;

    k = randInt(kMin, kMax);
    value = root + k;

    if (value < min || value > max) continue;

    // 3️⃣ 표현
    const absK = Math.abs(k);
    const sign = k >= 0 ? "+" : "-";

    const raw = `√${base} ${sign} ${absK}`;
    //const raw =
    //  Math.random() < 0.5
    //    ? `√${base} ${sign} ${absK}`
    //    : `${absK} ${sign} √${base}`;

    // 4️⃣ 분류 (⭐ 핵심)
    let kind;
    if (Number.isInteger(value)) {
      kind = "integer";
    } else if (Number.isFinite(value)) {
      kind = Number.isInteger(root) ? "rational" : "irrational";
    }

    return {
      raw,
      value,
      com_raw: {
        kind,          // integer | rational | irrational
        version: 2,
        form: "root_shift",
        base,
        shift: k,
      },
      difficulty: 6,
    };
  }

  return null;
}

function genIrrationalMixed(min, max) {
  // 50% 확률로 로그
  if (Math.random() < 0.5) {
    const logToken = genLogToken(min, max);
    if (logToken) return logToken;
  }

  // 실패하거나 나머지 → 기존 루트 무리수
  return genIrrationalRoot(min, max);
}

function genLogToken(min, max) {
  let safety = 0;

  while (safety++ < 100) {
    // ⭐ 1️⃣ 밑 선택 (의도적)
    const base = Math.random() < 0.5 ? 2 : 10;

    let arg;

    if (base === 2) {
      // =========================
      // 🔹 밑 2 → 작은 수 담당
      // =========================
      // 2 ~ 256 사이, 작은 쪽 가중
      const candidates = [2, 3, 4, 5, 6, 8, 10, 16, 20, 32, 64, 128, 256];
      arg = randChoice(candidates);

    } else {
      // =========================
      // 🔹 밑 10 → 큰 수 담당
      // =========================
      // 10^k 근처에서 흔들기
      const k = randInt(1, 7); // log값 대략 1~7
      const jitter = randChoice([1, 2, 3, 5]);
      arg = jitter * Math.pow(10, k);
    }

    // ⭐ 정수 로그 결과 제거
    const value = Math.log(arg) / Math.log(base);
    if (isAlmostInteger(value)) continue;

    if (!Number.isFinite(value)) continue;
    if (value < min || value > max) continue;

    const raw =
      base === 10
        ? `log₁₀(${arg})`
        : `log₂(${arg})`;

    return {
      raw,
      value,
      com_raw: {
        kind: "irrational",
        form: "log",
        base,
        arg,
      },
      difficulty: 6,
    };
  }

  return null;
}


