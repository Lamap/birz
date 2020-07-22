import * as PIXI from 'pixi.js';
import * as particles from 'pixi-particles';
import { Ticker } from '../../index';
import { GameDimensions } from '../../index';
import { randNumber } from '../../utils/Utils';
import { explosionConfig } from './explosionConfig';

export const Events = {
  SAMPLE: 'sample'
};
export enum Types {
  TYPE_1,
  TYPE_2
}

export class Bastard extends PIXI.Container {
  public isActive = true;
  private body: PIXI.Sprite;
  private speed: number;
  private exploison: any;
  private yOriginal: number;
  private flyWaveLength: number;
  private flyWaveAmptitudo: number;

  // TODO: random scale connected to z-index

  constructor(type: Types = Types.TYPE_1) {
    super();
    this.body = PIXI.Sprite.from('../assets/imgs/bastards/bastard1/sketch.png');
    this.addChild(this.body);
  }

  activate() {
    this.x = GameDimensions.GAME_WIDTH + 200;
    this.sendToAttack();
    this.flyWaveAmptitudo = randNumber(30, 50);
    this.flyWaveLength = randNumber(20, 60);
    Ticker.add(this.fly, this);
  }

  sendToAttack() {
    this.y = this.yOriginal = randNumber(50, GameDimensions.GAME_HEIGHT - 80);
    this.speed = randNumber(1, 2);
  }

  fly() {
    this.x -= this.speed;
    const sin = Math.sin(this.x / Math.PI / this.flyWaveLength);
    this.angle = sin * 6;
    this.y = this.yOriginal + sin  * this.flyWaveAmptitudo;

    if (this.x < -200) {
      Ticker.remove(this.fly, this);
      this.parent.removeChild(this);
      this.destroy();
    }
  }

  explode() {
    this.isActive = false;
    explosionConfig.pos.x = this.width / 2;
    explosionConfig.pos.y = this.height / 2;
    this.exploison = new particles.Emitter(this, [PIXI.Texture.from('../assets/imgs/particles/explode.png')], explosionConfig);
    this.exploison.emit = true;
    Ticker.add(this.fadeOut, this);
    this.exploison.playOnceAndDestroy(() => {
      this.destroy();
    });
    this.cleanUp();
  }

  cleanUp() {
    Ticker.remove(this.fly, this);
  }
  fadeOut() {
    if (this.body.alpha < 0) {
      return Ticker.remove(this.fadeOut, this);
    }
    this.body.alpha -= 0.05;
    this.body.x += 1;
  }
}
