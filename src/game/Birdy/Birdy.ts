import * as PIXI from 'pixi.js';
import { Ticker } from '../../index';
import { GameDimensions } from '../../index';
import { randNumber } from '../../utils/Utils';
import * as particles from 'pixi-particles';
import { explosionConfig } from './explosionConfig';

export const Events = {
  SHOOT_BULLET: 'shootBullet'
}

export class Birdy  extends PIXI.Container {
  public shootStartingPoint: PIXI.Point = new PIXI.Point();
  private body: PIXI.Sprite;
  private exploison: any;

  constructor() {
    super();
    this.body = PIXI.Sprite.from('../assets/imgs/birdy/sketch.png');
    this.addChild(this.body);
    this.shootStartingPoint.x = this.body.width;
    this.shootStartingPoint.y = 20;
  }

  move(direction: 'up' | 'right' | 'down' | 'left') {
    const moveStep = 6;
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
  }

  explode() {
    explosionConfig.pos.x = this.width / 2;
    explosionConfig.pos.y = this.height / 2;
    this.exploison = new particles.Emitter(this, [PIXI.Texture.from('../assets/imgs/particles/explode.png')], explosionConfig);
    this.exploison.emit = true;
    Ticker.add(this.fadeOut, this);
    this.exploison.playOnceAndDestroy(() => {
      this.destroy();
    });
  }

  fadeOut() {
    if (this.body.alpha < 0) {
      return Ticker.remove(this.fadeOut, this);
    }
    this.body.alpha -= 0.05;
  }
}
