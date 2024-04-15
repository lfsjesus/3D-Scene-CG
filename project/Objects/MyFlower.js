import { CGFobject } from "../../lib/CGF.js";
import { CGFappearance } from "../../lib/CGF.js";
import { MyStem } from "./MyStem.js";
import { MyPetal } from "./MyPetal.js";
import { MyReceptacle } from "./MyReceptacle.js"

export class MyFlower extends CGFobject {
    constructor(scene, numPetals, flowerRadius, receptacleRadius, stemRadius, numStems,  petalColor, recepColor, stemColor, leafColor) {
        super(scene);
        this.receptacle = new MyReceptacle(scene, 16, 8, receptacleRadius);

        // array of petals with angle increment of 2*PI/numPetals
        this.petals = [];

        for (let i = 0; i < numPetals; i++) {
            
            let rotateAngle = 2 * Math.PI * i/numPetals;
            
            let curvatureAngle = Math.random() * Math.PI/2 - Math.PI/4;

            let heartAngle = Math.random() * Math.PI/4 - Math.PI/8;

            this.petals.push(new MyPetal(scene, flowerRadius, rotateAngle, curvatureAngle, heartAngle));
        }

        this.stems = [];
        
        for (let i = 0; i < numStems; i++) {

            //the height of each stem should be random between 0.5 and 2, inclusive
            let height = Math.random() * 1 + 0.5;
            
            //the stems should have a random curvature angle between -PI/8 and PI/8
            let curvatureAngle = Math.random() * Math.PI/4 - Math.PI/8;
            this.stems.push(new MyStem(scene, 16, height, stemRadius, curvatureAngle));

            //between each pair of stems, there should be added a new stem with a petal new MyStem(scene, 16, 0.1, radius, curvatureAngle, true)
            if(i < numStems-1){
                this.stems.push(new MyStem(scene, 16, 0.1, stemRadius, curvatureAngle, true));
            }
            

        }
        console.log(this.stems);
    }

    display() {
        let stemHeight = 0;
        let offsetZ = 0;
        let lastCurvature = 0;
    
        this.scene.pushMatrix();
    
        for (let i = 0; i < this.stems.length; i++) {
            let stem = this.stems[i];
            

            this.scene.pushMatrix();

            //translate the stem to the correct height and offset
            this.scene.translate(0, stemHeight, offsetZ);
    
           
            this.scene.rotate(stem.curvatureAngle, 1, 0, 0);
            let blueMaterial = new CGFappearance(this.scene);
            if(stem.hasPetal){
                //make the color of the stem blue
                
                blueMaterial.setAmbient(0, 0, 1, 1); // Blue color in RGBA
                blueMaterial.apply();
            }

            // Draw the stem
            stem.display();

            //reset the material to the default
            blueMaterial = new CGFappearance(this.scene);
            blueMaterial.setAmbient(1, 1, 1, 1); // Default color in RGBA
            blueMaterial.apply();
    
            this.scene.popMatrix();
    
            // Update stemHeight with the height of this stem to position the next one correctly
            stemHeight += stem.height * Math.cos(stem.curvatureAngle);
            offsetZ += stem.height * Math.sin(stem.curvatureAngle);
            lastCurvature = stem.curvatureAngle;
        }
    
        this.scene.popMatrix();
    
        // Now, translate everything up by the total height of the stems
        this.scene.pushMatrix();
        this.scene.translate(0, stemHeight, offsetZ);
        this.scene.rotate(lastCurvature + 2, 1, 0, 0);
    
        // MyReceptacle
        this.receptacle.display();
    
        // Add petals around the top of the stem
        for (let petal of this.petals) {
            this.scene.pushMatrix();
            // Rotate the petal into position
            this.scene.rotate(petal.rotateAngle, 0, 0, 1);
            this.scene.rotate(petal.heartAngle, 1, 0, 0);
            petal.display();
            this.scene.popMatrix();
        }
    
        this.scene.popMatrix();
    }
    
}
