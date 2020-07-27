import * as PIXI from 'pixi.js';
// import { Ticker } from '../index';

export class DebuggableContainer extends PIXI.Container {
  public debugRect: PIXI.Graphics;
  private drawing: number;
  constructor() {
    super();
    if ((window as any).debugMode) {
      this.debugRect = new PIXI.Graphics();
      this.drawing = setInterval(() => {
        this.drawRect();
      }, 200);

      this.addChild(this.debugRect);
    }
  }
  destroy() {
    clearInterval(this.drawing);
    super.destroy();
  }
  drawRect() {
    this.debugRect.clear();
    this.debugRect.lineStyle(1, 0xFF0000);
    this.debugRect.drawRect(0, 0, this.getBounds().width, this.getBounds().height);
  }
}
