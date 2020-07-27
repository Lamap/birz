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

    this.game = new Game(this.app.stage);
    this.game.on(GameEvents.GAME_ENDED, () => {
      this.app.stage.removeChild(this.game);
      this.loadMenuScreen();
    });
  }

  loadMenuScreen() {
    this.app.stage.addChild(this.menuScreen);
  }

  loadGame(version: number) {
    this.app.stage.removeChild(this.menuScreen);
    this.game.start();
  }
}

// (window as any).debugMode = true;
const app = new App();
