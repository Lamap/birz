import * as PIXI from 'pixi.js';
import { SplashScreen, Events as SplashEvents } from './screens/splash';
import { MenuScreen, Events as MenuEvents } from './screens/menuScreen';
import { Game, Events as GameEvents } from './game/Game';

export const GameDimensions = {
  GAME_WIDTH: 800,
  GAME_HEIGHT: 600
};
export let Ticker: PIXI.Ticker;

class App {
  public app: PIXI.Application;
  private splashScreen = new SplashScreen(2000);
  private menuScreen = new MenuScreen();
  private game: Game;

  constructor() {
    this.app = new PIXI.Application({
      width: GameDimensions.GAME_WIDTH,
      height: GameDimensions.GAME_HEIGHT,
      transparent: true
    });
    Ticker = this.app.ticker;

    this.app.stage.addChild(this.splashScreen);
    document.body.appendChild(this.app.view);

    this.splashScreen.on(SplashEvents.TIMED_OUT, () => {
      this.loadMenuScreen();
    });
    this.menuScreen.on(MenuEvents.START_GAME, (version: number) => {
      this.loadGame(version);
    });
  }

  loadMenuScreen() {
    this.app.stage.addChild(this.menuScreen);
  }

  loadGame(version: number) {
    console.log('loadGame', version);
    this.app.stage.removeChild(this.menuScreen);
    this.game = new Game(this.app.stage);
    this.game.start();
  }
}

const app = new App();
