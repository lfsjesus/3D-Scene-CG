import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFshader, CGFtexture } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MyPanorama } from "./Objects/MyPanorama.js";
import { MyGarden } from "./Objects/MyGarden.js";
import { MyRockSet } from "./Objects/MyRockSet.js";
import { MyBee } from "./Objects/MyBee.js";
import { MyPollen } from "./Objects/MyPollen.js";
import { MyHive } from "./Objects/MyHive.js";
import { MyGrass } from './Objects/MyGrass.js';

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
    this.currentCamera = 0; // 0 for default camera, 1 for bee-following camera
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
    
    let planeMaterial = new CGFappearance(this);
    planeMaterial.setTexture(new CGFtexture(this, 'images/grass3.jpg'));
    planeMaterial.setTextureWrap('REPEAT', 'REPEAT');
    planeMaterial.setShininess(10.0);

    this.plane = new MyPlane(this, 30, planeMaterial);
    this.panorama = new MyPanorama(this, new CGFtexture(this, 'images/panorama.jpg'), 200);
    this.rockSet = new MyRockSet(this, 3);
    this.bee = new MyBee(this);
    this.pollen = new MyPollen(this, 16, 8, 0.5);
    this.hive = new MyHive(this);
    this.grass = new MyGrass(this, 50, 50, 1000); // 500 blades of grass over a 50x50 area


    //Objects connected to MyInterface
    this.displayAxis = true;
    this.scaleFactor = 1;
    this.gardenRows = 5; // número de linhas no jardim
    this.gardenCols = 5; // número de colunas no jardim
    this.flowerSpacing = 7 // distância entre as flores
    this.speedFactor = 0.5;
    this.beeScale = 1;

    //this.garden = new MyGarden(this, this.gardenRows, this.gardenCols, this.flowerSpacing);

    this.garden = new MyGarden(this, 1, 1, this.flowerSpacing);


    this.enableTextures(true);

    //bee animation
    this.setUpdatePeriod(50); // **at least** 50 ms between animations
  }

  initCameras() {
    this.defaultCamera = new CGFcamera(
      1.0,
      0.1,
      1000,
      vec3.fromValues(10, 5, 5),
      vec3.fromValues(0, 0, 0)
    );

    this.beeCamera = new CGFcamera(
      1.0,
      0.1,
      1000,
      vec3.fromValues(0, 5, 10),
      vec3.fromValues(0, 0, 0)
    );

    this.camera = this.defaultCamera;

  }


  update(t) {
    this.bee.update(t);
    this.checkKeys();  // Check key states and react

    if (this.currentCamera === 1) {
      this.updateBeeCamera();
    }

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
        this.bee.position = { x: 0, y: 20, z: 0 };
        this.bee.orientation = 0;
        this.bee.velocity = { x: 0, y: 0, z: 0 };
    }

    if (this.gui.isKeyPressed("KeyF")) {
      let flowerAndPosition = this.findClosestFlower(); 

      if (flowerAndPosition) {
        let flower = flowerAndPosition[0];
        let position = flowerAndPosition[1];

        //this.bee.goToPosition(position);
        this.bee.goDown(flower.pollen, flower.pollenHeight, flower.pollenOffsetZ);
              
      }
    }

    if (this.gui.isKeyPressed("KeyP")) {
      let flowerAndPosition = this.findClosestFlower();

      if (flowerAndPosition) {
        let flower = flowerAndPosition[0];
        let position = flowerAndPosition[1];

        this.bee.pickUpPollen(flower.pollen, position, flower);
      }
    
    }

    if (this.gui.isKeyPressed("KeyO")) {

      this.bee.goToPosition([-13,-1.5], true);
      
    }

    if (this.gui.isKeyPressed("KeyC")) {
      this.toggleCamera();
    }

  }

  updateBeeCamera() {
    const beePos = this.bee.position;
    const cameraOffset = vec3.fromValues(30, 30, 5); // Adjust the offset as needed

    const beeCameraPos = vec3.create();
    vec3.add(beeCameraPos, [beePos.x, beePos.y, beePos.z], cameraOffset);

    this.beeCamera.setPosition(beeCameraPos);
    this.beeCamera.setTarget([beePos.x, beePos.y, beePos.z]);
}


  toggleCamera() {
    this.currentCamera = (this.currentCamera + 1) % 2;
    if (this.currentCamera === 0) {
      this.camera = this.defaultCamera;
    } else {
      this.camera = this.beeCamera;
      this.updateBeeCamera();
    }
    this.interface.setActiveCamera(this.camera);
  }


  findClosestFlower() {
    let minDist = Infinity;
    let closestFlower = null;
    let flowerPosition = null;


    for (let item of this.garden.flowers) {
      let flower = item.flower;
      let position = item.position;

      let dist = Math.sqrt(
        Math.pow(this.bee.position.x - position[0], 2) +
        Math.pow(this.bee.position.z - position[1], 2)
      );

      if (dist < minDist) {
        minDist = dist;
        closestFlower = flower;
        flowerPosition = position;

      }  

    }
    return [closestFlower, flowerPosition];
    
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
    //this.translate(0, -100, 0);
    this.scale(400, 400, 400);
    this.rotate(-Math.PI / 2.0, 1, 0, 0);
    this.plane.display();
    this.popMatrix();

    this.pushMatrix();
    this.panorama.display();
    this.popMatrix();

    this.pushMatrix();
    //this.translate(12, 0, 0);
    this.garden.display();
    this.popMatrix();

    this.pushMatrix();
    this.scale(3.5, 3.5, 3.5);
    //this.rockSet.display();
    this.popMatrix();

    this.pushMatrix();
    this.scale(this.beeScale, this.beeScale, this.beeScale);
    this.translate(12, 0, 0);
    //this.bee.display();
    this.popMatrix();


    this.pushMatrix();
    this.translate(0, 12, 0);
    //this.hive.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(0, 0, 0);
    this.scale(1.3, 1.3, 1.3);
    //this.grass.display();
    this.popMatrix();




    // ---- END Primitive drawing section
  }
}
