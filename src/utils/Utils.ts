import * as PIXI from 'pixi.js';

export function randNumber(min: number, max: number, roundToInteger = false) {
  const result = min + Math.random() * (max - min);
  return roundToInteger ? Math.round(result) : result;
}

export function detectCollision(body1: PIXI.Container, body2: PIXI.Container, tolerance: number = 0) {
  if (!body1 || !body2 || !body1.parent || !body2.parent) {
    return;
  }
  const b1: PIXI.Rectangle = body1.getBounds();
  const b2: PIXI.Rectangle = body2.getBounds();

  const untouch =
    b2.x > b1.x + b1.width - tolerance ||
    b1.x > b2.x + b2.width - tolerance ||
    b2.y > b1.y + b1.height - tolerance ||
    b2.y + b2.height - tolerance < b1.y

  return !untouch;
}
export interface IweightedItem {
  weight: number;
}
export function getRandomWeightedItem(list: IweightedItem[]): IweightedItem & any {
  const fullList: IweightedItem[] = [];
  list.forEach(item => {
    for (let i = 0; i < item.weight; i++) {
      fullList.push(item);
    }
  });
  const randomIndex = randNumber(0, fullList.length - 1, true);
  return fullList[randomIndex];
}
