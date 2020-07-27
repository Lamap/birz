import * as PIXI from 'pixi.js';
import { Ticker } from '../../index';
import { GameDimensions } from '../../index';
import * as particles from 'pixi-particles';
import { explosionConfig } from './explosionConfig';
import { frames as wingFrames } from './wingsAnimationConfig';
import { frames as spittingFrames } from './nebAnimationsConfig';
import { DebuggableContainer } from '../DebuggableContainer';

export const Events = {
  SHOOT_BULLET: 'shootBullet'
};

export class Birdy  extends DebuggableContainer {
  public shootStartingPoint: PIXI.Point = new PIXI.Point();
  private body: PIXI.Sprite;
  private exploison: any;
  private wings: PIXI.AnimatedSprite;
  private neb: PIXI.AnimatedSprite;

  constructor(private isFrozen = false) {
    super();
    this.setNeb();
    this.body = PIXI.Sprite.from('../assets/imgs/birdy/birdy.png');
    this.addChild(this.body);
    this.shootStartingPoint.x = this.body.width;
    this.shootStartingPoint.y = 61;

    this.setWingsAnimations();
    if (!isFrozen) {
      this.wings.play();
    }
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

  // TODO: create an own frameAnimation to handle all requierements
  setWingsAnimations() {
    const wingFrameTextures = wingFrames.map(item => PIXI.Texture.from(item.src));
    this.wings = new PIXI.AnimatedSprite(wingFrameTextures);
    this.wings.animationSpeed = 0.55;
    this.wings.x = -7;
    this.wings.y = 3;

    this.addChild(this.wings);
  }
  setNeb() {
    const nebFrameTextures: PIXI.Texture[] = [];
    spittingFrames.forEach((item) => {
      for (let i = 0; i < item.duration; i++) {
        nebFrameTextures.push(PIXI.Texture.from(item.src));
      }
    });
    this.neb = new PIXI.AnimatedSprite(nebFrameTextures);
    this.neb.x = 148;
    this.neb.y = 46;
    this.neb.animationSpeed = 0.4;
    this.neb.onLoop = () => {
      this.neb.stop();
      this.emit(Events.SHOOT_BULLET);
    };
    this.addChild(this.neb);
  }
}
