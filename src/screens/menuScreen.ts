import * as PIXI from 'pixi.js';
import { GameDimensions } from '../index';
import {Birdy} from '../game/Birdy/Birdy';

export const Events = {
  START_GAME: 'startGame',
};

export class MenuScreen extends PIXI.Container {
  private background: PIXI.Sprite = PIXI.Sprite.from('../assets/imgs/backgrounds/clouds.jpg');

  private playGame1Button = new PIXI.Text('Play #1', new PIXI.TextStyle({align: 'center', fontWeight: 'bold'}));
  private playGame2Button = new PIXI.Text('Play #2');
  private playGame3Button = new PIXI.Text('Play #3');
  // TODO: create buttonComponent
  private birdyLogo: Birdy = new Birdy(true);

  constructor() {
    super();
    this.background.alpha = 0.5;
    this.addChild(this.background);
    this.addChild(this.birdyLogo);
    this.addChild(this.playGame1Button);
    this.addChild(this.playGame2Button);
    this.addChild(this.playGame3Button);

    this.birdyLogo.y = 100;

    this.playGame1Button.interactive = true;
    this.playGame1Button.buttonMode = true;
    this.playGame1Button.on('click', () => {
      this.emit(Events.START_GAME, 1);
    });
    this.playGame1Button.y = 310;

    this.playGame2Button.interactive = true;
    this.playGame2Button.buttonMode = true;
    this.playGame2Button.on('click', () => {
      this.emit(Events.START_GAME, 2);
    });
    this.playGame2Button.y = 340;

    this.playGame3Button.interactive = true;
    this.playGame3Button.buttonMode = true;
    this.playGame3Button.on('click', () => {
      this.emit(Events.START_GAME, 3);
    });
    this.playGame3Button.y = 370;

    const instructions = new PIXI.Text('Use arrow keys for navigating, space for shooting');
    this.addChild(instructions);

    this.alignHorizontalCenter(this.birdyLogo);
    this.alignHorizontalCenter(this.playGame1Button);
    this.alignHorizontalCenter(this.playGame2Button);
    this.alignHorizontalCenter(this.playGame3Button);
  }

  alignHorizontalCenter(item: PIXI.Container) {
    item.x = (GameDimensions.GAME_WIDTH - item.width) / 2;
  }
}


