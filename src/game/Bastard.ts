import * as PIXI from 'pixi.js';
import { Ticker } from '../index';
import { GameDimensions } from '../index';
import { randNumber } from '../utils/Utils';

export const Events = {
  SAMPLE: 'sample'
};
export enum Types {
  TYPE_1,
  TYPE_2
}

export class Bastard extends PIXI.Container {
  private body: PIXI.Sprite;
  private speed: number;
  // TODO: random scale connected to z-index

  constructor(type: Types = Types.TYPE_1) {
    super();
    this.body = PIXI.Sprite.from('../assets/imgs/bastards/bastard1/sketch.png');
    this.addChild(this.body);
  }

  activate() {
    this.x = GameDimensions.GAME_WIDTH + 200;
    this.sendToAttack();
    Ticker.add(this.fly, this);
  }

  sendToAttack() {
    this.y = randNumber(50, GameDimensions.GAME_HEIGHT - 80);
    this.speed = randNumber(0.5, 2);
  }

  fly() {
    this.x -= this.speed;
    if (this.x < -200) {
      Ticker.remove(this.fly, this);
      this.parent.removeChild(this);
      this.destroy();
    }
  }

  explode() {
    console.log('boooom');
    Ticker.remove(this.fly, this);
    this.destroy();
  }
}
