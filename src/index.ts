import Ball from "./Ball.js";
import { Controller, KeyMapping } from "./Controller.js";
import Vector from "./Vector.js";


class Scene {

  private ctx: CanvasRenderingContext2D | null;
  private sceneObjects: Ball[];
  private mode: number;
  private ctrl1: Controller | undefined;
  private ctrl2: Controller | undefined;
  private distance: Vector;

  constructor() {
    this.ctx = this.create();
    this.sceneObjects = [];
    this.mode = 1; // 0 - single player, 1 - two players 
    this.distance = new Vector(0, 0);

    if(this.ctx) {
      this.populate();
      if(this.mode > 0) {
        this.ctrl2 = this.setupController(1);
      }
      this.ctrl1 = this.setupController(0);
    }
  }

  // context
  create() {
    const container = document.querySelector("#container");
    const cnv = document.createElement("canvas");
    cnv.setAttribute("width", "800");
    cnv.setAttribute("height", "600");
    cnv.setAttribute("tabindex", "0");
    if(container) {
      container.appendChild(cnv);
      cnv.focus();
      return cnv.getContext("2d");
    }
    console.log(`Canvas creation failed. Provide a 'div' element with id="container"`);
    return null;
  }
  

  // objects
  populate() {

    const objects = [
      {x: 100, y: 200, r: 30, m: 100, e: 1, fill: "gray", stroke: "navy", guides: true},
      {x: 300, y: 300, r: 30, m: 10, e: 1, fill: "lightgray", stroke: "red", guides: true},
      {x: 500, y: 400, r: 20, m: 0.5, e: 1,  fill: "hotpink", stroke: "crimson", guides: true},
      {x: 550, y: 400, r: 20, m: 0.5, e: 0.5,  fill: "orchid", stroke: "deeppink", guides: true},
      {x: 500, y: 450, r: 20, m: 1.0, e: 0.5,  fill: "lightcoral", stroke: "maroon", guides: true},
      {x: 550, y: 450, r: 20, m: 0.5, e: 0,  fill: "pink", stroke: "salmon", guides: true},
    ];

    for(let obj of objects) {
      this.sceneObjects.push(new Ball(obj.x, obj.y, obj.r, obj.m, obj.e, obj.fill, obj.stroke, obj.guides));
    }
  }

  // controls
  setupController(player: number) {

    const keys: KeyMapping[] = [
      {
        LEFT: "ArrowLeft",
        UP: "ArrowUp",
        RIGHT: "ArrowRight",
        DOWN: "ArrowDown"
      },
      {
        LEFT: "KeyA",
        UP: "KeyW",
        RIGHT: "KeyD",
        DOWN: "KeyS"
      }
    ];
    return new Controller(this.ctx!, this.sceneObjects[player], keys[player]);
  }

  // detect and resolve collision if the distance between objects is <= the sum of their radii
  collisionDetection(obj1: Ball, obj2: Ball) {
    this.distance = obj1.pos.subtract(obj2.pos);
    const distance: number = this.distance.mag();
    const collStatus: boolean = distance <= obj1.r + obj2.r;

    if(collStatus) {
      this.penetrationResolution(obj1, obj2);
      this.collisionResponse(obj1, obj2);
    }
    return collStatus;
  }

  // move objects in opposing directions to half of their penetration depth
  penetrationResolution(obj1: Ball, obj2: Ball) {
    const penDepth: number = obj1.r + obj2.r - this.distance.mag();
    const resolutionDist: Vector = this.distance.unit().mult(penDepth / (obj1.mInv + obj2.mInv));

    obj1.pos = obj1.pos.add(resolutionDist.mult(obj1.mInv));
    obj2.pos = obj2.pos.add(resolutionDist.mult(-obj2.mInv));
  }

  // resolve collision
  collisionResponse(obj1: Ball, obj2: Ball) {
    const normal: Vector = obj1.pos.subtract(obj2.pos).unit(); // unit vector from center1 to center2
    const relativeVelocity: Vector = obj1.vel.subtract(obj2.vel); // difference between velocity vectors of objects
    const separatingVelocityBefore: number = Vector.dot(relativeVelocity, normal); // dot product of relative velocity and collision normal
    const separatingVelocityAfter: number = -separatingVelocityBefore * obj1.elasticity * obj2.elasticity; // direct opposite of velocity before the collision for elastic collisions (e=1) 
    // const separatingVelocityAfter: number = -separatingVelocityBefore * Math.min(obj1.elasticity, obj2.elasticity); 
    const separatingVelocityVector: Vector = normal.mult(separatingVelocityAfter); // with direction of collision normal and magnitude of separating velocity after the collision

    const separatingVelocityDiff: number = separatingVelocityAfter -separatingVelocityBefore;
    const impulse: number = separatingVelocityDiff / (obj1.mInv + obj2.mInv); // separating velocity diff divided by sum of inverse masses
    const impulseVector: Vector = normal.mult(impulse);

    obj1.vel = obj1.vel.add(impulseVector.mult(obj1.mInv));
    obj2.vel = obj2.vel.add(impulseVector.mult(-obj2.mInv));
  }


  // loop
  animate() {

    this.ctx!.clearRect(0, 0, this.ctx!.canvas.width, this.ctx!.canvas.height);

    this.sceneObjects.forEach((obj, idx) => {
      obj.draw(this.ctx!);
      obj.displace();
      for(let i = idx + 1; i < this.sceneObjects.length; ++i) {
        this.collisionDetection(obj, this.sceneObjects[i]);
      }
    });

    this.ctrl1!.move();
    this.ctrl2!.move();
    this.ctrl1!.draw(this.ctx!);

    requestAnimationFrame(() => {this.animate()});
  };

}

const scene = new Scene();
requestAnimationFrame(scene.animate.bind(scene));
// scene.animate();
