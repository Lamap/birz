import * as PIXI from 'pixi.js';

export function randNumber(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function detectCollision(body1: PIXI.Container, body2: PIXI.Container, overlap: number = 0) {
  if (!body1 || !body2 || !body1.parent || !body2.parent) {
    return;
  }
  const b1: PIXI.Rectangle = body1.getBounds();
  const b2: PIXI.Rectangle = body2.getBounds();

  const untouch =
    b2.x > b1.x + b1.width - overlap ||
    b1.x > b2.x + b2.width - overlap ||
    b2.y > b1.y + b1.height - overlap ||
    b2.y + b2.height - overlap < b1.y

  return !untouch;
}
