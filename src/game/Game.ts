import * as PIXI from 'pixi.js';
import { RunningClouds } from './RunningClouds';
import { Bastard } from './Bastard';
import { GameDimensions, Ticker } from '../index';
import { randNumber, detectCollision } from '../utils/Utils';
import { Birdy } from './Birdy';
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
    min: 2500,
    max: 4000
  };

  constructor(private stage: PIXI.Container) {
    super();
    console.log('game');
  }

  start() {
    console.log('gameStart');
    this.stage.addChild(this);
    this.addChild(this.background);
    this.bulletShotCount = 0;
    this.sendNextBastard();

    this.birdy = new Birdy();
    this.addChild(this.birdy);
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      this.onKeydown(event);
    });
    Ticker.add(this.checkBirdsVsBastards, this);
    Ticker.add(this.checkBulletsVsBastards, this);
  }

  sendNextBastard(delay: number = 2000) {
    setTimeout(() => {
      const bastard = new Bastard();
      this.activeBastards.push(bastard);
      console.log(bastard);
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
      const bullet =
        new Bullet(new PIXI.Point(this.birdy.x + this.birdy.width, this.birdy.y + this.birdy.shootStartingPoint.y));
      this.addChild(bullet);
      this.activeBullets.push(bullet);
      console.log(this.activeBullets);
    }
  }

  checkBirdsVsBastards() {
    console.log(this.activeBastards.length, this.activeBullets.length);
    this.activeBastards.forEach((bastard, index) => {
      if (!bastard.parent) {
        return this.activeBastards.splice(index, 1);
      }
      if (detectCollision(this.birdy, bastard)) {
       this.birdy.explode();
       Ticker.remove(this.checkBirdsVsBastards, this);
       Ticker.stop();
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
}
