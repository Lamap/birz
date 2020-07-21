import * as PIXI from 'pixi.js';
import { Ticker } from '../index';
import { GameDimensions } from '../index';
import { randNumber } from '../utils/Utils';

export const Events = {
  REMOVED: 'removed'
}

export class Bullet extends PIXI.Container {
  private body = new PIXI.Graphics();
  private speed = 6;

  constructor(private startPoint: PIXI.Point) {
    super();
    this.x = this.startPoint.x;
    this.y = this.startPoint.y;
    this.body.beginFill(0x000000, 1);
    this.body.drawCircle(4, 4, 8);
    this.body.endFill();
    this.addChild(this.body);
    Ticker.add(this.fly, this);
  }

  fly() {
    this.x += this.speed;
    if (this.x > GameDimensions.GAME_WIDTH + 10) {
      Ticker.remove(this.fly, this);
      this.emit(Events.REMOVED);
      this.parent.removeChild(this);
    }
  }

  remove() {
    Ticker.remove(this.fly, this);
    this.destroy();
  }
}
