import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFshader, CGFtexture } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MyPanorama } from "./Objects/MyPanorama.js";
import { MyGarden } from "./Objects/MyGarden.js";
import { MyRockSet } from "./Objects/MyRockSet.js";
import { MyBee } from "./Objects/MyBee.js";
import { MyPollen } from "./Objects/MyPollen.js";
import { MyHive } from "./Objects/MyHive.js";
import { MyGrass } from './Objects/MyGrass.js';
import { MyRock} from './Objects/MyRock.js';
import { MySingularGrass } from "./Objects/MySingularGrass.js";
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
    
    let planeMaterial = new CGFappearance(this);
    planeMaterial.setTexture(new CGFtexture(this, 'images/grass3.jpg'));
    planeMaterial.setTextureWrap('REPEAT', 'REPEAT');
    planeMaterial.setShininess(10.0);

    this.plane = new MyPlane(this, 30, planeMaterial);
    this.panorama = new MyPanorama(this, new CGFtexture(this, 'images/panorama.jpg'), 200);
    this.rockSet = new MyRockSet(this, 3, 1);
    this.pollen = new MyPollen(this, 16, 8, 0.5);
    this.hive = new MyHive(this);
    this.bee = new MyBee(this, this.hive);
    this.grass = new MyGrass(this, 50, 50, 500, 3); // 500 blades of grass over a 50x50 area
    this.singularGrass = new MySingularGrass(this, 1, 5, 3);
    //this.singularGrass = new MySingularGrass(this, 0.5, 2, 4);
    this.shader = new CGFshader(this.gl, "shaders/shader.vert", "shaders/shader.frag");

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

  updateGardenDimensions() {
    // Update the garden with new dimensions
    this.garden.updateDimensions(this.gardenRows, this.gardenCols, this.flowerSpacing); 
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



  update(t) {
    this.bee.update(t);
    this.checkKeys();  // Check key states and react

    this.shader.setUniformsValues({ timeFactor: t / 100 % 100 });
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

        this.bee.goToPosition(position);
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

      
    this.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);
    

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
    this.translate(12, 0, 0);
    this.scale(this.beeScale, this.beeScale, this.beeScale);
    //this.bee.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(12,0,0);
    //this.garden.display();
    this.popMatrix();

    this.pushMatrix();
    this.scale(3.5, 3.5, 3.5);
    this.translate(0, 0.5, 0);
    //this.rockSet.display();
    this.popMatrix();

    this.pushMatrix();
    this.translate(0, 12, 0);
    //this.hive.display();
    this.popMatrix();

    /*
    this.pushMatrix();
    this.scale(1.3, 1.3, 1.3);
    this.grass.display();
    this.popMatrix();
    */
    
    
    this.pushMatrix();
    this.translate(0, 0, 0);
    this.setActiveShader(this.shader);
    this.singularGrass.display();
    this.setActiveShader(this.defaultShader);
    this.popMatrix();
    



    this.popMatrix();


    // ---- END Primitive drawing section
  }
}
