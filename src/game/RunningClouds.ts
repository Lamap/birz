import * as PIXI from 'pixi.js';
import { GameDimensions } from '../index';
import { Ticker } from '../index';

export class RunningClouds extends PIXI.Container {
  private firstBackground: PIXI.TilingSprite = new PIXI.TilingSprite(
    PIXI.Texture.from('../assets/imgs/backgrounds/clouds_1.png'),
      GameDimensions.GAME_WIDTH,
      GameDimensions.GAME_HEIGHT
    );
  private secondBackground: PIXI.TilingSprite = new PIXI.TilingSprite(
    PIXI.Texture.from('../assets/imgs/backgrounds/clouds_2.png'),
    GameDimensions.GAME_WIDTH,
    GameDimensions.GAME_HEIGHT
  );
  private staticBackground: PIXI.Graphics = new PIXI.Graphics();
// 7dc6ef
  constructor() {
    super();
    this.addBlueRectangle();
    this.addChild(this.firstBackground);
    this.addChild(this.secondBackground);
    const filter = new PIXI.filters.BlurFilter(1);
    this.secondBackground.filters = [filter];
    this.firstBackground.filters = [filter];
    Ticker.add(this.moveBgs, this);
  }

  addBlueRectangle() {
    this.staticBackground.beginFill(0x7dc6ef);
    this.staticBackground.drawRect(0, 0, GameDimensions.GAME_WIDTH, GameDimensions.GAME_HEIGHT);
    this.staticBackground.endFill();
    this.addChild(this.staticBackground);
  }

  moveBgs() {
    this.firstBackground.tilePosition.x -= 0.5;
    this.secondBackground.tilePosition.x -= 0.7;
  }

  stop() {
    Ticker.remove(this.moveBgs, this);
  }
}
