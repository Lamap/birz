import * as PIXI from 'pixi.js';
import { GameDimensions } from '../index';
import { Ticker } from '../index';

export class RunningClouds extends PIXI.Container {
  private firstBackground: PIXI.TilingSprite = new PIXI.TilingSprite(
    PIXI.Texture.from('../assets/imgs/backgrounds/clouds.jpg'),
      GameDimensions.GAME_WIDTH,
      GameDimensions.GAME_HEIGHT
    );
  private secondBackground: PIXI.TilingSprite = new PIXI.TilingSprite(
    PIXI.Texture.from('../assets/imgs/backgrounds/clouds.jpg'),
    GameDimensions.GAME_WIDTH,
    GameDimensions.GAME_HEIGHT
  );
  constructor() {
    super();
    this.firstBackground.alpha = 0.5;
    this.secondBackground.alpha = 0.5;
    this.addChild(this.firstBackground);
    this.addChild(this.secondBackground);

    Ticker.add(this.moveBgs, this);
  }

  moveBgs() {
    this.firstBackground.tilePosition.x -= 0.5;
    this.secondBackground.tilePosition.x -= 1;
  }

  stop() {
    Ticker.remove(this.moveBgs, this);
  }
}
