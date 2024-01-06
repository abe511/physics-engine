import Vector from "./Vector.js";

export default class Ball {

  pos: Vector;
  r: number;
  m: number;
  mInv: number;
  vel: Vector;
  acc: Vector;
  acceleration: number;
  friction: number;
  elasticity: number;
  maxSpeed: number;
  fill: CanvasFillStrokeStyles["fillStyle"];
  stroke: CanvasFillStrokeStyles["strokeStyle"];
  guides: boolean;

  constructor(x: number, y: number, r: number, m: number, e: number, fill: CanvasFillStrokeStyles["fillStyle"]="#aabbcc", stroke: CanvasFillStrokeStyles["strokeStyle"]="112233", guides: boolean) {
    this.pos = new Vector(x, y);
    this.r = r;
    this.m = m;
    this.mInv = this.m != 0 ? 1 / this.m : 0;
    this.vel = new Vector(0, 0);
    this.acc = new Vector(0, 0);
    this.acceleration = 0.1;
    this.friction = 0.1;
    this.elasticity = e;
    this.maxSpeed = 2;
    this.fill = fill;
    this.stroke = stroke;
    this.guides = guides;
  }

  displace() {

    // add acceleration to velocity 
    this.vel = this.vel.add(this.acc);

    // decrease velocity due to friction
    this.vel = this.vel.mult(1 - this.friction);

    // change position due to velocity
		this.pos = this.pos.add(this.vel);
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
