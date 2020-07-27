import * as PIXI from 'pixi.js';
import { Ticker } from '../index';
import { GameDimensions } from '../index';
import { DebuggableContainer } from './DebuggableContainer';

export const Events = {
  REMOVED: 'removed'
};

export class Bullet extends DebuggableContainer {
  private body: PIXI.Sprite;
  private speed = 6;

  constructor(private startPoint: PIXI.Point) {
    super();
    this.body = PIXI.Sprite.from('../assets/imgs/bullet/fly.png');

    this.x = this.startPoint.x;
    this.y = this.startPoint.y;
    this.pivot.x = 20;
    this.pivot.y = 20;
    this.addChild(this.body);

    Ticker.add(this.fly, this);
  }

  fly() {
    this.x += this.speed;
    this.angle += 25;
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
