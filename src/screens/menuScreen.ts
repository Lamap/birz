import * as PIXI from 'pixi.js';
import { introFrames, IAnimationFrame } from './introAnimConfig';

export const Events = {
  START_GAME: 'startGame',
};

export class MenuScreen extends PIXI.Container {
  private background: PIXI.Sprite = PIXI.Sprite.from('../assets/imgs/backgrounds/clouds.jpg');

  // TODO: create buttonComponent
  private playGame1Button = new PIXI.Text('Play #1');
  private playGame2Button = new PIXI.Text('Play #2');
  private playGame3Button = new PIXI.Text('Play #3');
  private anim: PIXI.AnimatedSprite;

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

    this.initAnimation();
  }

  initAnimation() {
    const frames: PIXI.Texture[] = [];
    introFrames.concat(introFrames.reverse());
    introFrames.forEach(frame => {
      for (let i = 0; i < frame.duration; i++) {
        frames.push(PIXI.Texture.from(frame.src));
      }
    });
    this.anim = new PIXI.AnimatedSprite(frames);
    this.anim.animationSpeed = 0.3;
    this.anim.play();
    this.addChild(this.anim);
  }
}


