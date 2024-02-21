import { CGFscene, CGFcamera, CGFaxis } from "../lib/CGF.js";
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js";
import { MyTriangleBig } from "./MyTriangleBig.js";


/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
  }
  init(application) {
    super.init(application);
    
    this.initCameras();
    this.initLights();

    //Background color
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    //Initialize scene objects
    this.axis = new CGFaxis(this);
    this.diamond = new MyDiamond(this);
    this.triangle = new MyTriangle(this);
    this.parallelogram = new MyParallelogram(this);
    this.triangleSmall = new MyTriangleSmall(this);
    this.triangleBig = new MyTriangleBig(this);

    //Objects connected to MyInterface
    this.displayAxis = true;
    this.displayDiamond = true;
    this.displayTriangle = true;
    this.displayParallelogram = true;
    this.displayTriangleSmall = true;
    this.displayTriangleBig = true;
    this.scaleFactor = 1;
  }
  initLights() {
    this.lights[0].setPosition(15, 2, 5, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      0.4,
      0.1,
      500,
      vec3.fromValues(15, 15, 15),
      vec3.fromValues(0, 0, 0)
    );
  }
  setDefaultAppearance() {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
  }
  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis
    if (this.displayAxis) this.axis.display();

    // Draw objects
    

    this.setDefaultAppearance();

    var sca = [
      this.scaleFactor,
      0.0,
      0.0,
      0.0,
      0.0,
      this.scaleFactor,
      0.0,
      0.0,
      0.0,
      0.0,
      this.scaleFactor,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
    ];

    this.multMatrix(sca);

    // ---- BEGIN Primitive drawing section

    if (this.displayDiamond){

      //set diffuse to rgba(255,255,0,255)
      this.setDiffuse(0, 1.0, 0.0, 1.0);
   

      let matrixTranslate = 
                        [1, 0, 0, 0,
                         0, 1, 0, 0,
                         0, 0, 1, 0,
                         0, 1, 0, 1];

      this.multMatrix(matrixTranslate);
      this.diamond.display();                   
    }

    if (this.displayTriangleBig){
      // we will now use CGFscene.translate(x, y, z) , etc and CGFscene.pushMatrix() and CGFscene.popMatrix()


      this.pushMatrix();
      // set diffuse to rgba(255,155,0,255)
      this.setDiffuse(1.0, 0.6, 0.0, 1.0);
      this.translate(0.58, -2.415, 0);
      this.rotate(-Math.PI/4, 0, 0, 1);
      this.triangleBig.display();
      this.popMatrix();

      this.pushMatrix();
      // set diffuse to rgba(0,155,255,255)
      this.setDiffuse(0, 0.6, 1.0, 1.0);
      this.translate(0, -3.83, 0);
      this.triangleBig.display();
      this.popMatrix();
    }

    if (this.displayTriangleSmall){
    
      this.pushMatrix();
      // set diffuse to rgba(150,80,190,255)
      this.setDiffuse(0.6, 0.3, 0.7, 1.0);
      this.translate(1, -1, 0);
      this.triangleSmall.display();
      this.popMatrix();


      this.pushMatrix();
      // set diffuse to rgba(255,27,27,255)
      this.setDiffuse(1.0, 0.1, 0.1, 1.0);
      this.translate(-2, -2.83, 0);
      this.rotate(-Math.PI/2, 0, 0, 1);
      this.triangleSmall.display();
      this.popMatrix();
    }

    if (this.displayParallelogram){
      this.pushMatrix();
      // set diffuse to rgba(255,255,255,255)
      this.setDiffuse(1.0, 1.0, 0, 1.0);
      this.translate(-3, 0, 0);
      this.rotate(Math.PI, 1, 0, 0);
      this.parallelogram.display();
      this.popMatrix();
    }

    if (this.displayTriangle){
      this.pushMatrix();
      // set diffuse to rgba(255,155,207,255)
      this.setDiffuse(1.0, 0.6, 0.8, 1.0);
      this.translate(-1, 1.415, 0);
      this.rotate(Math.PI/4, 0, 0, 1);
      this.triangle.display();
      this.popMatrix();

    }




    
    



  
    // ---- END Primitive drawing section
  }
}
