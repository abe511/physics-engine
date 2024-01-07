
export default class Vector {

  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static dot(v1: Vector, v2: Vector): number {
    return (v1.x * v2.x + v1.y * v2.y);
  }

  add(v: Vector): Vector {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  subtract(v: Vector): Vector {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  mult(n: number): Vector {
    return new Vector(this.x * n, this.y * n);
  }
  
  mag(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  unit(): Vector {
    const magnitude = this.mag();
    if(magnitude) {
      return new Vector(this.x / magnitude, this.y / magnitude);
      // return new Vector(this.x / this.mag(), this.y / this.mag());
    }
    return new Vector(0, 0);
  }

  normal(): Vector {
    return new Vector(-this.y, this.x);
  }

  drawVec(ctx: CanvasRenderingContext2D, startX: number, startY: number, n: number, color: CanvasFillStrokeStyles["strokeStyle"]): void {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + this.x * n, startY + this.y * n);
    ctx.stroke();
  }

}