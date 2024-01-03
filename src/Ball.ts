import Vector from "./Vector.js";

export default class Ball {

  // x: number;
  // y: number;
  pos: Vector;
  r: number;
  vel: Vector;
  acc: Vector;
  acceleration: number;
  friction: number;
  maxSpeed: number;
  fill: CanvasFillStrokeStyles["fillStyle"];
  stroke: CanvasFillStrokeStyles["strokeStyle"];
  guides: boolean;

  constructor(x: number, y: number, r: number, fill: CanvasFillStrokeStyles["fillStyle"]="#aabbcc", stroke: CanvasFillStrokeStyles["strokeStyle"]="112233", guides: boolean) {
    // this.x = x;
    // this.y = y;
    this.pos = new Vector(x, y);
    this.r = r;
    this.vel = new Vector(0, 0);
    this.acc = new Vector(0, 0);
    this.acceleration = 0.1;
    this.friction = 0.1;
    this.maxSpeed = 2;
    this.fill = fill;
    this.stroke = stroke;
    this.guides = guides;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.fill;
    ctx.strokeStyle = this.stroke;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y , this.r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if(this.guides) {
      // this.vel.drawVec(ctx, this.x, this.y, 10, "#444");
      // this.acc.drawVec(ctx, this.x, this.y, 100, "#aaa");
      // this.vel.unit().drawVec(ctx, ctx.canvas.width - 50, ctx.canvas.height - 50, 10, "#444");
      // this.acc.unit().drawVec(ctx, ctx.canvas.width - 50, ctx.canvas.height - 50, 100, "#aaa");
      this.acc.unit().drawVec(ctx, ctx.canvas.width - 50, ctx.canvas.height - 50, this.r, "#aaa");
      this.acc.unit().normal().drawVec(ctx, ctx.canvas.width - 50, ctx.canvas.height - 50, this.r, "green");
      this.vel.unit().drawVec(ctx, ctx.canvas.width - 50, ctx.canvas.height - 50, this.r, "#444");
      // this.vel.drawVec(ctx, ctx.canvas.width - 50, ctx.canvas.height - 50, 10, "#444");
      // this.acc.drawVec(ctx, ctx.canvas.width - 50, ctx.canvas.height - 50, 100, "#aaa");
    }
    ctx.restore();
  }

}
