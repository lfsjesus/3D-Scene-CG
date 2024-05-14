import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFshader, CGFtexture } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MyPanorama } from "./Objects/MyPanorama.js";
import { MyFlower } from "./Objects/MyFlower.js";
import { MyPetal } from "./Objects/MyPetal.js";
import { MyGarden } from "./Objects/MyGarden.js";
import { MyRockSet } from "./Objects/MyRockSet.js";
import { MyBee } from "./Objects/MyBee.js";
import { MyPaw } from "./Objects/MyPaw.js";
import { MyPollen } from "./Objects/MyPollen.js";

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

    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.enable(this.gl.BLEND);

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
    this.plane = new MyPlane(this, 30);
    this.panorama = new MyPanorama(this, new CGFtexture(this, 'images/panorama.jpg'), 200);
    this.petal = new MyPetal(this, 4, 0, 0, 0);
    this.rockSet = new MyRockSet(this, 3);
    this.flower = new MyFlower(this, 6, 5, 0.5, 0.2, 3, [1.0, 0.0, 0.5, 1.0], [0.0, 1.0, 0.0, 1.0], [0.0, 1.0, 0.0, 1.0], [0.0, 1.0, 0.0, 1.0]); 
    this.bee = new MyBee(this);
    this.pollen = new MyPollen(this, 16, 8, 0.5);

    //Objects connected to MyInterface
    this.displayAxis = true;
    this.scaleFactor = 1;
    this.gardenRows = 5; // número de linhas no jardim
    this.gardenCols = 5; // número de colunas no jardim
    this.flowerSpacing = 7 // distância entre as flores
    this.speedFactor = 0.5;
    this.beeScale = 1;

    this.garden = new MyGarden(this, this.gardenRows, this.gardenCols, this.flowerSpacing);

    this.enableTextures(true);

    //bee animation
    this.setUpdatePeriod(50); // **at least** 50 ms between animations
  }

  update(t) {
    this.bee.update(t);
    this.checkKeys();  // Check key states and react

  }

  checkKeys() {
    if (this.gui.isKeyPressed("KeyW")) {
        this.bee.accelerate(this.speedFactor);
    }
    if (this.gui.isKeyPressed("KeyS")) {
        this.bee.accelerate(-this.speedFactor);
    }
    if (this.gui.isKeyPressed("KeyA")) {
        this.bee.turn(-this.speedFactor * 0.5);
    }
    if (this.gui.isKeyPressed("KeyD")) {
        this.bee.turn(this.speedFactor * 0.5);
    }
    if (this.gui.isKeyPressed("KeyR")) {
        // Reset bee's position, orientation, and velocity
        this.bee.position = { x: 0, y: 0, z: 0 };
        this.bee.orientation = 0;
        this.bee.velocity = { x: 0, y: 0, z: 0 };
    }
}




  initLights() {
    this.lights[0].setPosition(15, 0, 5, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();

    this.lights[1].setPosition(5, 15, 5, 1);
    this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[1].enable();
    this.lights[1].update();

  }
  initCameras() {
    this.camera = new CGFcamera(
      1.0,
      0.1,
      1000,
      vec3.fromValues(10, 5, 5),
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

    //this.garden = new MyGarden(this, this.gardenRows, this.gardenCols, this.flowerSpacing);


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

    // ---- BEGIN Primitive drawing section

    this.pushMatrix();
    this.translate(0, -100, 0);
    this.scale(400, 400, 400);
    this.rotate(-Math.PI / 2.0, 1, 0, 0);
    //this.plane.display();
    this.popMatrix();


    this.pushMatrix();
    //this.flower.display();
    this.popMatrix();

    this.pushMatrix();
    this.panorama.display();
    this.popMatrix();

    this.pushMatrix();
    this.garden.display();
    this.popMatrix();

    this.pushMatrix();
    //this.rock.display();
    this.popMatrix(); 


    this.pushMatrix();
    //this.rockSet.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(0, 5, 0);
    this.scale(this.beeScale, this.beeScale, this.beeScale);
    this.bee.display();
    this.popMatrix();

    this.pushMatrix();
    this.pollen.display();
    this.popMatrix();


    // ---- END Primitive drawing section
  }
}
