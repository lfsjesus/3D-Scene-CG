import { CGFobject } from "../../lib/CGF.js";
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

            //the height of each stem should be random between 1 and 2, inclusive
            //let height = Math.random() + 1;
            let height = 1;
            
            //the stems should have a random curvature angle between -PI/8 and PI/8
            let curvatureAngle = Math.random() * Math.PI/4 - Math.PI/8;
            this.stems.push(new MyStem(scene, 16, height, stemRadius, curvatureAngle));
        }
        console.log(this.stems);
    }

    display() {
        // Add stems
        let stemHeight = 0;
        
        this.scene.pushMatrix();

        for (let i = 0; i < this.stems.length; i++) {
            let stem = this.stems[i];

            if (i > 0) { // Only translate if it's not the first stem
                this.scene.translate(0, stem.height, 0);
            }

            // Always rotate
            this.scene.rotate(stem.curvatureAngle, 1, 0, 0);
            stem.display();
            stemHeight += stem.height;
        }

        this.scene.popMatrix();


        // TRANSLATE EVERYTHING UP TO THE TOP OF THE STEM
        this.scene.pushMatrix();
        this.scene.translate(0, stemHeight, 0);

        // MyReceptacle
        this.scene.pushMatrix();
        this.receptacle.display();
        this.scene.popMatrix();


        // Add petals
        this.scene.pushMatrix();
        
        for (let petal of this.petals) {

            this.scene.pushMatrix();
            //Rotate the petal by rotateAngle and heartAngle
            this.scene.rotate(petal.heartAngle, 1, 0, 0);
            this.scene.rotate(petal.rotateAngle, 0, 0, 1);
            petal.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();

        this.scene.popMatrix();
        


    }
}
