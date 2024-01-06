import Ball from "./Ball.js";

export interface KeyMapping {
  LEFT: string;
  UP: string;
  RIGHT: string;
  DOWN: string;
}

export class Controller {

  private left: boolean = false;
  private up: boolean = false;
  private right: boolean = false;
  private down: boolean = false;
  private ctx: CanvasRenderingContext2D;
  private obj: Ball;
  private controls: KeyMapping;

  constructor(context: CanvasRenderingContext2D, object: Ball, controls: KeyMapping) {
    this.left = false;
    this.up = false;
    this.right = false;
    this.down = false;
    this.ctx = context;
    this.obj = object;
    this.controls = controls;

    // this.setKeyboardEvent("keydown");
    // this.setKeyboardEvent("keyup");
    
    // setKeyboardEvent(event: keyof HTMLElementEventMap) {
    //   const value = event === "keydown" ? true : false;
    //   this.ctx.canvas.addEventListener(event, (e: KeyboardEvent) => {
    //     if(e.code === this.controls.LEFT) {
    //       this.left = value;
    //     }
    //     if(e.code === this.controls.UP) {
    //       this.up = value;
    //     }
    //     if(e.code === this.controls.RIGHT) {
    //       this.right = value;
    //     }
    //     if(e.code === this.controls.DOWN) {
    //       this.down = value;
    //     }
    //   });
    // }
		

    this.ctx.canvas.addEventListener("keydown", (e: KeyboardEvent) => {
      if(e.code === this.controls.LEFT) {
        this.left = true;
      }
      if(e.code === this.controls.UP) {
        this.up = true;
      }
      if(e.code === this.controls.RIGHT) {
        this.right = true;
      }
      if(e.code === this.controls.DOWN) {
        this.down = true;
      }
    });

    this.ctx.canvas.addEventListener("keyup", (e: KeyboardEvent) => {
      if(e.code === this.controls.LEFT) {
        this.left = false;
      }
      if(e.code === this.controls.UP) {
        this.up = false;
      }
      if(e.code === this.controls.RIGHT) {
        this.right = false;
      }
      if(e.code === this.controls.DOWN) {
        this.down = false;
      }
    });

  }

  move() {
    // accelerate on key press
    if(this.left && this.obj.vel.x >= -this.obj.maxSpeed) {
      this.obj.acc.x -= this.obj.acceleration;
      // this.obj.acc.x = -this.obj.acceleration;
    }
    if(this.up && this.obj.vel.y >= -this.obj.maxSpeed) {
      this.obj.acc.y -= this.obj.acceleration;
      // this.obj.acc.y = -this.obj.acceleration;
    }
    if(this.right && this.obj.vel.x <= this.obj.maxSpeed) {
      this.obj.acc.x += this.obj.acceleration;
      // this.obj.acc.x = this.obj.acceleration;
    }
    if(this.down && this.obj.vel.y <= this.obj.maxSpeed) {
      this.obj.acc.y += this.obj.acceleration;
      // this.obj.acc.y = this.obj.acceleration;
    }

    // stop accelerating if no key is pressed
    if(!this.up && !this.down) {
      this.obj.acc.y = 0;
    }
    if(!this.left && !this.right) {
      this.obj.acc.x = 0;
    }

  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = "rgba(100, 100, 100, 0.2)";
    ctx.strokeStyle = "#aaa";
    ctx.beginPath();
    ctx.arc(ctx.canvas.width - 50, ctx.canvas.height - 50 , 30, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

}
