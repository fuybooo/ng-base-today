export function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
export function calculateDistance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}



