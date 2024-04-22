import {CGFobject} from '../../lib/CGF.js';
import { MyRock } from './MyRock.js';

export class MyRockSet extends CGFobject {
    constructor(scene, rockCount, radiusRange, displacementFactorRange) {
        super(scene);
        this.rockCount = rockCount;
        this.radiusRange = radiusRange;
        this.displacementFactorRange = displacementFactorRange;


        this.rocks = [];

        for (let i = 0; i < this.rockCount; i++) {
            // Randomize rock properties
            let radius = this.radiusRange[0] + Math.random() * (this.radiusRange[1] - this.radiusRange[0]);
            let displacementFactor = this.displacementFactorRange[0] + Math.random() * (this.displacementFactorRange[1] - this.displacementFactorRange[0]);
            
            // Create and store the new rock
            let rock = new MyRock(this.scene, 16, 16, radius, displacementFactor);
            this.rocks.push(rock);
        }
    }

    display() { 
        for (let rock of this.rocks) {
            this.scene.pushMatrix();

            /*
            // Apply random transformations to each rock for a natural look
            let translateX = Math.random() - 0.5;
            let translateY = Math.random() - 0.5;
            let translateZ = Math.random() - 0.5;

            this.scene.translate(translateX, translateY, translateZ);

        
            // Random scaling factors for non-uniform scaling
            let scaleX = 0.5 + Math.random();
            let scaleY = 0.5 + Math.random();
            let scaleZ = 0.5 + Math.random();
            this.scene.scale(scaleX, scaleY, scaleZ);
            
            // Random orientation
            let rotateAngleX = Math.random() * 2 * Math.PI;
            let rotateAngleY = Math.random() * 2 * Math.PI;
            let rotateAngleZ = Math.random() * 2 * Math.PI;
            this.scene.rotate(rotateAngleX, 1, 0, 0);
            this.scene.rotate(rotateAngleY, 0, 1, 0);
            this.scene.rotate(rotateAngleZ, 0, 0, 1);
            */


            rock.display();

            this.scene.popMatrix();

        }
    }

}