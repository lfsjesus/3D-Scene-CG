import {CGFobject} from '../../lib/CGF.js';
import {MySphere} from '../Primitives/MySphere.js';
import {MyCylinder} from '../Primitives/MyCylinder.js';
import {MyCone} from '../Primitives/MyCone.js';
import {MyDisc} from '../Primitives/MyDisc.js';
import { MyPaw } from './MyPaw.js';
import { CGFtexture } from '../../lib/CGF.js';
import { CGFappearance } from '../../lib/CGF.js';
import { MyPollen } from './MyPollen.js';

export class MyBee extends CGFobject {
    constructor(scene, hive) {
        super(scene);
        this.hive = hive;

        this.initAnimationProperties();

         // Bee's initial position and orientation
        this.position = { x: 0, y: 20, z: 0 }; 
        this.orientation = 0; // Orientation angle around the YY-axis (in radians)
        this.velocity = { x: 0, y: 0, z: 0 };
        

        this.maxSpeed = 25; // Maximum speed in units per second
        this.targetPosition = null; // Target position for the bee to fly to
        this.parabolicMovement = false;

        
        // Additional properties for pollen interaction
        this.pollen = null;  // This will store the pollen object when picked up
        this.defaultY = 20;  // Default flying height
        this.carryingPollen = false;
        this.droppingPollen = false;
        this.oldVelocity = 0;
        this.pollenHeight = 0;
        this.pollenOffsetZ = 0;
        this.noMovementAllowed = false;

        this.initMaterials(scene);

        this.initBuffers();
    }


    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];



        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    initAnimationProperties() {

        this.lastUpdateTime = 0;
        //bee oscillation animation
        this.yPosition = 0;  // Initial Y position
        this.animTime = 0;   // Track animation time
        this.oscillationAmplitude = 0.3; // Amplitude of the up and down oscillation
        this.oscillationPeriod = 1000; // One cycle every 1000 milliseconds (1 second)
        
        //wing flapping animation
        this.wingAngle = 0;  // Initial angle for wings
        this.flapAmplitude = 20; // Degrees: max rotation angle of the wings
        this.flapPeriod = 200; // Flapping cycle every 200 milliseconds

        this.stopped = false;
        this.pickUpAnimation = false;
    }

    goToPosition(position, reachedHive=false) {
        this.reachedHive = reachedHive;
        this.targetPosition = position; // Store the target position
        this.reachedTarget = false; // Reset the flag
    
        let dx = position[0] - this.position.x;
        let dz = position[1] - this.position.z;
        this.horizontalDistance = Math.sqrt(dx * dx + dz * dz);
    
        let angle = Math.atan2(dz, dx);
    
        this.turn(angle - this.orientation);
        this.accelerate(0.1);
    
        // Set up parameters for parabolic movement
        this.startPosition = { ...this.position }; // Store the starting position
        this.midPoint = {
            x: (this.startPosition.x + this.targetPosition[0]) / 2,
            y: this.startPosition.y + 5, // Raise mid-point to create a parabola
            z: (this.startPosition.z + this.targetPosition[1]) / 2
        };
        this.totalTime = 2; // Total time for the parabolic trajectory
        this.elapsedTime = 0; // Reset elapsed time
        this.parabolicMovement = true; // Flag to indicate parabolic movement

        this.noMovementAllowed = true;

        if (reachedHive) {
            this.pollenHeight = 20; // Hive height
        }
    }
    
    

    goDown(pollen, pollenHeight, pollenOffsetZ) {
        if (!this.stopped) {
            this.oldVelocity = { ...this.velocity }; // Store the current velocity
            this.velocity = { x: 0, y: -1, z: 0 }; // Set vertical downward velocity
            this.pollenHeight = pollenHeight;
            this.pollenOffsetZ = pollenOffsetZ;
        }
    }
    
    

    // Call this method when the bee picks up pollen
    pickUpPollen(pollen, pollenPosition, flower) {
        if (this.stopped) {
            this.stopped = false;
            this.pickUpAnimation = true;
    
            if (!this.carryingPollen && pollen) {
                // Calculate the distance to the pollen
                let dx = pollenPosition[0] - this.position.x;
                let dz = pollenPosition[1] - this.position.z;
                let distance = Math.sqrt(dx * dx + dz * dz);
    
                // If the distance is less than or equal to 3, pick up the pollen
                if (distance <= 3) {
                    this.pollen = pollen;
                    this.carryingPollen = true;
                    flower.pollen = null; // Remove pollen from the flower
                }
            }
        }
    }
    
    
    // Call this method to drop the pollen
    dropPollen() {
        if (this.carryingPollen) {
            this.carryingPollen = false;
            this.droppingPollen = true;
            this.pollenDropPosition = { x: this.position.x, y: this.position.y, z: this.position.z };
            this.pollenDropStartTime = Date.now();
        }
    }


    // Update the animation based on the time elapsed, t is the time in milliseconds
    update(t) {

    // Check if there is a desired position
    if (this.targetPosition) {
        if (this.parabolicMovement) {
            this.elapsedTime += (t - this.lastUpdateTime) / 1000.0;
            this.lastUpdateTime = t;

            if (this.elapsedTime >= this.totalTime) {
                this.position.x = this.targetPosition[0];
                this.position.y = this.pollenHeight;
                this.position.z = this.targetPosition[1];
                this.velocity = { x: 0, y: 0, z: 0 }; // Stop the bee
                this.parabolicMovement = false;

                if(!this.reachedHive){
                    this.stopped = true; // If not reaching the hive, stop the bee
                } 

                else{
                    this.noMovementAllowed = false;
                    this.dropPollen(); // Drop the pollen if the bee reached the hive
                }

                
                return;
            }

            let progress = this.elapsedTime / this.totalTime;
            this.position.x = (1 - progress) * (1 - progress) * this.startPosition.x + 2 * (1 - progress) * progress * this.midPoint.x + progress * progress * this.targetPosition[0];
            this.position.y = (1 - progress) * (1 - progress) * this.startPosition.y + 2 * (1 - progress) * progress * this.midPoint.y + progress * progress * this.pollenHeight;
            this.position.z = (1 - progress) * (1 - progress) * this.startPosition.z + 2 * (1 - progress) * progress * this.midPoint.z + progress * progress * this.targetPosition[1];

        } 
    }

    // Calculate elapsed time in seconds
    let delta_t = (t - this.lastUpdateTime) / 1000.0;
    this.lastUpdateTime = t;

    // Update position based on velocity
    this.position.x += this.velocity.x * delta_t;
    this.position.y += this.velocity.y * delta_t;
    this.position.z += this.velocity.z * delta_t;

    // Bee oscillation animation
    if (!this.stopped) {
        this.animTime = t % this.oscillationPeriod;
        const fraction = this.animTime / this.oscillationPeriod;
        this.yPosition = this.oscillationAmplitude * Math.sin(2 * Math.PI * fraction);

        // Wing flapping animation
        const flapTime = t % this.flapPeriod;
        const flapFraction = flapTime / this.flapPeriod;
        this.wingAngle = this.flapAmplitude * Math.sin(2 * Math.PI * flapFraction);
    }

    // Pick Up Animation
    if (this.pickUpAnimation) {
        if (this.position.y >= this.defaultY) {
            this.noMovementAllowed = false; //reset the movement flag
            this.pickUpAnimation = false;
            this.stopped = false;
            this.velocity = { ...this.oldVelocity }; // Restore the old velocity
        } else {
            this.position.y += 0.5; // Move upwards
        }
    }

     // Pollen Drop Animation
    if (this.droppingPollen) {
        let elapsedTime = (Date.now() - this.pollenDropStartTime) / 1000; // Time in seconds
        let dropDuration = 0.5; // Duration of the drop in seconds
        let dropHeight = 1; // Height from which pollen drops

        if (elapsedTime < dropDuration) {
            // Calculate the new position based on elapsed time
            let fallProgress = elapsedTime / dropDuration;
            this.pollenDropPosition.y -= dropHeight * fallProgress;
        } else {
            this.droppingPollen = false; // End the dropping animation
            this.hive.addPollen(this.pollen); // Add the pollen to the hive
        }
    }
}

    

    turn(angle) {
        if (this.noMovementAllowed) return; // Do nothing


        let speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.z ** 2);
        // Adjust orientation by the given angle (in radians)
        this.orientation += angle;
    
        // Update the direction component of the velocity vector
        this.velocity.x = Math.cos(this.orientation) * speed;
        this.velocity.z = Math.sin(this.orientation) * speed;
    }
    
    accelerate(increment) { 

        this.maxSpeed = 50 * increment; // We are multiplying by 50 because the max speed is 25 units and the normal increment is 0.5
        //increment is the speedFactor in MyInterface.js

        if (this.noMovementAllowed) return; // Do nothing


        // Adjust the speed by modifying the magnitude of the velocity vector
        let speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.z ** 2) + increment;
        speed = Math.min(speed, this.maxSpeed); // Clamp speed to the maximum speed
        
        if (speed < 0) {
            speed = 0;
        }
    
        this.velocity.x = Math.cos(this.orientation) * speed;
        this.velocity.z = Math.sin(this.orientation) * speed;
    }
    
    initMaterials(scene) {
        let headTexture = new CGFtexture(scene, 'images/bee_head.png');
        let headAppearance = new CGFappearance(scene);
        headAppearance.setTexture(headTexture);
        headAppearance.setTextureWrap('REPEAT', 'REPEAT');
        this.head = new MySphere(scene, 16, 8, 0.5, false, headAppearance);
    
        let pawTexture = new CGFtexture(scene, 'images/grey_hair.png');
        let pawAppearance = new CGFappearance(scene);
        pawAppearance.setTexture(pawTexture);
        pawAppearance.setTextureWrap('REPEAT', 'REPEAT');
        this.antenna1 = new MyCylinder(scene, 16, 5, 0.1, pawAppearance);
        this.antenna2 = new MyCylinder(scene, 16, 5, 0.1, pawAppearance);
    
        let eyeTexture = new CGFtexture(scene, 'images/bee_eye.png');
        let eyeAppearance = new CGFappearance(scene);
        eyeAppearance.setTexture(eyeTexture);
        eyeAppearance.setTextureWrap('REPEAT', 'REPEAT');
        this.eye1 = new MySphere(scene, 16, 8, 0.1, false, eyeAppearance);
        this.eye2 = new MySphere(scene, 16, 8, 0.1, false, eyeAppearance);
    
        let neckTexture = new CGFtexture(scene, 'images/bee_neck.jpg');
        let neckAppearance = new CGFappearance(scene);
        neckAppearance.setTexture(neckTexture);
        neckAppearance.setTextureWrap('REPEAT', 'REPEAT');
        this.neck = new MySphere(scene, 16, 8, 0.5, false, neckAppearance);
    
        let bodyTexture = new CGFtexture(scene, 'images/bee_body.jpg');
        let bodyAppearance = new CGFappearance(scene);
        bodyAppearance.setTexture(bodyTexture);
        bodyAppearance.setTextureWrap('REPEAT', 'REPEAT');
        this.body = new MySphere(scene, 16, 8, 0.5, false, bodyAppearance);
    
        let wingTexture = new CGFtexture(scene, 'images/bee_wing.png');
        let wingAppearance = new CGFappearance(scene);
        wingAppearance.setAmbient(0.5, 0.5, 0.4, 0.1);
        wingAppearance.setDiffuse(0.7, 0.7, 0.6, 0.1);
        wingAppearance.setSpecular(0.8, 0.8, 0.7, 0.1);
        wingAppearance.setEmission(0.9, 0.9, 0.6, 0.1);
        wingAppearance.setTexture(wingTexture);
        wingAppearance.setTextureWrap('REPEAT', 'REPEAT');
        this.wing1 = new MyDisc(scene, 20, 0.5, wingAppearance);
        this.wing2 = new MyDisc(scene, 20, 0.5, wingAppearance);
        this.wing3 = new MyDisc(scene, 20, 0.5, wingAppearance);
        this.wing4 = new MyDisc(scene, 20, 0.5, wingAppearance);
    
        this.stinger = new MyCone(scene, 16, 8, pawAppearance);
        
        this.paw1 = new MyPaw(scene, pawAppearance);
        this.paw2 = new MyPaw(scene, pawAppearance);
        this.paw3 = new MyPaw(scene, pawAppearance);
        this.paw4 = new MyPaw(scene, pawAppearance);
        this.paw5 = new MyPaw(scene, pawAppearance);
        this.paw6 = new MyPaw(scene, pawAppearance);
    }

    display() { 

        this.scene.pushMatrix();

        this.scene.translate(1, 0, 0);

        if (this.carryingPollen) {
            this.scene.pushMatrix();
            // Transform to position the pollen correctly relative to the bee
            this.scene.translate(this.position.x, this.position.y - 1, this.position.z);
            this.scene.rotate(-this.orientation, 0, 1, 0);
            
            // Apply vertical oscillation from the update method
            this.scene.translate(0, this.yPosition, 0);

            this.scene.scale(1.5,1.5,1.5)


            this.pollen.display();
            this.scene.popMatrix();
        }

       // Render the pollen if it is being dropped
        if (this.droppingPollen) {
            this.scene.pushMatrix();
            this.scene.translate(this.pollenDropPosition.x, this.pollenDropPosition.y, this.pollenDropPosition.z);
            this.scene.scale(1.8,1.8,1.8)
            this.pollen.display();
            this.scene.popMatrix();
        }
                
                


        // Translate to current position and rotate
        this.scene.translate(this.position.x, this.position.y, this.position.z);
        this.scene.rotate(-this.orientation, 0, 1, 0);


        // Apply vertical oscillation from the update method
        this.scene.translate(0, this.yPosition, 0);

       
        this.scene.pushMatrix();

        //rotate 180 degrees to face the correct direction
        this.scene.rotate(Math.PI, 0, 1, 0);

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/8, 0, 0, 1);
        this.scene.scale(1, 0.8, 0.7);

        this.head.display();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.3, 0.06, 0.2);
        this.scene.rotate(-Math.PI/6, 0, 0, 1) // rotate the eye
        this.scene.scale(1, 1.6, 1);
        this.eye1.display();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.3, 0.06, -0.2);
        this.scene.rotate(-Math.PI/6, 0, 0, 1) // rotate the eye
        this.scene.scale(1, 1.6, 1);
        this.eye2.display();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.1, 0.2, 0.2);
        this.scene.rotate(Math.PI/6, 0, 0, 1); // rotate the antenna
        this.scene.rotate(Math.PI/8, 1, 0, 0);
        this.scene.scale(0.1, 0.1, 0.1);
        this.antenna1.display();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.1, 0.2, -0.2);
        this.scene.rotate(Math.PI/6, 0, 0, 1); // rotate the antenna
        this.scene.rotate(-Math.PI/8, 1, 0, 0);
        this.scene.scale(0.1, 0.1, 0.1);
        this.antenna2.display();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.8, 0, 0);
        this.scene.scale(1, 0.8, 1);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.neck.display();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.1, -0.2, 0);
        this.scene.rotate(-Math.PI/8, 0, 0, 1);
        this.scene.scale(2, 1, 1);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.body.display();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.8, -0.5, 0);
        this.scene.rotate(-Math.PI/2 - Math.PI/6, 0, 0, 1);
        this.scene.scale(0.2, 0.5, 0.2);
        this.stinger.display();

        
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.6, 0, 0.4);
        this.scene.rotate(Math.PI/8, 0, 0, 1);
        this.paw1.display();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.6, 0, -0.4);
        this.scene.rotate(Math.PI/8, 0, 0, 1);
        this.scene.scale(1, 1, -1);
        this.paw2.display();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.5, 0, 0.3);
        this.paw3.display();
        
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.5, 0, -0.3);
        this.scene.scale(1, 1, -1);
        this.paw4.display();


        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.1, -0.1, 0.3);
        this.paw5.display();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.1, -0.1, -0.3);
        this.scene.scale(1, 1, -1);
        this.paw6.display();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(this.wingAngle * Math.PI / 180, 1, 0, 0); // Rotate around x-axis
        this.scene.translate(1, 0.3, 0.6);
        this.scene.rotate(-Math.PI/2 - Math.PI/8, 1, 0, 0);
        this.scene.rotate(Math.PI/3, 0, 0, 1);
        this.scene.rotate(Math.PI/7, 0, 1, 0);
        
        this.scene.scale(0.5, 1.6, 0.5);
        this.wing1.display();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-this.wingAngle * Math.PI / 180, 1, 0, 0); // Opposite rotation for other wing
        this.scene.translate(1, 0.3, -0.6);
        this.scene.rotate(-Math.PI/2 + Math.PI/8, 1, 0, 0);
        this.scene.rotate(-Math.PI/3, 0, 0, 1);
        this.scene.rotate(Math.PI/7, 0, 1, 0);
        this.scene.scale(0.5, 1.6, 0.5);
        this.wing2.display();

        this.scene.popMatrix(); 
        
        this.scene.pushMatrix();
        this.scene.rotate(this.wingAngle * Math.PI / 180, 1, 0, 0); // Rotate around x-axis
        this.scene.translate(1.5, 0.1, 0.7);
        this.scene.rotate(-Math.PI/2 - Math.PI/8, 1, 0, 0);
        this.scene.rotate(Math.PI/3, 0, 0, 1);
        this.scene.scale(0.5, 1.6, 0.5);
        this.wing3.display();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-this.wingAngle * Math.PI / 180, 1, 0, 0); // Opposite rotation for other wing
        this.scene.translate(1.5, 0.1, -0.7);
        this.scene.rotate(-Math.PI/2 + Math.PI/8, 1, 0, 0);
        this.scene.rotate(-Math.PI/3, 0, 0, 1);
        this.scene.scale(0.5, 1.6, 0.5);
        this.wing4.display();

        this.scene.popMatrix(); 

        this.scene.popMatrix(); //180 degrees rotation

        this.scene.popMatrix();
    }
}
