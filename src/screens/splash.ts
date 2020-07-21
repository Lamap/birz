import * as PIXI from 'pixi.js';
import { Ticker } from '../index';

export const Events = {
  TIMED_OUT: 'timedOut'
};

export class SplashScreen extends PIXI.Container {
  private background: PIXI.Sprite = PIXI.Sprite.from('../assets/imgs/backgrounds/clouds.jpg');
  constructor(lifeTime: number) {
    super();

    this.addChild(this.background);
    setTimeout(() => {
      this.fadeOut();
    }, lifeTime);
  }

  fadeOut() {
    Ticker.add(this.fadingAnimation, this);
  }

  fadingAnimation() {
    this.alpha -= 0.02;
    if (this.alpha <= 0) {
      Ticker.remove(this.fadingAnimation, this);
      this.emit(Events.TIMED_OUT);
    }
  }
}
