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
      {x: 100, y: 200, r: 30, fill: "gray", stroke: "navy", guides: true},
      {x: 300, y: 300, r: 30, fill: "darkblue", stroke: "red", guides: true},
      {x: 500, y: 400, r: 20, fill: "hotpink", stroke: "crimson", guides: true},
      {x: 550, y: 400, r: 20, fill: "orchid", stroke: "deeppink", guides: true},
      {x: 500, y: 450, r: 20, fill: "lightcoral", stroke: "maroon", guides: true},
      {x: 550, y: 450, r: 20, fill: "pink", stroke: "salmon", guides: true},
    ];

    for(let obj of objects) {
      this.sceneObjects.push(new Ball(obj.x, obj.y, obj.r, obj.fill, obj.stroke, obj.guides));
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
    let distance: number = this.distance.mag();
    let collStatus: boolean = distance <= obj1.r + obj2.r;
    if(collStatus) {
      this.collisionResolution(obj1, obj2);
    }
    return collStatus;
  }

  // move objects in opposing directions to half of their collision depth
  collisionResolution(obj1: Ball, obj2: Ball) {
    let collDepth: number = obj1.r + obj2.r - this.distance.mag();
    let resolutionDist: Vector = this.distance.unit().mult(collDepth * 0.5);
    obj1.pos = obj1.pos.add(resolutionDist);
    obj2.pos = obj2.pos.add(resolutionDist.mult(-1));
  }

  // loop
  animate() {

    this.ctx!.clearRect(0, 0, this.ctx!.canvas.width, this.ctx!.canvas.height);

    this.sceneObjects.forEach((obj, idx) => {
      obj.draw(this.ctx!);
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
