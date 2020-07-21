import * as PIXI from 'pixi.js';
import { Ticker } from '../index';
import { GameDimensions } from '../index';
import { randNumber } from '../utils/Utils';

export const Events = {
  SHOOT_BULLET: 'shootBullet'
}

export class Birdy  extends PIXI.Container {
  public shootStartingPoint: PIXI.Point = new PIXI.Point();
  private body: PIXI.Sprite;

  constructor() {
    super();
    this.body = PIXI.Sprite.from('../assets/imgs/birdy/sketch.png');
    this.addChild(this.body);
    this.shootStartingPoint.x = this.body.width;
    this.shootStartingPoint.y = 20;
  }

  move(direction: 'up' | 'right' | 'down' | 'left') {
    const moveStep = 4;
    console.log(direction);
    if (direction === 'down' && this.y + moveStep < GameDimensions.GAME_HEIGHT - this.height) {
      this.y += moveStep;
    }
    if (direction === 'up' && this.y - moveStep > 0) {
      this.y -= moveStep;
    }
    if (direction === 'right' && this.x + moveStep < GameDimensions.GAME_WIDTH - this.width) {
      this.x += moveStep;
    }
    if (direction === 'left' && this.x - moveStep > 0) {
      this.x -= moveStep;
    }
  }

  shoot() {
    this.emit(Events.SHOOT_BULLET);
    console.log('shoot');
  }

  explode() {
    console.log('birdy dies');
  }

  destroy() {
    // remove all listeners
  }
}
