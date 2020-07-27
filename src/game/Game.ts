import * as PIXI from 'pixi.js';
import { RunningClouds } from './RunningClouds';
import { Bastard } from './Bastard/Bastard';
import { GameDimensions, Ticker } from '../index';
import { randNumber, detectCollision } from '../utils/Utils';
import { Birdy, Events as BirdEvents } from './Birdy/Birdy';
import { Bullet } from './Bullet';

export const Events = {
  GAME_ENDED: 'gameEnded'
};

export class Game extends PIXI.Container {
  private background: RunningClouds = new RunningClouds();
  private activeBastards: Bastard[] = [];
  private activeBullets: Bullet[] = [];
  private bulletShotCount: number;
  private birdy: Birdy;
  private bastardBaseTimeGap = {
    min: 3000,
    max: 5000
  };
  private nextBastardTimeout: number;
  private onKeydownProxy = this.onKeydown.bind(this);
  private gameEndProxy = this.endGame.bind(this);

  constructor(private stage: PIXI.Container) {
    super();
  }

  start() {
    this.stage.addChild(this);
    this.addChild(this.background);
    this.bulletShotCount = 0;
    this.sendNextBastard();

    this.birdy = new Birdy();
    this.birdy.y = (GameDimensions.GAME_HEIGHT - this.birdy.height) / 2;
    this.birdy.on(BirdEvents.SHOOT_BULLET, () => {
      this.shootBullet();
    });

    this.addChild(this.birdy);
    document.addEventListener('keydown', this.onKeydownProxy);
    Ticker.add(this.checkBirdsVsBastards, this);
    Ticker.add(this.checkBulletsVsBastards, this);
    this.birdy.on(BirdEvents.BIRDY_DIED, this.gameEndProxy);
  }

  sendNextBastard(delay: number = 0) {
    // TODO: use document.hasFocus() and window.onblur to pause
    this.nextBastardTimeout = setTimeout(() => {
      const bastard = new Bastard();
      this.activeBastards.push(bastard);
      bastard.activate();
      this.stage.addChild(bastard);
      this.sendNextBastard(randNumber(this.bastardBaseTimeGap.min, this.bastardBaseTimeGap.max));
    }, delay);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.birdy.move('up');
    }
    if (event.key === 'ArrowDown') {
      this.birdy.move('down');
    }
    if (event.key === 'ArrowLeft') {
      this.birdy.move('left');
    }
    if (event.key === 'ArrowRight') {
      this.birdy.move('right');
    }
    if (event.key === ' ') {
      this.birdy.shoot();
    }
  }
  shootBullet() {
    const bullet =
      new Bullet(new PIXI.Point(this.birdy.x + this.birdy.width, this.birdy.y + this.birdy.shootStartingPoint.y));
    this.addChild(bullet);
    this.activeBullets.push(bullet);
  }
  checkBirdsVsBastards() {
    this.activeBastards.forEach((bastard, index) => {
      if (!bastard.isActive) {
        return this.activeBastards.splice(index, 1);
      }
      if (detectCollision(this.birdy, bastard, 30)) {
       this.birdy.explode();
       Ticker.remove(this.checkBirdsVsBastards, this);
       clearTimeout(this.nextBastardTimeout);
      }
    });
  }

  checkBulletsVsBastards() {
    this.activeBullets.forEach((bullet, index) => {
      if (!bullet.parent) {
        return this.activeBullets.splice(index, 1);
      }
      this.activeBastards.forEach((bastard) => {
        if (detectCollision(bullet, bastard)) {
          bastard.explode();
          bullet.remove();
        }
      });
    });
  }

  endGame() {
    document.removeEventListener('keydown', this.onKeydownProxy);
    this.activeBastards.forEach((bastard) => {
      bastard.cleanUp();
      bastard.destroy();
    });
    Ticker.remove(this.checkBirdsVsBastards, this);
    Ticker.remove(this.checkBulletsVsBastards, this);
    this.birdy.off(BirdEvents.BIRDY_DIED, this.gameEndProxy);
    this.emit(Events.GAME_ENDED);
  }
  startGame() {}
}
