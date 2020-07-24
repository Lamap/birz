import * as PIXI from 'pixi.js';
import { Ticker } from '../../index';
import { GameDimensions } from '../../index';
import * as particles from 'pixi-particles';
import { explosionConfig } from './explosionConfig';
import { frames as wingFrames } from './wingsAnimationConfig';
import { frames as spittingFrames } from './nebAnimationsConfig';

export const Events = {
  SHOOT_BULLET: 'shootBullet'
}

export class Birdy  extends PIXI.Container {
  public shootStartingPoint: PIXI.Point = new PIXI.Point();
  private body: PIXI.Sprite;
  private exploison: any;
  private wings: PIXI.AnimatedSprite;
  private neb: PIXI.AnimatedSprite;

  constructor(private isFrozen = false) {
    super();
    this.body = PIXI.Sprite.from('../assets/imgs/birdy/sketch.png');
    this.addChild(this.body);
    this.shootStartingPoint.x = this.body.width;
    this.shootStartingPoint.y = 20;

    this.setWingsAnimations();
    if (!isFrozen) {
      this.wings.play();
    }
    this.setNeb();

    const debugRect = new PIXI.Graphics();
    debugRect.lineStyle(1, 0xff0000);
    debugRect.drawRect(0, 0, this.width, this.height);
    this.addChild(debugRect);
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
    this.neb.play();
  }

  explode() {
    explosionConfig.pos.x = this.width / 2;
    explosionConfig.pos.y = this.height / 2;
    this.exploison = new particles.Emitter(this, [PIXI.Texture.from('../assets/imgs/particles/explode.png')], explosionConfig);
    this.exploison.emit = true;
    Ticker.add(this.fadeOut, this);
    this.wings.stop();
    this.exploison.playOnceAndDestroy(() => {
      this.destroy();
    });
  }

  fadeOut() {
    if (this.body.alpha < 0) {
      return Ticker.remove(this.fadeOut, this);
    }
    this.body.alpha -= 0.05;
    this.wings.alpha -= 0.05;
    this.neb.alpha -= 0.05;
  }
  setWingsAnimations() {
    const wingFrameTextures = wingFrames.map(item => PIXI.Texture.from(item.src));
    this.wings = new PIXI.AnimatedSprite(wingFrameTextures);
    this.wings.animationSpeed = 0.45;

    this.wings.anchor.x = 0.5;
    this.wings.anchor.y = 0.5;
    this.wings.scale.x = -0.48;
    this.wings.scale.y = 0.48;
    this.wings.x = 45;
    this.wings.y = 43;

    this.addChild(this.wings);
  }
  setNeb() {
    const nebFrameTextures = spittingFrames.map(item => PIXI.Texture.from(item.src));
    this.neb = new PIXI.AnimatedSprite(nebFrameTextures);

    this.neb.anchor.x = 0.5;
    this.neb.anchor.y = 0.5;
    this.neb.scale.x = -0.35;
    this.neb.scale.y = 0.48;
    this.neb.x = 85;
    this.neb.y = 16;
    this.neb.onLoop = () => {
      this.neb.stop();
      this.emit(Events.SHOOT_BULLET);
    };
    this.addChild(this.neb);
  }
}
