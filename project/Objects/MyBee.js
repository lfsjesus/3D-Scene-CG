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
    constructor(scene) {
        super(scene);

        this.initAnimationProperties();

         // Bee's initial position and orientation
        this.position = { x: 0, y: 20, z: 0 }; // Position in 3D space
        this.orientation = 0; // Orientation angle around the YY-axis (in radians)
        this.velocity = { x: 0, y: 0, z: 0 }; // Velocity vector

        this.maxSpeed = 25; // Maximum speed in units per second


        // Additional properties for pollen interaction
        this.pollen = null;  // This will store the pollen object when picked up
        this.defaultY = 20;  // Default flying height
        this.carryingPollen = false;
        this.oldVelocity = 0;


        this.pollenHeight = 0;
        this.pollenOffsetZ = 0;

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

        this.goDownAnimation = false;
        this.stopped = false;
        this.pickUpAnimation = false;
    }

    goToPosition(position) {
        let dx = position[0] - this.position.x;
        let dz = position[1] - this.position.z;

        let angle = Math.atan2(dz, dx);

        this.turn(angle - this.orientation);
        this.accelerate(5);
    }

    goDown(pollen, pollenHeight, pollenOffsetZ) {
        this.goDownAnimation = true;
        this.pollenHeight = pollenHeight;
        this.pollenOffsetZ = pollenOffsetZ;
    }

    // Call this method when the bee picks up pollen
    pickUpPollen(pollen, pollenPosition) {

        if(this.stopped){

        this.stopped = false;
        this.pickUpAnimation = true;

        if (!this.carryingPollen && pollen) {

            //calculate my distance to the pollen
            let dx = pollenPosition[0] - this.position.x;
            let dz = pollenPosition[1] - this.position.z;

            let distance = Math.sqrt(dx * dx + dz * dz);

            //if the distance is less than 1, then pick up the pollen
            if (distance < 3) {
                this.pollen = pollen;
                this.carryingPollen = true;
            }
        };
        }
    }

    // Call this method to drop the pollen
    dropPollen() {
        if (this.carryingPollen) {
            this.carryingPollen = false;
            let droppedPollen = this.pollen;
            this.pollen = null;
            return droppedPollen;  // Return the pollen object to be managed by the scene or hive
        }
        return null;
    }


    // Update the animation based on the time elapsed, t is the time in milliseconds
    update(t) {

        // Keeping the old velocity when picking up pollen
        if (this.goDownAnimation || this.stopped) {
            this.oldVelocity = this.velocity;
            this.velocity = { x: 0, y: this.velocity.y, z: 0 };
        }

        // Calculate elapsed time in seconds
        let delta_t = (t - this.lastUpdateTime) / 1000.0;
        this.lastUpdateTime = t;

        // Update position based on velocity
        this.position.x += this.velocity.x * delta_t;
        this.position.y += this.velocity.y * delta_t;
        this.position.z += this.velocity.z * delta_t;

        if(!this.stopped){

        //bee oscillation animation
        this.animTime = t % this.oscillationPeriod;
        const fraction = this.animTime / this.oscillationPeriod;
        this.yPosition = this.oscillationAmplitude * Math.sin(2 * Math.PI * fraction);
    
        //wing flapping animation
        const flapTime = t % this.flapPeriod;
        const flapFraction = flapTime / this.flapPeriod;
        this.wingAngle = this.flapAmplitude * Math.sin(2 * Math.PI * flapFraction);
        
        }

        //Go Down Animation

        if(this.goDownAnimation && this.position.y >= this.pollenHeight){
            if(this.position.y - 0.5 <= this.pollenHeight){
                this.goDownAnimation = false;
                this.stopped = true;
            }
            this.position.y -= 0.5;
        }


        //Pick Up Animation
        if(this.pickUpAnimation && this.position.y <= this.defaultY){
            if(this.position.y + 0.5 >= this.defaultY){
                this.pickUpAnimation = false;
                this.velocity = this.oldVelocity;
                this.position.y = this.defaultY;
            }
            this.position.y += 0.5;
        }
        

    }

    turn(angle) {
        let speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.z ** 2);
        // Adjust orientation by the given angle (in radians)
        this.orientation += angle;
    
        // Update the direction component of the velocity vector
        this.velocity.x = Math.cos(this.orientation) * speed;
        this.velocity.z = Math.sin(this.orientation) * speed;
    }
    
    accelerate(increment) {
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
