import * as PIXI from 'pixi.js';

export const Events = {
  START_GAME: 'startGame',
};

export class MenuScreen extends PIXI.Container {
  private background: PIXI.Sprite = PIXI.Sprite.from('../assets/imgs/backgrounds/clouds.jpg');

  // TODO: create buttonComponent
  private playGame1Button = new PIXI.Text('Play #1');
  private playGame2Button = new PIXI.Text('Play #2');
  private playGame3Button = new PIXI.Text('Play #3');

  constructor() {
    super();
    console.log('MenuScreen');
    this.alpha = 0.5;
    this.addChild(this.background);
    this.addChild(this.playGame1Button);
    this.addChild(this.playGame2Button);
    this.addChild(this.playGame3Button);

    this.playGame1Button.interactive = true;
    this.playGame1Button.buttonMode = true;
    this.playGame1Button.on('click', () => {
      this.emit(Events.START_GAME, 1);
    });

    this.playGame2Button.interactive = true;
    this.playGame2Button.buttonMode = true;
    this.playGame2Button.on('click', () => {
      this.emit(Events.START_GAME, 2);
    });
    this.playGame2Button.y = 30;

    this.playGame3Button.interactive = true;
    this.playGame3Button.buttonMode = true;
    this.playGame3Button.on('click', () => {
      this.emit(Events.START_GAME, 3);
    });
    this.playGame3Button.y = 60;
  }
}


