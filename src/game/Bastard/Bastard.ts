import * as PIXI from 'pixi.js';
import * as particles from 'pixi-particles';
import { Ticker } from '../../index';
import { GameDimensions } from '../../index';
import { randNumber, getRandomWeightedItem, IweightedItem } from '../../utils/Utils';
import { explosionConfig } from './explosionConfig';
import { frames as bastard1Frames } from './propAnimSeqs';

const Types: IweightedItem[] & {name: string; asset: string}[] = [
  {
    name: 'type#1',
    weight: 2,
    asset: '../assets/imgs/bastards/bastard1/sketch.png'
  },
  {
    name: 'type#2',
    weight: 3,
    asset: '../assets/imgs/bastards/bastard2/sketch.png'
  }
];

export class Bastard extends PIXI.Container {
  public isActive = true;
  private body: PIXI.Sprite;
  private speed: number;
  private exploison: any;
  private yOriginal: number;
  private flyWaveLength: number;
  private flyWaveAmptitudo: number;

  // TODO: random scale connected to z-index

  constructor() {
    super();
    const type = getRandomWeightedItem(Types);
    this.body = PIXI.Sprite.from(type.asset);

    // temporal unconceptional override for testing graphics
    if (type.name === 'type#1') {
      const frames = bastard1Frames.map(frame => PIXI.Texture.from(frame.src));
      this.body = new PIXI.AnimatedSprite(frames);
      (this.body  as PIXI.AnimatedSprite).animationSpeed = 0.3;
      (this.body  as PIXI.AnimatedSprite).play();
    }
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
