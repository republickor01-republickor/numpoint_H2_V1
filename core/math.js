// core/mathUtil.js
export function isAlmostInteger(x, eps = 1e-9) {
  return Math.abs(x - Math.round(x)) < eps;
}
